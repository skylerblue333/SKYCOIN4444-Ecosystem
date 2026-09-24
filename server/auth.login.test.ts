import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function publicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("auth.login", () => {
  it("does not claim success for unimplemented email/password authentication", async () => {
    const caller = appRouter.createCaller(publicContext());

    await expect(
      caller.auth.login({
        email: "beta-user@example.com",
        password: "not-a-real-password",
      })
    ).rejects.toMatchObject({
      code: "PRECONDITION_FAILED",
    });
  });
});
