import { describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { datingProfiles, notifications, posts, users } from "../drizzle/schema";

describe("canonical schema writes", () => {
  it("persists a user and dating profile through Drizzle without duplicate columns", async () => {
    const userId = "schema-write-regression-user";
    const profileId = "schema-write-regression-profile";
    const postId = "schema-write-regression-post";
    const notificationId = "schema-write-regression-notification";

    await db.delete(notifications).where(eq(notifications.id, notificationId));
    await db.delete(posts).where(eq(posts.id, postId));
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

      await db.insert(posts).values({
        id: postId,
        userId,
        content: "Schema regression post",
      });

      await db.insert(notifications).values({
        id: notificationId,
        userId,
        type: "test",
        content: "Schema regression notification",
        read: false,
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

      const [post] = await db.select().from(posts).where(eq(posts.id, postId));
      const [notification] = await db
        .select()
        .from(notifications)
        .where(eq(notifications.id, notificationId));
      expect(post?.content).toBe("Schema regression post");
      expect(notification?.content).toBe("Schema regression notification");
    } finally {
      await db.delete(notifications).where(eq(notifications.id, notificationId));
      await db.delete(posts).where(eq(posts.id, postId));
      await db.delete(datingProfiles).where(eq(datingProfiles.id, profileId));
      await db.delete(users).where(eq(users.id, userId));
    }
  });
});
