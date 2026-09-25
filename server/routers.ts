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
        name: z.string().max(255).optional(),
        bio: z.string().max(255).optional(),
        avatar: z.string().max(255).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await db.updateUserProfile(String(ctx.user.id), input);
      return { success: Boolean(user), user };
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
      const result = await db.createFollow(String(ctx.user.id), input.userId);
      if (result.success) {
        await db.createNotification(
          input.userId,
          "follow",
          `${ctx.user.name || ctx.user.username || "Someone"} followed you`
        );
      }
      return result;
    }),
  getFollowers: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => db.getFollowers(input.userId)),
  getStats: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => db.getUserStats(input.userId)),
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
    .mutation(async ({ ctx, input }) =>
      db.createLike(input.postId, String(ctx.user.id))
    ),
  comment: protectedProcedure
    .input(z.object({ postId: z.string(), content: z.string().min(1).max(255) }))
    .mutation(async ({ ctx, input }) => {
      const comment = await db.createComment(
        input.postId,
        String(ctx.user.id),
        input.content
      );
      return { success: true, comment };
    }),
  delete: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) =>
      db.deletePost(String(ctx.user.id), input.postId)
    ),
  edit: protectedProcedure
    .input(z.object({ postId: z.string(), content: z.string().min(1).max(255) }))
    .mutation(async ({ ctx, input }) => {
      const post = await db.updatePost(
        String(ctx.user.id),
        input.postId,
        input.content
      );
      return { success: Boolean(post), post };
    }),
});

// ============ MARKETPLACE PROCEDURES ============
export const marketplaceRouter = router({
  listProducts: publicProcedure
    .input(
      z.object({
        category: z.string().max(255).optional(),
        limit: z.number().int().min(1).max(100).default(20),
        offset: z.number().int().min(0).default(0),
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
      z.object({
        name: z.string().min(1).max(255),
        price: z.number().nonnegative(),
        category: z.string().min(1).max(255),
      })
    )
    .mutation(async ({ ctx, input }) =>
      db.createProduct({
        ...input,
        sellerId: String(ctx.user.id),
      })
    ),
  createOrder: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        quantity: z.number().int().positive().max(1000),
        shippingAddress: z.string().min(1).max(255),
      })
    )
    .mutation(async ({ ctx, input }) =>
      db.createOrder({
        ...input,
        userId: String(ctx.user.id),
      })
    ),
  getOrders: protectedProcedure.query(async ({ ctx }) =>
    db.getOrders(String(ctx.user.id))
  ),
  updateOrderStatus: protectedProcedure
    .input(
      z.object({
        orderId: z.string(),
        status: z.string().min(1).max(64),
      })
    )
    .mutation(async ({ ctx, input }) =>
      db.updateOrderStatus(
        String(ctx.user.id),
        input.orderId,
        input.status
      )
    ),
  getReviews: publicProcedure
    .input(z.object({ productId: z.string() }))
    .query(async ({ input }) => db.getReviews(input.productId)),
  addReview: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        rating: z.number().int().min(1).max(5),
        comment: z.string().min(1).max(255),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const product = await db.getProductById(input.productId);
      if (!product) {
        return {
          success: false as const,
          reason: "product_not_found" as const,
          review: null,
        };
      }
      const review = await db.createReview(
        input.productId,
        String(ctx.user.id),
        input.rating,
        input.comment
      );
      return {
        success: Boolean(review),
        review,
      };
    }),
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
    db.getTransactions(String(ctx.user.id))
  ),
  create: protectedProcedure
    .input(
      z.object({
        type: z.string().min(1).max(64),
        amount: z.number().positive(),
        toUserId: z.string().optional(),
      })
    )
    .mutation(async () => ({
      success: false,
      status: "not_configured" as const,
      reason: "financial_transfer_not_configured" as const,
      transactionId: null,
    })),
  getBalance: protectedProcedure.query(async ({ ctx }) => {
    const user = await db.getUserById(String(ctx.user.id));
    return {
      balance: user?.balance ?? 0,
      source: "user_balance" as const,
    };
  }),
});

// ============ WALLET PROCEDURES ============
export const walletRouter = router({
  list: protectedProcedure.query(async ({ ctx }) =>
    db.getWallets(String(ctx.user.id))
  ),
  create: protectedProcedure
    .input(
      z.object({
        currency: z.string().min(1).max(32),
        address: z.string().min(1).max(255),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const wallet = await db.createWallet(
        String(ctx.user.id),
        input.currency,
        input.address
      );
      return { success: Boolean(wallet), wallet };
    }),
  getBalance: protectedProcedure
    .input(z.object({ currency: z.string().min(1).max(32) }))
    .query(async ({ ctx, input }) => {
      const wallet = await db.getWalletByCurrency(
        String(ctx.user.id),
        input.currency
      );
      return wallet
        ? {
            balance: wallet.balance ?? 0,
            currency: wallet.currency,
            address: wallet.address,
            status: "available" as const,
          }
        : {
            balance: 0,
            currency: input.currency.trim().toUpperCase(),
            address: null,
            status: "wallet_not_found" as const,
          };
    }),
  send: protectedProcedure
    .input(
      z.object({
        currency: z.string().min(1).max(32),
        amount: z.number().positive(),
        toAddress: z.string().min(1).max(255),
      })
    )
    .mutation(async () => ({
      success: false,
      status: "not_configured" as const,
      reason: "external_transfer_not_configured" as const,
      txHash: null,
    })),
  receive: protectedProcedure
    .input(z.object({ currency: z.string().min(1).max(32) }))
    .query(async ({ ctx, input }) => {
      const wallet = await db.getWalletByCurrency(
        String(ctx.user.id),
        input.currency
      );
      return wallet
        ? {
            address: wallet.address,
            currency: wallet.currency,
            status: "available" as const,
          }
        : {
            address: null,
            currency: input.currency.trim().toUpperCase(),
            status: "wallet_not_found" as const,
          };
    }),
});

// ============ NOTIFICATION PROCEDURES ============
export const notificationRouter = router({
  list: protectedProcedure
    .input(
      z
        .object({ limit: z.number().int().min(1).max(50).default(20) })
        .optional()
    )
    .query(async ({ ctx, input }) =>
      db.getNotifications(String(ctx.user.id), input?.limit ?? 20)
    ),
  markAsRead: protectedProcedure
    .input(z.object({ notificationId: z.string() }))
    .mutation(async ({ ctx, input }) =>
      db.markNotificationAsRead(input.notificationId, String(ctx.user.id))
    ),
  markAllAsRead: protectedProcedure.mutation(async ({ ctx }) =>
    db.markAllNotificationsAsRead(String(ctx.user.id))
  ),
  delete: protectedProcedure
    .input(z.object({ notificationId: z.string() }))
    .mutation(async ({ ctx, input }) =>
      db.deleteNotification(input.notificationId, String(ctx.user.id))
    ),
  getUnread: protectedProcedure.query(async ({ ctx }) => ({
    count: await db.getUnreadNotificationCount(String(ctx.user.id)),
  })),
});

// ============ MESSAGE PROCEDURES ============
export const messageRouter = router({
  list: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) =>
      db.getConversation(String(ctx.user.id), input.userId)
    ),
  send: protectedProcedure
    .input(
      z.object({
        recipientId: z.string(),
        content: z.string().min(1).max(255),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const message = await db.createMessage(
        String(ctx.user.id),
        input.recipientId,
        input.content
      );
      await db.createNotification(
        input.recipientId,
        "message",
        `New message from ${ctx.user.name || ctx.user.username || "a user"}`
      );
      return { success: true, message };
    }),
  markAsRead: protectedProcedure
    .input(z.object({ messageId: z.string() }))
    .mutation(async ({ ctx, input }) =>
      db.markMessageAsRead(input.messageId, String(ctx.user.id))
    ),
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
      .from(tokenBalances)
      .where(eq(tokenBalances.tokenSymbol, "SKY444"));
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
      asset: "SKY444" as const,
      supplySource: "user_balance_sum" as const,
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
    try {
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
    } catch (error) {
      // battle_passes is currently outside the canonical beta Drizzle schema.
      // Missing optional GameFi storage must degrade safely, not take down the API.
      console.warn("[GameFi] Season storage unavailable:", String(error));
      return { season: null, name: null, status: "not_configured" as const };
    }
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
