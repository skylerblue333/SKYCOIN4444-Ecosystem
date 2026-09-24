import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { createHash } from "node:crypto";
import { nanoid } from "nanoid";
import * as schema from "../drizzle/index";
import { and, desc, eq, or, sql } from "drizzle-orm";

const poolConnection = mysql.createPool(process.env.DATABASE_URL as string);

export const db = drizzle(poolConnection, { schema, mode: "default" });
const {
  users,
  tokenBalances,
  posts,
  comments,
  likes,
  follows,
  notifications,
  messages,
  transactions,
  wallets,
} = schema;

function stableId(prefix: string, ...parts: string[]) {
  const digest = createHash("sha256").update(parts.join("\0")).digest("hex").slice(0, 32);
  return `${prefix}_${digest}`;
}

export async function getDb() {
  return db;
}

// Beta-critical persistence helpers below use the canonical MySQL schema.
// Unimplemented product/wallet/stream helpers remain explicitly tracked debt.

// ============ USER HELPERS ============
export async function getUserById(id: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, String(id)))
    .limit(1);
  return user ?? null;
}

export async function getUserByEmail(email: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  return user ?? null;
}

export async function createUser(data: any) {
  return { id: "1", ...data };
}

export async function updateUserBalance(userId: string, amount: number) {
  return { success: true };
}

export async function getUserByOpenId(openId: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function upsertUser(user: any) {
  if (!user.openId) throw new Error("User openId is required for upsert");

  // Canonical beta identity: OAuth openId is stable and unique, so it is a
  // safe deterministic primary key when a separate id is not supplied.
  const values: any = {
    id: String(user.id ?? user.openId),
    openId: String(user.openId),
  };
  const textFields = ["name", "email", "loginMethod", "username", "avatar"];
  textFields.forEach(field => {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
    }
  });

  if (user.role !== undefined) {
    values.role = user.role;
  }

  values.lastSignedIn = user.lastSignedIn || new Date();

  // Never rewrite the primary key on an existing openId collision.
  const { id: _id, ...updateValues } = values;
  await db
    .insert(users)
    .values(values)
    .onDuplicateKeyUpdate({ set: updateValues });
}

export async function ensureAllTokenBalances(userId: string) {
  const ALL_SUPPORTED_TOKENS = [
    "SKY444",
    "BTC",
    "ETH",
    "SOL",
    "DOGE",
    "TRUMP",
    "USDT",
    "XMR",
  ];
  const existing = await db
    .select({ tokenSymbol: tokenBalances.tokenSymbol })
    .from(tokenBalances)
    .where(eq(tokenBalances.userId, userId));
  const existingSet = new Set(existing.map(r => r.tokenSymbol));
  const missing = ALL_SUPPORTED_TOKENS.filter(t => !existingSet.has(t));
  if (missing.length === 0) return;
  const STARTER: Record<string, number> = {
    SKY444: 1000,
    BTC: 0.001,
    ETH: 0.05,
    SOL: 1,
    DOGE: 500,
    TRUMP: 100,
    USDT: 50,
    XMR: 0.1,
  };
  await db.insert(tokenBalances).values(
    missing.map(token => ({
      id: `tb_${userId}_${token}`,
      userId,
      tokenSymbol: token,
      token,
      balance: STARTER[token] ?? 0,
    }))
  );
}

export async function upsertTokenBalance(userId: string, token: string, amount: number) {
  const id = `tb_${userId}_${token}`;
  await db.insert(tokenBalances)
    .values({
      id,
      userId,
      tokenSymbol: token,
      token,
      balance: amount,
    })
    .onDuplicateKeyUpdate({
      set: {
        balance: sql`${tokenBalances.balance} + ${amount}`,
        updatedAt: new Date(),
      },
    });
}


export async function updateUserProfile(
  userId: string,
  patch: { name?: string; bio?: string; avatar?: string }
) {
  const values: Record<string, unknown> = { updatedAt: new Date() };
  if (patch.name !== undefined) values.name = patch.name;
  if (patch.bio !== undefined) values.bio = patch.bio;
  if (patch.avatar !== undefined) values.avatar = patch.avatar;

  await db.update(users).set(values as any).where(eq(users.id, String(userId)));
  return getUserById(String(userId));
}

export async function getUserStats(userId: string) {
  const [followersRow] = await db
    .select({ count: sql<number>`count(*)` })
    .from(follows)
    .where(eq(follows.followingId, userId));
  const [followingRow] = await db
    .select({ count: sql<number>`count(*)` })
    .from(follows)
    .where(eq(follows.followerId, userId));
  const [postsRow] = await db
    .select({ count: sql<number>`count(*)` })
    .from(posts)
    .where(eq(posts.userId, userId));

  return {
    followers: Number(followersRow?.count ?? 0),
    following: Number(followingRow?.count ?? 0),
    posts: Number(postsRow?.count ?? 0),
    earnings: 0,
  };
}

// ============ POST HELPERS ============
export async function getPosts(limit = 20, offset = 0) {
  return db
    .select()
    .from(posts)
    .orderBy(desc(posts.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getPostsByUser(userId: string) {
  return db
    .select()
    .from(posts)
    .where(eq(posts.userId, userId))
    .orderBy(desc(posts.createdAt));
}

export async function createPost(
  userId: string,
  content: string,
  media?: string
) {
  const id = `post_${nanoid(20)}`;
  await db.insert(posts).values({
    id,
    userId,
    content,
    media: media ?? null,
  });
  const [post] = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  return post ?? { id, userId, content, media: media ?? null };
}

export async function updatePost(
  userId: string,
  postId: string,
  content: string
) {
  const [owned] = await db
    .select({ id: posts.id })
    .from(posts)
    .where(and(eq(posts.id, postId), eq(posts.userId, userId)))
    .limit(1);
  if (!owned) return null;

  await db
    .update(posts)
    .set({ content, updatedAt: new Date() })
    .where(eq(posts.id, postId));
  const [post] = await db.select().from(posts).where(eq(posts.id, postId)).limit(1);
  return post ?? null;
}

export async function deletePost(userId: string, postId: string) {
  const [owned] = await db
    .select({ id: posts.id })
    .from(posts)
    .where(and(eq(posts.id, postId), eq(posts.userId, userId)))
    .limit(1);
  if (!owned) return { success: false, reason: "not_found_or_not_owner" as const };

  await db.delete(comments).where(eq(comments.postId, postId));
  await db.delete(likes).where(eq(likes.postId, postId));
  await db.delete(posts).where(eq(posts.id, postId));
  return { success: true };
}

// ============ PRODUCT HELPERS ============
export async function getProducts(limit = 20, offset = 0, category?: string) {
  return [];
}

export async function getProductById(id: string) {
  return null;
}

export async function createProduct(data: any) {
  return { id: "1", ...data };
}

// ============ ORDER HELPERS ============
export async function getOrders(userId: string) {
  return [];
}

export async function createOrder(
  userId: string,
  productId: string,
  quantity: number
) {
  return { id: "1", userId, productId, quantity };
}

export async function updateOrderStatus(orderId: string, status: string) {
  return { success: true };
}

// ============ TRANSACTION HELPERS ============
export async function getTransactions(userId: string) {
  return db
    .select()
    .from(transactions)
    .where(
      or(
        eq(transactions.userId, userId),
        eq(transactions.toUserId, userId)
      )
    )
    .orderBy(desc(transactions.createdAt));
}

export async function createTransaction(data: {
  userId: string;
  type: string;
  amount: number;
  toUserId?: string;
}) {
  const id = `transaction_${nanoid(20)}`;
  await db.insert(transactions).values({
    id,
    userId: data.userId,
    type: data.type,
    amount: data.amount,
    toUserId: data.toUserId ?? null,
    status: "pending",
    txHash: null,
  });
  const [transaction] = await db
    .select()
    .from(transactions)
    .where(eq(transactions.id, id))
    .limit(1);
  return transaction ?? {
    id,
    userId: data.userId,
    type: data.type,
    amount: data.amount,
    toUserId: data.toUserId ?? null,
    status: "pending",
    txHash: null,
  };
}

// ============ WALLET HELPERS ============
export async function getWallets(userId: string) {
  return db
    .select()
    .from(wallets)
    .where(eq(wallets.userId, userId))
    .orderBy(wallets.createdAt);
}

export async function getWalletByCurrency(userId: string, currency: string) {
  const normalized = currency.trim().toUpperCase();
  const [wallet] = await db
    .select()
    .from(wallets)
    .where(
      and(
        eq(wallets.userId, userId),
        eq(wallets.currency, normalized)
      )
    )
    .limit(1);
  return wallet ?? null;
}

export async function createWallet(
  userId: string,
  currency: string,
  address: string
) {
  const normalized = currency.trim().toUpperCase();
  const id = stableId("wallet", userId, normalized);

  await db
    .insert(wallets)
    .values({
      id,
      userId,
      currency: normalized,
      address,
      balance: 0,
    })
    .onDuplicateKeyUpdate({
      set: {
        address,
        currency: normalized,
      },
    });

  return getWalletByCurrency(userId, normalized);
}

export async function getWallet(userId: string) {
  const [wallet] = await getWallets(userId);
  return wallet ?? null;
}

export async function updateWallet(userId: string, balance: number) {
  const wallet = await getWallet(userId);
  if (!wallet) return { success: false, reason: "wallet_not_found" as const };

  await db
    .update(wallets)
    .set({ balance })
    .where(eq(wallets.id, wallet.id));
  return { success: true };
}

// ============ COMMENT HELPERS ============
export async function getComments(postId: string) {
  return db
    .select()
    .from(comments)
    .where(eq(comments.postId, postId))
    .orderBy(comments.createdAt);
}

export async function createComment(
  postId: string,
  userId: string,
  content: string
) {
  const id = `comment_${nanoid(20)}`;
  await db.insert(comments).values({ id, postId, userId, content });
  const [countRow] = await db
    .select({ count: sql<number>`count(*)` })
    .from(comments)
    .where(eq(comments.postId, postId));
  await db
    .update(posts)
    .set({ comments: Number(countRow?.count ?? 0) })
    .where(eq(posts.id, postId));
  const [comment] = await db
    .select()
    .from(comments)
    .where(eq(comments.id, id))
    .limit(1);
  return comment ?? { id, postId, userId, content };
}

// ============ LIKE HELPERS ============
export async function getLikes(postId: string) {
  return db.select().from(likes).where(eq(likes.postId, postId));
}

export async function createLike(postId: string, userId: string) {
  const id = stableId("like", postId, userId);
  await db
    .insert(likes)
    .values({ id, postId, userId })
    .onDuplicateKeyUpdate({ set: { postId, userId } });

  const [countRow] = await db
    .select({ count: sql<number>`count(*)` })
    .from(likes)
    .where(eq(likes.postId, postId));
  const count = Number(countRow?.count ?? 0);
  await db.update(posts).set({ likes: count }).where(eq(posts.id, postId));
  return { success: true, liked: true, count };
}

export async function removeLike(postId: string, userId: string) {
  const id = stableId("like", postId, userId);
  await db.delete(likes).where(eq(likes.id, id));
  const [countRow] = await db
    .select({ count: sql<number>`count(*)` })
    .from(likes)
    .where(eq(likes.postId, postId));
  const count = Number(countRow?.count ?? 0);
  await db.update(posts).set({ likes: count }).where(eq(posts.id, postId));
  return { success: true, liked: false, count };
}

// ============ FOLLOW HELPERS ============
export async function getFollowers(userId: string) {
  return db
    .select()
    .from(follows)
    .where(eq(follows.followingId, userId))
    .orderBy(desc(follows.createdAt));
}

export async function getFollowing(userId: string) {
  return db
    .select()
    .from(follows)
    .where(eq(follows.followerId, userId))
    .orderBy(desc(follows.createdAt));
}

export async function createFollow(followerId: string, followingId: string) {
  if (followerId === followingId) {
    return { success: false, reason: "cannot_follow_self" as const };
  }
  const id = stableId("follow", followerId, followingId);
  await db
    .insert(follows)
    .values({ id, followerId, followingId })
    .onDuplicateKeyUpdate({ set: { followerId, followingId } });
  return { success: true };
}

export async function removeFollow(followerId: string, followingId: string) {
  const id = stableId("follow", followerId, followingId);
  await db.delete(follows).where(eq(follows.id, id));
  return { success: true };
}

// ============ NOTIFICATION HELPERS ============
export async function getNotifications(userId: string) {
  return db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt));
}

export async function createNotification(
  userId: string,
  type: string,
  content: string
) {
  const id = `notification_${nanoid(20)}`;
  await db.insert(notifications).values({ id, userId, type, content, read: false });
  const [notification] = await db
    .select()
    .from(notifications)
    .where(eq(notifications.id, id))
    .limit(1);
  return notification ?? { id, userId, type, content, read: false };
}

export async function markNotificationAsRead(
  notificationId: string,
  userId?: string
) {
  const predicate = userId
    ? and(eq(notifications.id, notificationId), eq(notifications.userId, userId))
    : eq(notifications.id, notificationId);
  await db.update(notifications).set({ read: true }).where(predicate);
  return { success: true };
}

export async function deleteNotification(notificationId: string, userId: string) {
  await db
    .delete(notifications)
    .where(and(eq(notifications.id, notificationId), eq(notifications.userId, userId)));
  return { success: true };
}

export async function getUnreadNotificationCount(userId: string) {
  const [row] = await db
    .select({ count: sql<number>`count(*)` })
    .from(notifications)
    .where(and(eq(notifications.userId, userId), eq(notifications.read, false)));
  return Number(row?.count ?? 0);
}

// ============ MESSAGE HELPERS ============
export async function getMessages(userId: string) {
  return db
    .select()
    .from(messages)
    .where(or(eq(messages.senderId, userId), eq(messages.recipientId, userId)))
    .orderBy(messages.createdAt);
}

export async function getConversation(userId: string, otherUserId: string) {
  return db
    .select()
    .from(messages)
    .where(
      or(
        and(eq(messages.senderId, userId), eq(messages.recipientId, otherUserId)),
        and(eq(messages.senderId, otherUserId), eq(messages.recipientId, userId))
      )
    )
    .orderBy(messages.createdAt);
}

export async function createMessage(
  senderId: string,
  recipientId: string,
  content: string
) {
  const id = `message_${nanoid(20)}`;
  await db.insert(messages).values({
    id,
    senderId,
    recipientId,
    content,
    read: false,
  });
  const [message] = await db.select().from(messages).where(eq(messages.id, id)).limit(1);
  return message ?? { id, senderId, recipientId, content, read: false };
}

export async function markMessageAsRead(messageId: string, recipientId: string) {
  await db
    .update(messages)
    .set({ read: true })
    .where(and(eq(messages.id, messageId), eq(messages.recipientId, recipientId)));
  return { success: true };
}

// ============ REVIEW HELPERS ============
export async function getReviews(productId: string) {
  return [];
}

export async function createReview(
  productId: string,
  userId: string,
  rating: number,
  content: string
) {
  return { id: "1", productId, userId, rating, content };
}

// ============ STREAM HELPERS ============
export async function getStreams(limit = 20) {
  return [];
}

export async function createStream(
  userId: string,
  title: string,
  description: string
) {
  return { id: "1", userId, title, description };
}

export async function updateStreamStatus(streamId: string, status: string) {
  return { success: true };
}

// ============ SEARCH HELPERS ============
export async function searchUsers(query: string) {
  return [];
}

export async function searchProducts(query: string) {
  return [];
}

export async function searchPosts(query: string) {
  return [];
}
