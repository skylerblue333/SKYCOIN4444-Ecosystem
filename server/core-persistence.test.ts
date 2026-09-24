import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { and, eq, inArray, or } from "drizzle-orm";
import {
  comments,
  follows,
  likes,
  messages,
  notifications,
  posts,
  users,
} from "../drizzle/schema";
import {
  createComment,
  createFollow,
  createLike,
  createMessage,
  createNotification,
  createPost,
  db,
  getConversation,
  getFollowers,
  getLikes,
  getPosts,
  getUnreadNotificationCount,
  getUserById,
  getUserStats,
  markAllNotificationsAsRead,
  markMessageAsRead,
  markNotificationAsRead,
  removeLike,
  updateUserProfile,
} from "./db";

const user1 = "core-persistence-user-1";
const user2 = "core-persistence-user-2";
const testUsers = [user1, user2];

async function cleanup() {
  await db
    .delete(notifications)
    .where(inArray(notifications.userId, testUsers));
  await db
    .delete(messages)
    .where(
      or(
        inArray(messages.senderId, testUsers),
        inArray(messages.recipientId, testUsers)
      )
    );
  await db.delete(likes).where(inArray(likes.userId, testUsers));
  await db.delete(comments).where(inArray(comments.userId, testUsers));
  await db.delete(posts).where(inArray(posts.userId, testUsers));
  await db
    .delete(follows)
    .where(
      or(
        inArray(follows.followerId, testUsers),
        inArray(follows.followingId, testUsers)
      )
    );
  await db.delete(users).where(inArray(users.id, testUsers));
}

beforeEach(async () => {
  await cleanup();
  await db.insert(users).values([
    {
      id: user1,
      openId: user1,
      email: "core-persistence-1@example.test",
      username: user1,
      name: "Core Persistence One",
      loginMethod: "test",
    },
    {
      id: user2,
      openId: user2,
      email: "core-persistence-2@example.test",
      username: user2,
      name: "Core Persistence Two",
      loginMethod: "test",
    },
  ]);
});

afterEach(cleanup);

describe("beta core persistence", () => {
  it("persists profile edits and reflects them in user reads", async () => {
    const updated = await updateUserProfile(user1, {
      name: "Updated Core User",
      bio: "Persisted profile bio",
      avatar: "https://example.test/avatar.png",
    });

    expect(updated?.name).toBe("Updated Core User");
    expect(updated?.bio).toBe("Persisted profile bio");

    const reread = await getUserById(user1);
    expect(reread?.name).toBe("Updated Core User");
    expect(reread?.bio).toBe("Persisted profile bio");
    expect(reread?.avatar).toBe("https://example.test/avatar.png");
  });

  it("persists posts comments and idempotent likes", async () => {
    const post = await createPost(user1, "Persistent post");
    expect(post.userId).toBe(user1);

    const firstLike = await createLike(post.id, user2);
    const secondLike = await createLike(post.id, user2);
    expect(firstLike.count).toBe(1);
    expect(secondLike.count).toBe(1);
    expect(await getLikes(post.id)).toHaveLength(1);

    const comment = await createComment(post.id, user2, "Persistent comment");
    expect(comment.content).toBe("Persistent comment");

    const feed = await getPosts(20, 0);
    const persisted = feed.find(row => row.id === post.id);
    expect(persisted?.content).toBe("Persistent post");
    expect(persisted?.likes).toBe(1);
    expect(persisted?.comments).toBe(1);

    const stats = await getUserStats(user1);
    expect(stats.posts).toBe(1);

    const removed = await removeLike(post.id, user2);
    expect(removed.count).toBe(0);
    expect(await getLikes(post.id)).toHaveLength(0);
  });

  it("persists follows idempotently and reports follower counts", async () => {
    expect((await createFollow(user1, user2)).success).toBe(true);
    expect((await createFollow(user1, user2)).success).toBe(true);
    expect(await getFollowers(user2)).toHaveLength(1);

    const stats = await getUserStats(user2);
    expect(stats.followers).toBe(1);

    const selfFollow = await createFollow(user1, user1);
    expect(selfFollow.success).toBe(false);
  });

  it("enforces notification ownership when marking notifications read", async () => {
    const notification = await createNotification(
      user2,
      "message",
      "You have a message"
    );

    expect(await getUnreadNotificationCount(user2)).toBe(1);

    await markNotificationAsRead(notification.id, user1);
    expect(await getUnreadNotificationCount(user2)).toBe(1);

    await markNotificationAsRead(notification.id, user2);
    expect(await getUnreadNotificationCount(user2)).toBe(0);
  });

  it("marks all notifications read without crossing user boundaries", async () => {
    await createNotification(user2, "message", "First message");
    await createNotification(user2, "follow", "New follower");
    await createNotification(user1, "system", "Other user's notice");

    expect(await getUnreadNotificationCount(user2)).toBe(2);
    expect(await getUnreadNotificationCount(user1)).toBe(1);

    await markAllNotificationsAsRead(user2);

    expect(await getUnreadNotificationCount(user2)).toBe(0);
    expect(await getUnreadNotificationCount(user1)).toBe(1);
  });

  it("persists direct-message history and recipient-scoped read state", async () => {
    const message = await createMessage(user1, user2, "Hello from user one");
    const conversation = await getConversation(user1, user2);

    expect(conversation).toHaveLength(1);
    expect(conversation[0]?.id).toBe(message.id);
    expect(conversation[0]?.content).toBe("Hello from user one");
    expect(conversation[0]?.read).toBe(false);

    await markMessageAsRead(message.id, user1);
    let [stored] = await db
      .select()
      .from(messages)
      .where(and(eq(messages.id, message.id), eq(messages.recipientId, user2)));
    expect(stored?.read).toBe(false);

    await markMessageAsRead(message.id, user2);
    [stored] = await db
      .select()
      .from(messages)
      .where(eq(messages.id, message.id));
    expect(stored?.read).toBe(true);
  });
});
