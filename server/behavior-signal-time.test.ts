import { describe, expect, it } from "vitest";
import { getTableColumns } from "drizzle-orm";
import { userBehaviorSignals } from "../drizzle/schema.js";
import { behaviorSignalActivityTimestamp } from "./behavior-signal-time.js";

describe("behavior signal runtime schema compatibility", () => {
  it("uses the original created_at timestamp for activity windows", () => {
    const columns = getTableColumns(userBehaviorSignals);

    expect(behaviorSignalActivityTimestamp).toBe(columns.createdAt);
    expect(columns.createdAt.name).toBe("created_at");
  });
});
