import { describe, expect, it } from "vitest";
import {
  streamLLMText,
  type LLMStreamChunk,
  type LLMStreamClient,
} from "./_core/llm";

async function* chunkStream(
  chunks: LLMStreamChunk[]
): AsyncGenerator<LLMStreamChunk, void, unknown> {
  for (const chunk of chunks) {
    yield chunk;
  }
}

describe("streamLLMText", () => {
  it("forwards real provider text deltas without fabricating chunks", async () => {
    const calls: Array<{
      body: Record<string, unknown>;
      signal?: AbortSignal;
    }> = [];

    const client: LLMStreamClient = {
      chat: {
        completions: {
          create: async (body, options) => {
            calls.push({ body, signal: options?.signal });
            return chunkStream([
              { choices: [{ delta: { content: "Hello" } }] },
              { choices: [{ delta: { content: null } }] },
              { choices: [{ delta: { content: " world" } }] },
            ]);
          },
        },
      },
    };

    const deltas: string[] = [];
    for await (const delta of streamLLMText(
      {
        model: "test-model",
        messages: [{ role: "user", content: "Say hello" }],
      },
      { client }
    )) {
      deltas.push(delta);
    }

    expect(deltas).toEqual(["Hello", " world"]);
    expect(calls).toHaveLength(1);
    expect(calls[0]?.body).toMatchObject({
      model: "test-model",
      stream: true,
    });
    expect(calls[0]?.body.messages).toEqual([
      { role: "user", name: undefined, content: "Say hello" },
    ]);
  });

  it("passes the caller abort signal to the upstream streaming client", async () => {
    const controller = new AbortController();
    let receivedSignal: AbortSignal | undefined;

    const client: LLMStreamClient = {
      chat: {
        completions: {
          create: async (_body, options) => {
            receivedSignal = options?.signal;
            return chunkStream([]);
          },
        },
      },
    };

    for await (const _delta of streamLLMText(
      {
        messages: [{ role: "user", content: "test" }],
      },
      { client, signal: controller.signal }
    )) {
      // Empty stream by design.
    }

    expect(receivedSignal).toBe(controller.signal);
  });

  it("forwards max token limits to the compatible provider request", async () => {
    let request: Record<string, unknown> | undefined;

    const client: LLMStreamClient = {
      chat: {
        completions: {
          create: async body => {
            request = body;
            return chunkStream([]);
          },
        },
      },
    };

    for await (const _delta of streamLLMText(
      {
        messages: [{ role: "user", content: "test" }],
        maxTokens: 321,
      },
      { client }
    )) {
      // Empty stream by design.
    }

    expect(request?.max_tokens).toBe(321);
  });
});
