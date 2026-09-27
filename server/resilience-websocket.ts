import type { IncomingMessage, Server as HttpServer } from "node:http";
import type { Duplex } from "node:stream";
import { WebSocketServer } from "ws";

/**
 * Transport-only WebSocket used by the beta resilience gate.
 *
 * It deliberately exposes no account, chat, wallet, market, or application
 * state. The endpoint exists so production-artifact CI can prove that HTTP
 * upgrade, disconnect, reconnect, and ping/pong behavior survive real server
 * restarts before richer realtime features are promoted.
 */
export function attachResilienceWebSocket(server: HttpServer) {
  const wss = new WebSocketServer({
    noServer: true,
    perMessageDeflate: false,
    maxPayload: 4096,
  });

  const onUpgrade = (
    req: IncomingMessage,
    socket: Duplex,
    head: Buffer
  ) => {
    let pathname = "";
    try {
      pathname = new URL(req.url || "/", "http://localhost").pathname;
    } catch {
      return;
    }

    if (pathname !== "/ws/resilience") return;

    wss.handleUpgrade(req, socket, head, ws => {
      wss.emit("connection", ws, req);
    });
  };

  server.on("upgrade", onUpgrade);

  wss.on("connection", ws => {
    ws.send(
      JSON.stringify({
        type: "ready",
        transport: "websocket",
        timestamp: Date.now(),
      })
    );

    ws.on("message", raw => {
      let message: { type?: unknown; id?: unknown };
      try {
        message = JSON.parse(raw.toString());
      } catch {
        ws.close(1003, "invalid json");
        return;
      }

      if (message.type !== "ping") {
        ws.send(JSON.stringify({ type: "error", error: "unsupported_message" }));
        return;
      }

      ws.send(
        JSON.stringify({
          type: "pong",
          id: typeof message.id === "string" ? message.id : null,
          timestamp: Date.now(),
        })
      );
    });

    // A client-level socket error must not crash the HTTP server.
    ws.on("error", () => {});
  });

  server.once("close", () => {
    server.off("upgrade", onUpgrade);
    wss.close();
  });

  return wss;
}
