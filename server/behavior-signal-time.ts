import { userBehaviorSignals } from "../drizzle/schema.js";

/**
 * Activity-window queries intentionally use the original created_at column.
 *
 * Older deployed beta databases predate the later recorded_at schema field,
 * while created_at has existed since the initial user_behavior_signals table.
 * Using the original timestamp keeps the monitor compatible across those
 * schema versions without fabricating or backfilling production data.
 */
export const behaviorSignalActivityTimestamp =
  userBehaviorSignals.createdAt;
