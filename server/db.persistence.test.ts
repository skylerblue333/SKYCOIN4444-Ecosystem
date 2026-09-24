import { afterEach, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { users } from "../drizzle/schema";
import { db, getUserByEmail, getUserById, getUserByOpenId, upsertUser } from "./db";

const id = "persistence-regression-user";
const email = "persistence-regression@example.test";
const oauthOpenId = "oauth-persistence-regression";

afterEach(async () => {
  await db.delete(users).where(eq(users.id, id));
  await db.delete(users).where(eq(users.openId, oauthOpenId));
});

describe("persistent user reads", () => {
  it("reads a committed MySQL user by id and email", async () => {
    await db.delete(users).where(eq(users.id, id));
    await db.insert(users).values({
      id,
      openId: id,
      email,
      username: id,
      name: "Persistence Regression",
      loginMethod: "test",
    });

    const byId = await getUserById(id);
    const byEmail = await getUserByEmail(email);

    expect(byId?.id).toBe(id);
    expect(byId?.name).toBe("Persistence Regression");
    expect(byEmail?.id).toBe(id);
    expect(byEmail?.email).toBe(email);
  });

  it("persists a new OAuth-style user without a preassigned id", async () => {
    await db.delete(users).where(eq(users.openId, oauthOpenId));

    await upsertUser({
      openId: oauthOpenId,
      email: "oauth-persistence@example.test",
      name: "OAuth Persistence",
      loginMethod: "oauth",
    });

    const user = await getUserByOpenId(oauthOpenId);
    expect(user?.id).toBe(oauthOpenId);
    expect(user?.openId).toBe(oauthOpenId);
    expect(user?.name).toBe("OAuth Persistence");
  });
});
