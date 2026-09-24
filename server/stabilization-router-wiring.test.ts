import { afterAll, describe, expect, it } from "vitest";
import type { TrpcContext } from "./_core/context";
import { appRouter } from "./routers";
import { getDb } from "./db";
import { sql } from "drizzle-orm";

const TEST_USER_ID = "stabilization-string-user";

function createContext(): TrpcContext {
  return {
    user: {
      id: TEST_USER_ID,
      openId: "stabilization-open-id",
      email: "stabilization@example.test",
      name: "Stabilization User",
      loginMethod: "test",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => undefined } as unknown as TrpcContext["res"],
  };
}

describe("stabilization router wiring", () => {
  const caller = appRouter.createCaller(createContext());

  it("exposes the real economic router and persists a string user id", async () => {
    const balance = await caller.economy.getBalance();
    expect(balance.balance).toBeTypeOf("number");
    expect(balance.totalEarned).toBeTypeOf("number");
    expect(balance.totalFeesPaid).toBeTypeOf("number");

    const schedule = await caller.economy.getFeeSchedule();
    expect(schedule.flatFees).toHaveProperty("post");
    expect(schedule.percentageFees).toHaveProperty("swap");

    const ledger = await caller.economy.getLedger({ limit: 10, offset: 0 });
    expect(Array.isArray(ledger.transactions)).toBe(true);
  });

  it("exposes the real compliance router and accepts a string user id", async () => {
    const summary = await caller.complianceIntelligence.getComplianceSummary();
    expect(summary.score).toBeTypeOf("number");
    expect(Array.isArray(summary.issues)).toBe(true);

    const consents = await caller.complianceIntelligence.getConsents();
    expect(consents.consents).toHaveLength(6);
  });
});

afterAll(async () => {
  const db = await getDb();
  if (!db) return;
  await db.execute(sql`DELETE FROM compliance_audit_log WHERE user_id = ${TEST_USER_ID}`);
  await db.execute(sql`DELETE FROM consent_records WHERE user_id = ${TEST_USER_ID}`);
  await db.execute(sql`DELETE FROM data_deletion_requests WHERE user_id = ${TEST_USER_ID}`);
  await db.execute(sql`DELETE FROM kyc_records WHERE user_id = ${TEST_USER_ID}`);
  await db.execute(sql`DELETE FROM sky_wallet_ledger WHERE user_id = ${TEST_USER_ID}`);
  await db.execute(sql`DELETE FROM sky_balances WHERE user_id = ${TEST_USER_ID}`);
  await db.execute(sql`DELETE FROM sky_treasury WHERE from_user_id = ${TEST_USER_ID}`);
});
