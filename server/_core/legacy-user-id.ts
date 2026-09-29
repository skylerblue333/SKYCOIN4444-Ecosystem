import { TRPCError } from "@trpc/server";

const CANONICAL_DECIMAL_USER_ID = /^(0|[1-9]\d*)$/;

export function legacyNumericUserId(userId: string): number {
  if (!CANONICAL_DECIMAL_USER_ID.test(userId)) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message:
        "This legacy subsystem is not yet migrated to canonical string user IDs.",
    });
  }

  const numericId = Number(userId);
  if (
    !Number.isSafeInteger(numericId) ||
    numericId < 0 ||
    String(numericId) !== userId
  ) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message:
        "This legacy subsystem is not yet migrated to canonical string user IDs.",
    });
  }

  return numericId;
}
