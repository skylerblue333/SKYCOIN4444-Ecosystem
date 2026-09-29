import { describe, expect, it } from "vitest";
import { TRPCError } from "@trpc/server";
import { legacyNumericUserId } from "./legacy-user-id.js";

describe("legacyNumericUserId", () => {
  it.each([
    ["0", 0],
    ["1", 1],
    ["42", 42],
    [String(Number.MAX_SAFE_INTEGER), Number.MAX_SAFE_INTEGER],
  ])("accepts canonical decimal identity %s", (input, expected) => {
    expect(legacyNumericUserId(input)).toBe(expected);
  });

  it.each([
    "",
    "01",
    "00",
    "+1",
    "-0",
    "-1",
    "1e3",
    "0x10",
    " 1",
    "1 ",
    "1.0",
    "9007199254740992",
    "beta_email_abc",
  ])("rejects non-canonical or unsafe identity %s", input => {
    expect(() => legacyNumericUserId(input)).toThrow(TRPCError);
  });
});
