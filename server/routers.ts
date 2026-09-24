import { z } from "zod";
import { adminProcedure, publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { miningRouter } from "./mining";
import { voiceRouter } from "./voice-router";
import { enterpriseRouter } from "./enterprise-router";
import { aiRouter } from "./real-ai-engine-v2";
import { authRouter } from "./auth.router";
import { gamificationRouter } from "./gamification-router";
import { hopeAIRouter } from "./phase6-routers";
import { pricesRouter } from "./price-router";
import { systemRouter } from "./_core/systemRouter";
import * as db from "./db";
import {
  users,
  posts,
  transactions,
  products,
  orders,
  streams,
  comments,
  likes,
  wallets,
  notifications,
  messages,
  reviews,
  follows,
  communities,
  stakingPositions,
  tokenBalances,
  moderationLogs,
  datingReports,
} from "../drizzle/schema";
import { battlePasses } from "../drizzle/schema-extended";
import { eq, desc, and, or, sql, gte, lte } from "drizzle-orm";

// ============ USER PROCEDURES ============
export const userRouter = router({
  me: protectedProcedure.query(async ({ ctx }) => {
    return db.getUserById(ctx.user.id);
  }),
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        bio: z.string().optional(),
        avatar: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await db.getUserById(ctx.user.id);
      return { success: true };
    }),
  getProfile: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      return db.getUserById(input.userId);
    }),
  profile: publicProcedure
    .input(z.object({ userId: z.union([z.string(), z.number()]) }))
    .query(async ({ input }) => {
      return (await db.getUserById(String(input.userId))) ?? null;
    }),
  follow: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return { success: true };
    }),
  getFollowers: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async () => []),
  getStats: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async () => ({
      followers: 0,
      following: 0,
      posts: 0,
      earnings: 0,
    })),
  suggestedFollows: publicProcedure.query(async () => []),
});

// ============ POST PROCEDURES ============
export const postRouter = router({
  list: publicProcedure
    .input(
      z.object({ limit: z.number().default(10), offset: z.number().default(0) })
    )
    .query(async ({ input }) => db.getPosts(input.limit, input.offset)),
  trending: publicProcedure.query(async () => []),
  create: protectedProcedure
    .input(z.object({ content: z.string(), media: z.string().optional() }))
    .mutation(async ({ ctx, input }) =>
      db.createPost(ctx.user.id, input.content, input.media)
    ),
  like: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => ({ success: true })),
  comment: protectedProcedure
    .input(z.object({ postId: z.string(), content: z.string() }))
    .mutation(async ({ ctx, input }) => ({ success: true })),
  delete: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => ({ success: true })),
  edit: protectedProcedure
    .input(z.object({ postId: z.string(), content: z.string() }))
    .mutation(async ({ ctx, input }) => ({ success: true })),
});

// ============ MARKETPLACE PROCEDURES ============
export const marketplaceRouter = router({
  listProducts: publicProcedure
    .input(
      z.object({
        category: z.string().optional(),
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) =>
      db.getProducts(input.limit, input.offset, input.category)
    ),
  getProduct: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => db.getProductById(input.id)),
  createProduct: protectedProcedure
    .input(
      z.object({ name: z.string(), price: z.number(), category: z.string() })
    )
    .mutation(async ({ ctx, input }) =>
      db.createProduct({ ...input, sellerId: ctx.user.id })
    ),
  createOrder: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        quantity: z.number(),
        shippingAddress: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) =>
      db.createOrder({ ...input, userId: ctx.user.id, status: "pending" })
    ),
  getOrders: protectedProcedure.query(async ({ ctx }) =>
    db.getOrders(ctx.user.id)
  ),
  updateOrderStatus: protectedProcedure
    .input(z.object({ orderId: z.string(), status: z.string() }))
    .mutation(async ({ input }) =>
      db.updateOrderStatus(input.orderId, input.status)
    ),
  addReview: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        rating: z.number(),
        comment: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => ({ success: true })),
});

// ============ STREAMING PROCEDURES ============
export const streamRouter = router({
  live: publicProcedure.query(async () => []),
  create: protectedProcedure
    .input(z.object({ title: z.string(), description: z.string() }))
    .mutation(async ({ ctx, input }) => ({ success: true })),
  sendChat: protectedProcedure
    .input(z.object({ streamId: z.string(), message: z.string() }))
    .mutation(async ({ ctx, input }) => ({ success: true })),
  chat: publicProcedure
    .input(z.object({ streamId: z.string(), limit: z.number().default(100) }))
    .query(async () => []),
  donate: protectedProcedure
    .input(z.object({ streamId: z.string(), amount: z.number() }))
    .mutation(async ({ ctx, input }) => ({ success: true })),
  endStream: protectedProcedure
    .input(z.object({ streamId: z.string() }))
    .mutation(async ({ ctx, input }) => ({ success: true })),
});

// ============ TRANSACTION PROCEDURES ============
export const transactionRouter = router({
  list: protectedProcedure.query(async ({ ctx }) =>
    db.getTransactions(ctx.user.id)
  ),
  create: protectedProcedure
    .input(
      z.object({
        type: z.string(),
        amount: z.number(),
        toUserId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) =>
      db.createTransaction({
        ...input,
        userId: ctx.user.id,
        status: "completed",
      })
    ),
  getBalance: protectedProcedure.query(async ({ ctx }) => {
    const user = await db.getUserById(ctx.user.id);
    return { balance: user?.balance || 0 };
  }),
});

// ============ WALLET PROCEDURES ============
export const walletRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => []),
  create: protectedProcedure
    .input(z.object({ currency: z.string(), address: z.string() }))
    .mutation(async ({ ctx, input }) => ({ success: true })),
  getBalance: protectedProcedure
    .input(z.object({ currency: z.string() }))
    .query(async ({ ctx, input }) => ({ balance: 0 })),
  send: protectedProcedure
    .input(
      z.object({
        currency: z.string(),
        amount: z.number(),
        toAddress: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => ({ txHash: "0x..." })),
  receive: protectedProcedure
    .input(z.object({ currency: z.string() }))
    .query(async ({ ctx, input }) => ({ address: "..." })),
});

// ============ NOTIFICATION PROCEDURES ============
export const notificationRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => []),
  markAsRead: protectedProcedure
    .input(z.object({ notificationId: z.string() }))
    .mutation(async ({ ctx, input }) => ({ success: true })),
  delete: protectedProcedure
    .input(z.object({ notificationId: z.string() }))
    .mutation(async ({ ctx, input }) => ({ success: true })),
  getUnread: protectedProcedure.query(async ({ ctx }) => ({ count: 0 })),
});

// ============ MESSAGE PROCEDURES ============
export const messageRouter = router({
  list: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => []),
  send: protectedProcedure
    .input(z.object({ recipientId: z.string(), content: z.string() }))
    .mutation(async ({ ctx, input }) => ({ success: true })),
  markAsRead: protectedProcedure
    .input(z.object({ messageId: z.string() }))
    .mutation(async ({ ctx, input }) => ({ success: true })),
});

// ============ GAMING PROCEDURES ============
export const gamingRouter = router({
  play: protectedProcedure
    .input(z.object({ gameId: z.string(), bet: z.number() }))
    .mutation(async ({ ctx, input }) => ({
      result: "win",
      earnings: input.bet * 2,
    })),
  getLeaderboard: publicProcedure.query(async () => []),
  getAchievements: protectedProcedure.query(async ({ ctx }) => []),
});

// ============ CONTENT PROCEDURES ============
export const contentRouter = router({
  createBlog: protectedProcedure
    .input(z.object({ title: z.string(), content: z.string() }))
    .mutation(async ({ ctx, input }) => ({ success: true })),
  uploadVideo: protectedProcedure
    .input(z.object({ title: z.string(), url: z.string() }))
    .mutation(async ({ ctx, input }) => ({ success: true })),
  uploadPodcast: protectedProcedure
    .input(z.object({ title: z.string(), url: z.string() }))
    .mutation(async ({ ctx, input }) => ({ success: true })),
  getContent: publicProcedure.query(async () => []),
});

// ============ ANALYTICS PROCEDURES ============
export const analyticsRouter = router({
  getDashboard: protectedProcedure.query(async ({ ctx }) => ({
    views: 0,
    clicks: 0,
    revenue: 0,
    users: 0,
  })),
  getCharts: protectedProcedure.query(async ({ ctx }) => []),
  getReports: protectedProcedure.query(async ({ ctx }) => []),
});

// ============ ADMIN PROCEDURES ============
async function getAdminStats() {
  const database = await db.getDb();
  const [userCount] = await database.select({ count: sql<number>`count(*)` }).from(users);
  const [postCount] = await database.select({ count: sql<number>`count(*)` }).from(posts);
  const [txCount] = await database.select({ count: sql<number>`count(*)` }).from(transactions);
  return {
    totalUsers: Number(userCount?.count ?? 0),
    totalPosts: Number(postCount?.count ?? 0),
    totalTransactions: Number(txCount?.count ?? 0),
    totalRevenue: 0,
  };
}

export const adminRouter = router({
  getUsers: adminProcedure.query(async () => {
    const database = await db.getDb();
    return database.select().from(users).limit(100);
  }),
  banUser: adminProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ input }) => {
      // Account-state mutation is intentionally gated until a canonical
      // ban/suspension column and audit trail are defined.
      return { success: false, userId: input.userId, reason: "not_configured" };
    }),
  deleteContent: adminProcedure
    .input(z.object({ contentId: z.string() }))
    .mutation(async ({ input }) => ({
      success: false,
      contentId: input.contentId,
      reason: "not_configured",
    })),
  getReports: adminProcedure.query(async () => {
    const database = await db.getDb();
    return database.select().from(datingReports).orderBy(desc(datingReports.createdAt)).limit(100);
  }),
  getSystemStats: adminProcedure.query(getAdminStats),
  stats: adminProcedure.query(getAdminStats),
});

// ============ SEARCH PROCEDURES ============
export const searchRouter = router({
  global: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => ({ users: [], products: [], posts: [] })),
  users: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => []),
  products: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => []),
  posts: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => []),
});

// ============ SETTINGS PROCEDURES ============
export const settingsRouter = router({
  getSettings: protectedProcedure.query(async ({ ctx }) => ({})),
  updateSettings: protectedProcedure
    .input(z.object({ key: z.string(), value: z.any() }))
    .mutation(async ({ ctx, input }) => ({ success: true })),
  getPrivacy: protectedProcedure.query(async ({ ctx }) => ({})),
  updatePrivacy: protectedProcedure
    .input(z.object({ key: z.string(), value: z.boolean() }))
    .mutation(async ({ ctx, input }) => ({ success: true })),
});

// ============ BETA CONTRACT ROUTERS ============
const platformRouter = router({
  stats: publicProcedure.query(async () => {
    const database = await db.getDb();
    const [userCount] = await database.select({ count: sql<number>`count(*)` }).from(users);
    const [postCount] = await database.select({ count: sql<number>`count(*)` }).from(posts);
    const [txCount] = await database.select({ count: sql<number>`count(*)` }).from(transactions);
    const [communityCount] = await database.select({ count: sql<number>`count(*)` }).from(communities);
    return {
      totalUsers: Number(userCount?.count ?? 0),
      activeSessions: 0,
      totalPosts: Number(postCount?.count ?? 0),
      totalTransactions: Number(txCount?.count ?? 0),
      activeUsers: Number(userCount?.count ?? 0),
      totalCommunities: Number(communityCount?.count ?? 0),
      sessionTracking: "not_configured" as const,
    };
  }),
  health: publicProcedure.query(async () => ({
    status: "healthy" as const,
    uptime: Math.floor(process.uptime()),
    version: process.env.npm_package_version ?? "1.0.0",
  })),
});

const tokenRouter = router({
  metrics: publicProcedure.query(async () => {
    const database = await db.getDb();
    const [supply] = await database
      .select({ total: sql<number>`coalesce(sum(${tokenBalances.balance}), 0)` })
      .from(tokenBalances);
    const [staked] = await database
      .select({
        total: sql<number>`coalesce(sum(${stakingPositions.amount}), 0)`,
        participants: sql<number>`count(distinct ${stakingPositions.userId})`,
      })
      .from(stakingPositions);
    const [userCount] = await database.select({ count: sql<number>`count(*)` }).from(users);
    const totalSupply = Number(supply?.total ?? 0);
    return {
      totalSupply,
      circulatingSupply: totalSupply,
      price: null,
      marketCap: null,
      totalUsers: Number(userCount?.count ?? 0),
      totalStaked: Number(staked?.total ?? 0),
      burnedTokens: 0,
      stakingParticipants: Number(staked?.participants ?? 0),
      burnAccounting: "not_configured" as const,
      priceSource: "not_configured" as const,
    };
  }),
});

const stakingRouter = router({
  pools: publicProcedure.query(async () => []),
  userPositions: protectedProcedure.query(async ({ ctx }) => {
    const database = await db.getDb();
    return database
      .select()
      .from(stakingPositions)
      .where(eq(stakingPositions.userId, String(ctx.user.id)));
  }),
});

const gamefiRouter = router({
  leaderboard: publicProcedure.query(async () => []),
  seasonPass: publicProcedure.query(async () => {
    const database = await db.getDb();
    const now = new Date();
    const [season] = await database
      .select()
      .from(battlePasses)
      .where(and(lte(battlePasses.startDate, now), gte(battlePasses.endDate, now)))
      .orderBy(desc(battlePasses.startDate))
      .limit(1);
    if (!season) {
      return { season: null, name: null, status: "not_configured" as const };
    }
    return {
      season: season.seasonId,
      name: season.name,
      status: "active" as const,
      startDate: season.startDate,
      endDate: season.endDate,
    };
  }),
});

const moderationRouter = router({
  stats: adminProcedure.query(async () => {
    const database = await db.getDb();
    const [actions] = await database
      .select({ count: sql<number>`count(*)` })
      .from(moderationLogs);
    const [reports] = await database
      .select({
        total: sql<number>`count(*)`,
        resolved: sql<number>`sum(case when ${datingReports.status} = 'resolved' then 1 else 0 end)`,
      })
      .from(datingReports);
    const totalReports = Number(reports?.total ?? 0);
    const resolvedReports = Number(reports?.resolved ?? 0);
    return {
      totalActions: Number(actions?.count ?? 0),
      accuracy: totalReports === 0 ? 1 : resolvedReports / totalReports,
      totalReports,
      resolvedReports,
    };
  }),
});

// Placeholder namespaces remain explicit and must not be treated as beta-ready.
const placeholderRouter = router({
  stats: publicProcedure.query(async () => ({ status: "not_configured" as const })),
  health: publicProcedure.query(async () => ({ status: "not_configured" as const })),
  metrics: publicProcedure.query(async () => ({ status: "not_configured" as const })),
  pools: publicProcedure.query(async () => []),
  userPositions: protectedProcedure.query(async () => []),
  leaderboard: publicProcedure.query(async () => []),
  seasonPass: publicProcedure.query(async () => ({ status: "not_configured" as const })),
});

// ============ MAIN ROUTER ============
export const appRouter = router({
  mining: miningRouter,
  user: userRouter,
  auth: authRouter,
  post: postRouter,
  feed: postRouter,
  marketplace: marketplaceRouter,
  stream: streamRouter,
  transaction: transactionRouter,
  wallet: walletRouter,
  notification: notificationRouter,
  message: messageRouter,
  gaming: gamingRouter,
  gamification: gamificationRouter,
  content: contentRouter,
  analytics: analyticsRouter,
  admin: adminRouter,
  search: searchRouter,
  settings: settingsRouter,
  voice: voiceRouter,
  enterprise: enterpriseRouter,
  ai: aiRouter,
  hopeAI: hopeAIRouter,
  hopeIntelligence: hopeAIRouter,
  complianceIntelligence: hopeAIRouter,
  simulation: enterpriseRouter,
  languageExchange: enterpriseRouter,
  creator: userRouter,
  creatorGrowth: userRouter,
  prices: pricesRouter,
  system: systemRouter,
  platform: platformRouter,
  token: tokenRouter,
  staking: stakingRouter,
  gamefi: gamefiRouter,
  moderation: moderationRouter,
  dm: messageRouter,
  blockchain: walletRouter,
  aiEngineer: aiRouter,
  economy: transactionRouter,
  charity: placeholderRouter,
  trustSafety: placeholderRouter,
  ico: placeholderRouter,
  audienceLockIn: placeholderRouter,
  shadowIdentity: placeholderRouter,
  reputation: placeholderRouter,
  missions: placeholderRouter,
  governance: placeholderRouter,
  goc: placeholderRouter,
  aiPersonas: placeholderRouter,
  aiMarketplace: placeholderRouter,
  aiMarket: placeholderRouter,
});

export type AppRouter = typeof appRouter;
