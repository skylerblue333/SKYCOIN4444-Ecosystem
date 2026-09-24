import { afterEach, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { users } from "../drizzle/schema";
import { db, getUserByEmail, getUserById } from "./db";

const id = "persistence-regression-user";
const email = "persistence-regression@example.test";

afterEach(async () => {
  await db.delete(users).where(eq(users.id, id));
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
});
