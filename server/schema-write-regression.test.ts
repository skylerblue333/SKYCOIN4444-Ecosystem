import { describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { datingProfiles, users } from "../drizzle/schema";

describe("canonical schema writes", () => {
  it("persists a user and dating profile through Drizzle without duplicate columns", async () => {
    const userId = "schema-write-regression-user";
    const profileId = "schema-write-regression-profile";

    await db.delete(datingProfiles).where(eq(datingProfiles.id, profileId));
    await db.delete(users).where(eq(users.id, userId));

    try {
      await db.insert(users).values({
        id: userId,
        email: "schema-write-regression@example.test",
        username: "schema-write-regression",
        name: "Schema Write Regression",
        xp: 7,
      });

      await db.insert(datingProfiles).values({
        id: profileId,
        userId,
        location: "Test City",
        age: 30,
      });

      const [user] = await db.select().from(users).where(eq(users.id, userId));
      const [profile] = await db
        .select()
        .from(datingProfiles)
        .where(eq(datingProfiles.id, profileId));

      expect(user?.name).toBe("Schema Write Regression");
      expect(user?.xp).toBe(7);
      expect(profile?.location).toBe("Test City");
      expect(profile?.userId).toBe(userId);
    } finally {
      await db.delete(datingProfiles).where(eq(datingProfiles.id, profileId));
      await db.delete(users).where(eq(users.id, userId));
    }
  });
});
