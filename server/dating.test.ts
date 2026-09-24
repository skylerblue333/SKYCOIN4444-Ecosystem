import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { and, eq, inArray, or, sql } from "drizzle-orm";
import { db } from "./db";
import {
  users,
  datingProfiles,
  datingMatches,
  datingMessages,
  datingSubscriptions,
  datingNotifications,
  datingLikes,
} from "../drizzle/schema";

describe("Dating System", () => {
  const testUserId1 = "dating-test-user-1";
  const testUserId2 = "dating-test-user-2";
  const testUserIds = [testUserId1, testUserId2];

  async function cleanupTestRows() {
    await db
      .delete(datingMessages)
      .where(inArray(datingMessages.senderId, testUserIds));
    await db
      .delete(datingNotifications)
      .where(inArray(datingNotifications.userId, testUserIds));
    await db
      .delete(datingLikes)
      .where(inArray(datingLikes.userId, testUserIds));
    await db
      .delete(datingSubscriptions)
      .where(inArray(datingSubscriptions.userId, testUserIds));
    await db
      .delete(datingMatches)
      .where(
        or(
          inArray(datingMatches.userId1, testUserIds),
          inArray(datingMatches.userId2, testUserIds)
        )
      );
    await db
      .delete(datingProfiles)
      .where(inArray(datingProfiles.userId, testUserIds));
    await db.delete(users).where(inArray(users.id, testUserIds));
  }

  beforeEach(async () => {
    await cleanupTestRows();
    // The users schema exposes legacy aliases that map to the same physical
    // columns (name/displayName and xp/level). A generic ORM insert therefore
    // emits duplicate MySQL column names. Seed only the physical columns needed
    // by these foreign-key integration tests.
    await db.execute(sql`
      INSERT INTO users (id, email, username, name)
      VALUES
        (${testUserId1}, 'dating-user-1@example.test', 'dating-test-user-1', 'Dating Test User 1'),
        (${testUserId2}, 'dating-user-2@example.test', 'dating-test-user-2', 'Dating Test User 2')
    `);
  });

  afterEach(async () => {
    await cleanupTestRows();
  });

  describe("Profile Management", () => {
    it("creates a profile using the current schema", async () => {
      await db.insert(datingProfiles).values({
        id: "profile-1",
        userId: testUserId1,
        age: 28,
        gender: "male",
        bio: "Test bio",
        interests: JSON.stringify(["hiking", "photography"]),
        location: "Test City",
        lookingFor: "female",
      });

      const [profile] = await db
        .select()
        .from(datingProfiles)
        .where(eq(datingProfiles.id, "profile-1"));

      expect(profile).toMatchObject({
        id: "profile-1",
        userId: testUserId1,
        age: 28,
        gender: "male",
        bio: "Test bio",
        location: "Test City",
        lookingFor: "female",
      });
    });

    it("updates a dating profile", async () => {
      await db.insert(datingProfiles).values({
        id: "profile-2",
        userId: testUserId1,
        age: 28,
        bio: "Original bio",
      });

      await db
        .update(datingProfiles)
        .set({ bio: "Updated bio", age: 29 })
        .where(eq(datingProfiles.id, "profile-2"));

      const [updated] = await db
        .select()
        .from(datingProfiles)
        .where(eq(datingProfiles.id, "profile-2"));

      expect(updated.bio).toBe("Updated bio");
      expect(updated.age).toBe(29);
    });

    it("stores profile preference fields represented by the schema", async () => {
      const interests = JSON.stringify(["hiking", "photography", "chess"]);
      await db.insert(datingProfiles).values({
        id: "profile-3",
        userId: testUserId1,
        age: 28,
        interests,
        lookingFor: "everyone",
        verified: true,
      });

      const [profile] = await db
        .select()
        .from(datingProfiles)
        .where(eq(datingProfiles.id, "profile-3"));

      expect(profile.interests).toBe(interests);
      expect(profile.lookingFor).toBe("everyone");
      expect(profile.verified).toBe(true);
    });
  });

  describe("Matching System", () => {
    it("creates a pending match", async () => {
      await db.insert(datingMatches).values({
        id: "match-1",
        userId1: testUserId1,
        userId2: testUserId2,
        status: "pending",
      });

      const [match] = await db
        .select()
        .from(datingMatches)
        .where(eq(datingMatches.id, "match-1"));

      expect(match.status).toBe("pending");
      expect(match.userId1).toBe(testUserId1);
      expect(match.userId2).toBe(testUserId2);
    });

    it("promotes a pending match to matched", async () => {
      await db.insert(datingMatches).values({
        id: "match-2",
        userId1: testUserId1,
        userId2: testUserId2,
        status: "pending",
      });

      await db
        .update(datingMatches)
        .set({ status: "matched" })
        .where(eq(datingMatches.id, "match-2"));

      const [match] = await db
        .select()
        .from(datingMatches)
        .where(eq(datingMatches.id, "match-2"));

      expect(match.status).toBe("matched");
    });

    it("supports reverse-direction match candidates", async () => {
      await db.insert(datingMatches).values([
        {
          id: "match-3a",
          userId1: testUserId1,
          userId2: testUserId2,
          status: "pending",
        },
        {
          id: "match-3b",
          userId1: testUserId2,
          userId2: testUserId1,
          status: "pending",
        },
      ]);

      const matches = await db
        .select()
        .from(datingMatches)
        .where(
          or(
            eq(datingMatches.id, "match-3a"),
            eq(datingMatches.id, "match-3b")
          )
        );

      expect(matches).toHaveLength(2);
    });
  });

  describe("Messaging System", () => {
    it("sends a message for an existing match", async () => {
      await db.insert(datingMatches).values({
        id: "message-match-1",
        userId1: testUserId1,
        userId2: testUserId2,
        status: "matched",
      });
      await db.insert(datingMessages).values({
        id: "message-1",
        matchId: "message-match-1",
        senderId: testUserId1,
        content: "Hello, how are you?",
      });

      const [message] = await db
        .select()
        .from(datingMessages)
        .where(eq(datingMessages.id, "message-1"));

      expect(message.content).toBe("Hello, how are you?");
      expect(message.senderId).toBe(testUserId1);
      expect(message.read).toBe(false);
    });

    it("retrieves message history for a match", async () => {
      await db.insert(datingMatches).values({
        id: "message-match-2",
        userId1: testUserId1,
        userId2: testUserId2,
        status: "matched",
      });
      await db.insert(datingMessages).values([
        {
          id: "message-2a",
          matchId: "message-match-2",
          senderId: testUserId1,
          content: "Message 1",
        },
        {
          id: "message-2b",
          matchId: "message-match-2",
          senderId: testUserId2,
          content: "Message 2",
        },
      ]);

      const messages = await db
        .select()
        .from(datingMessages)
        .where(eq(datingMessages.matchId, "message-match-2"))
        .orderBy(datingMessages.createdAt);

      expect(messages).toHaveLength(2);
      expect(messages.map(message => message.content)).toEqual([
        "Message 1",
        "Message 2",
      ]);
    });
  });

  describe("Subscription System", () => {
    it("creates a premium subscription", async () => {
      await db.insert(datingSubscriptions).values({
        id: "subscription-1",
        userId: testUserId1,
        tier: "premium",
      });

      const [subscription] = await db
        .select()
        .from(datingSubscriptions)
        .where(eq(datingSubscriptions.id, "subscription-1"));

      expect(subscription.tier).toBe("premium");
      expect(subscription.userId).toBe(testUserId1);
    });

    it("upgrades a subscription tier", async () => {
      await db.insert(datingSubscriptions).values({
        id: "subscription-2",
        userId: testUserId1,
        tier: "premium",
      });

      await db
        .update(datingSubscriptions)
        .set({ tier: "vip" })
        .where(eq(datingSubscriptions.id, "subscription-2"));

      const [subscription] = await db
        .select()
        .from(datingSubscriptions)
        .where(eq(datingSubscriptions.id, "subscription-2"));

      expect(subscription.tier).toBe("vip");
    });

    it("persists subscription expiry", async () => {
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      await db.insert(datingSubscriptions).values({
        id: "subscription-3",
        userId: testUserId1,
        tier: "premium",
        expiresAt,
      });

      const [subscription] = await db
        .select()
        .from(datingSubscriptions)
        .where(eq(datingSubscriptions.id, "subscription-3"));

      expect(subscription.expiresAt).toBeInstanceOf(Date);
      expect(subscription.expiresAt?.getTime()).toBe(expiresAt.getTime());
    });
  });

  describe("Notification System", () => {
    it("creates a notification", async () => {
      await db.insert(datingNotifications).values({
        id: "notification-1",
        userId: testUserId1,
        type: "match",
        relatedUserId: testUserId2,
        read: false,
      });

      const [notification] = await db
        .select()
        .from(datingNotifications)
        .where(eq(datingNotifications.id, "notification-1"));

      expect(notification.type).toBe("match");
      expect(notification.relatedUserId).toBe(testUserId2);
      expect(notification.read).toBe(false);
    });

    it("marks a notification as read", async () => {
      await db.insert(datingNotifications).values({
        id: "notification-2",
        userId: testUserId1,
        type: "message",
        read: false,
      });

      await db
        .update(datingNotifications)
        .set({ read: true })
        .where(eq(datingNotifications.id, "notification-2"));

      const [notification] = await db
        .select()
        .from(datingNotifications)
        .where(eq(datingNotifications.id, "notification-2"));

      expect(notification.read).toBe(true);
    });

    it("retrieves unread notifications", async () => {
      await db.insert(datingNotifications).values([
        {
          id: "notification-3a",
          userId: testUserId1,
          type: "match",
          read: false,
        },
        {
          id: "notification-3b",
          userId: testUserId1,
          type: "message",
          read: false,
        },
        {
          id: "notification-3c",
          userId: testUserId1,
          type: "like",
          read: true,
        },
      ]);

      const unread = await db
        .select()
        .from(datingNotifications)
        .where(
          and(
            eq(datingNotifications.userId, testUserId1),
            eq(datingNotifications.read, false)
          )
        );

      expect(unread).toHaveLength(2);
    });
  });

  describe("Like System", () => {
    it("records a like", async () => {
      await db.insert(datingLikes).values({
        id: "like-1",
        userId: testUserId1,
        likedUserId: testUserId2,
        type: "like",
      });

      const [like] = await db
        .select()
        .from(datingLikes)
        .where(eq(datingLikes.id, "like-1"));

      expect(like.type).toBe("like");
      expect(like.likedUserId).toBe(testUserId2);
    });

    it("records a superlike", async () => {
      await db.insert(datingLikes).values({
        id: "like-2",
        userId: testUserId1,
        likedUserId: testUserId2,
        type: "superlike",
      });

      const [like] = await db
        .select()
        .from(datingLikes)
        .where(eq(datingLikes.id, "like-2"));

      expect(like.type).toBe("superlike");
    });

    it("retrieves likes created by a user", async () => {
      await db.insert(datingLikes).values([
        {
          id: "like-3a",
          userId: testUserId1,
          likedUserId: testUserId2,
          type: "like",
        },
        {
          id: "like-3b",
          userId: testUserId1,
          likedUserId: testUserId2,
          type: "superlike",
        },
      ]);

      const likes = await db
        .select()
        .from(datingLikes)
        .where(eq(datingLikes.userId, testUserId1));

      expect(likes).toHaveLength(2);
    });
  });
});
