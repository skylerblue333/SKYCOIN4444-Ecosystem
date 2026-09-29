import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { eq, inArray } from "drizzle-orm";
import { comments, likes, posts, users } from "../drizzle/schema";
import {
  createComment,
  createLike,
  createPost,
  db,
  getComments,
  getPosts,
  removeLike,
} from "./db";

const userId = "social-persistence-user";

async function cleanup() {
  const ownedPosts = await db
    .select({ id: posts.id })
    .from(posts)
    .where(eq(posts.userId, userId));
  const postIds = ownedPosts.map(row => row.id);

  if (postIds.length) {
    await db.delete(comments).where(inArray(comments.postId, postIds));
    await db.delete(likes).where(inArray(likes.postId, postIds));
    await db.delete(posts).where(inArray(posts.id, postIds));
  }

  await db.delete(users).where(eq(users.id, userId));
}

beforeEach(async () => {
  await cleanup();
  await db.insert(users).values({
    id: userId,
    openId: userId,
    email: "social-persistence@example.test",
    username: userId,
    name: "Social Persistence Test",
    loginMethod: "test",
  });
});

afterEach(cleanup);

describe("social persistence", () => {
  it("persists a post and returns it from the chronological feed", async () => {
    const created = await createPost(userId, "Persisted social beta post #testing");

    expect(created.id).toMatch(/^post_/);
    expect(created.userId).toBe(userId);
    expect(created.content).toBe("Persisted social beta post #testing");

    const feed = await getPosts(50, 0);
    expect(feed.some(post => post.id === created.id)).toBe(true);
  });

  it("persists comments and maintains the post comment count", async () => {
    const post = await createPost(userId, "Comment target");
    const comment = await createComment(post.id, userId, "Persisted reply");

    expect(comment.postId).toBe(post.id);
    expect(comment.userId).toBe(userId);

    const storedComments = await getComments(post.id);
    expect(storedComments.map(row => row.id)).toContain(comment.id);

    const [storedPost] = await db.select().from(posts).where(eq(posts.id, post.id));
    expect(storedPost?.comments).toBe(1);
  });

  it("likes idempotently and removes the persisted like", async () => {
    const post = await createPost(userId, "Like target");

    const first = await createLike(post.id, userId);
    const second = await createLike(post.id, userId);
    expect(first).toMatchObject({ success: true, liked: true, count: 1 });
    expect(second).toMatchObject({ success: true, liked: true, count: 1 });

    const [likedPost] = await db.select().from(posts).where(eq(posts.id, post.id));
    expect(likedPost?.likes).toBe(1);

    const removed = await removeLike(post.id, userId);
    expect(removed).toMatchObject({ success: true, liked: false, count: 0 });

    const [unlikedPost] = await db.select().from(posts).where(eq(posts.id, post.id));
    expect(unlikedPost?.likes).toBe(0);
  });
});
