import { userBehaviorSignals } from "../drizzle/schema.js";

/**
 * Activity-window queries intentionally use the original created_at column.
 *
 * Deployed beta databases can predate the later recorded_at schema field,
 * while created_at has existed since the original user_behavior_signals table.
 * Keeping this boundary explicit avoids requiring an unverified live DDL change
 * just to keep periodic monitoring compatible across schema versions.
 */
export const behaviorSignalActivityTimestamp = userBehaviorSignals.createdAt;
