import { describe, expect, it } from "vitest";
import type { Request } from "express";
import { getSessionCookieOptions } from "./_core/cookies";

function request(
  protocol: "http" | "https",
  headers: Record<string, string | string[]> = {}
) {
  return { protocol, headers } as unknown as Request;
}

describe("session cookie security policy", () => {
  it("uses a browser-accepted first-party cookie on insecure local HTTP", () => {
    expect(getSessionCookieOptions(request("http"))).toEqual({
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: false,
    });
  });

  it("uses SameSite=None only with Secure on HTTPS", () => {
    expect(getSessionCookieOptions(request("https"))).toEqual({
      httpOnly: true,
      path: "/",
      sameSite: "none",
      secure: true,
    });
  });

  it("honors HTTPS behind a trusted reverse proxy header", () => {
    expect(
      getSessionCookieOptions(
        request("http", { "x-forwarded-proto": "https" })
      )
    ).toEqual({
      httpOnly: true,
      path: "/",
      sameSite: "none",
      secure: true,
    });
  });
});
