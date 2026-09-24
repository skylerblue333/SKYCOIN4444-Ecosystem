import { afterEach, describe, expect, it, vi } from "vitest";
import { requireHealthAdmin } from "./health-monitor";

function mockResponse() {
  const res: any = {
    statusCode: 200,
    body: undefined,
    status: vi.fn((code: number) => {
      res.statusCode = code;
      return res;
    }),
    json: vi.fn((body: unknown) => {
      res.body = body;
      return res;
    }),
  };
  return res;
}

afterEach(() => {
  delete process.env.HEALTH_ADMIN_TOKEN;
});

describe("health diagnostics authorization", () => {
  it("fails closed when no health admin token is configured", () => {
    const req: any = { get: vi.fn(() => undefined) };
    const res = mockResponse();
    const next = vi.fn();

    requireHealthAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(503);
    expect(res.json).toHaveBeenCalledWith({
      error: "Health admin controls are not configured",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("rejects an invalid bearer token", () => {
    process.env.HEALTH_ADMIN_TOKEN = "a".repeat(40);
    const req: any = {
      get: vi.fn(() => `Bearer ${"b".repeat(40)}`),
    };
    const res = mockResponse();
    const next = vi.fn();

    requireHealthAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it("accepts the configured bearer token", () => {
    const token = "health-admin-token-that-is-long-enough-4444";
    process.env.HEALTH_ADMIN_TOKEN = token;
    const req: any = { get: vi.fn(() => `Bearer ${token}`) };
    const res = mockResponse();
    const next = vi.fn();

    requireHealthAdmin(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });
});
