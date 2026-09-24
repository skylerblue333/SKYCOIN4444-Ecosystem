import { afterAll, describe, expect, it } from "vitest";
import { and, eq } from "drizzle-orm";
import type { TrpcContext } from "./_core/context";
import { intelligenceRouter } from "./intelligence-router";
import { getDb } from "./db";
import { saveHopeAIMessage } from "./db-intelligence";
import { hopeAiMessages, twinMemory } from "../drizzle";

const USER_ID = "intelligence-router-string-user";
const SESSION_ID = "intelligence-router-test-session";

function createContext(): TrpcContext {
  return {
    user: {
      id: USER_ID,
      openId: "intelligence-router-open-id",
      email: "intelligence-router@example.test",
      name: "Intelligence Test User",
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

describe("intelligence router persistence", () => {
  it("builds Mission Control for a canonical string user id", async () => {
    const caller = intelligenceRouter.createCaller(createContext());
    const today = await caller.missionControl.today({ withSuggestions: false });

    expect(today.greetingName).toBe("Intelligence Test User");
    expect(Array.isArray(today.activeMissions)).toBe(true);
    expect(Array.isArray(today.topOpportunities)).toBe(true);
    expect(today.unreadNotifications).toBeTypeOf("number");
    expect(today.unreadMessages).toBeTypeOf("number");
  });

  it("persists grounded HOPE AI turns with session metadata", async () => {
    const id = await saveHopeAIMessage({
      userId: USER_ID,
      role: "assistant",
      content: "Durable test response",
      tone: "supportive",
      emotionalState: "neutral",
      sessionId: SESSION_ID,
    });
    expect(id).toBeTypeOf("number");

    const db = await getDb();
    expect(db).toBeTruthy();
    const rows = await db!
      .select()
      .from(hopeAiMessages)
      .where(
        and(
          eq(hopeAiMessages.userId, USER_ID),
          eq(hopeAiMessages.sessionId, SESSION_ID)
        )
      );

    expect(rows).toHaveLength(1);
    expect(rows[0]?.role).toBe("assistant");
    expect(rows[0]?.content).toBe("Durable test response");
    expect(rows[0]?.tone).toBe("supportive");
  });
});

afterAll(async () => {
  const db = await getDb();
  if (!db) return;
  await db
    .delete(hopeAiMessages)
    .where(eq(hopeAiMessages.userId, USER_ID));
  await db.delete(twinMemory).where(eq(twinMemory.userId, USER_ID));
});
