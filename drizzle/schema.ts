
import { sqliteTable, text, integer, real, primaryKey } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

// ============ USERS TABLE ============
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").unique(),
  username: text("username").unique(),
  name: text("name"),
  bio: text("bio"),
  avatar: text("avatar"),
  balance: real("balance").default(0),
  role: text("role").default("user"), // admin | user
  verified: integer("verified", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(new Date()),
});

// ============ POSTS TABLE ============
export const posts = sqliteTable("posts", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id),
  content: text("content"),
  media: text("media"),
  likes: integer("likes").default(0),
  comments: integer("comments").default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(new Date()),
});

// ============ COMMENTS TABLE ============
export const comments = sqliteTable("comments", {
  id: text("id").primaryKey(),
  postId: text("post_id").references(() => posts.id),
  userId: text("user_id").references(() => users.id),
  content: text("content"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
});

// ============ LIKES TABLE ============
export const likes = sqliteTable("likes", {
  id: text("id").primaryKey(),
  postId: text("post_id").references(() => posts.id),
  userId: text("user_id").references(() => users.id),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
});

// ============ PRODUCTS TABLE ============
export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  name: text("name"),
  description: text("description"),
  price: real("price"),
  category: text("category"),
  image: text("image"),
  stock: integer("stock"),
  sellerId: text("seller_id").references(() => users.id),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
});

// ============ ORDERS TABLE ============
export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id),
  productId: text("product_id").references(() => products.id),
  quantity: integer("quantity"),
  total: real("total"),
  status: text("status"), // pending | shipped | delivered | cancelled
  shippingAddress: text("shipping_address"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
});

// ============ STREAMS TABLE ============
export const streams = sqliteTable("streams", {
  id: text("id").primaryKey(),
  streamerId: text("streamer_id").references(() => users.id),
  title: text("title"),
  description: text("description"),
  status: text("status"), // live | ended | scheduled
  viewers: integer("viewers").default(0),
  hlsUrl: text("hls_url"),
  archiveUrl: text("archive_url"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
});

// ============ TRANSACTIONS TABLE ============
export const transactions = sqliteTable("transactions", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id),
  type: text("type"), // deposit | withdrawal | transfer | purchase
  amount: real("amount"),
  toUserId: text("to_user_id").references(() => users.id),
  status: text("status"), // pending | completed | failed
  txHash: text("tx_hash"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
});

// ============ WALLETS TABLE ============
export const wallets = sqliteTable("wallets", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id),
  address: text("address"),
  balance: real("balance").default(0),
  currency: text("currency"), // BTC | ETH | SOL | DOGE | SKY444
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
});

// ============ FOLLOWS TABLE ============
export const follows = sqliteTable("follows", {
  id: text("id").primaryKey(),
  followerId: text("follower_id").references(() => users.id),
  followingId: text("following_id").references(() => users.id),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
});

// ============ NOTIFICATIONS TABLE ============
export const notifications = sqliteTable("notifications", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id),
  type: text("type"), // like | comment | follow | message | order
  content: text("content"),
  read: integer("read", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
});

// ============ MESSAGES TABLE ============
export const messages = sqliteTable("messages", {
  id: text("id").primaryKey(),
  senderId: text("sender_id").references(() => users.id),
  recipientId: text("recipient_id").references(() => users.id),
  content: text("content"),
  read: integer("read", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
});

// ============ REVIEWS TABLE ============
export const reviews = sqliteTable("reviews", {
  id: text("id").primaryKey(),
  productId: text("product_id").references(() => products.id),
  userId: text("user_id").references(() => users.id),
  rating: integer("rating"), // 1-5
  comment: text("comment"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
});

// ============ RELATIONS ============
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  orders: many(orders),
  products: many(products),
  streams: many(streams),
  wallets: many(wallets),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, { fields: [posts.userId], references: [users.id] }),
  comments: many(comments),
  likes: many(likes),
}));


// ============ AUDIT LEDGER TABLE ============
export const auditLedger = sqliteTable("audit_ledger", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id),
  eventType: text("event_type").notNull(),
  action: text("action").notNull(),
  details: text("details"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  status: text("status").default("success"), // success | failed | pending
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
});


// ============ TOKEN BALANCES TABLE ============
export const tokenBalances = sqliteTable("token_balances", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id).notNull(),
  tokenSymbol: text("token_symbol").notNull(), // BTC, ETH, SOL, DOGE, SKY444
  balance: real("balance").default(0),
  lockedBalance: real("locked_balance").default(0),
  stakedBalance: real("staked_balance").default(0),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(new Date()),
});

// ============ USER BEHAVIOR SIGNALS TABLE ============
export const userBehaviorSignals = sqliteTable("user_behavior_signals", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id).notNull(),
  signalType: text("signal_type").notNull(), // login | purchase | post | comment | follow | etc
  value: real("value").default(0),
  metadata: text("metadata"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
});


// ============ DATING SYSTEM TABLES ============
export const datingProfiles = sqliteTable("dating_profiles", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id).notNull(),
  bio: text("bio"),
  photos: text("photos"), // JSON array
  interests: text("interests"), // JSON array
  location: text("location"),
  age: integer("age"),
  gender: text("gender"),
  lookingFor: text("looking_for"),
  verified: integer("verified", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
});

export const datingMatches = sqliteTable("dating_matches", {
  id: text("id").primaryKey(),
  userId1: text("user_id_1").references(() => users.id).notNull(),
  userId2: text("user_id_2").references(() => users.id).notNull(),
  status: text("status").default("pending"), // pending | matched | rejected
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
});

export const datingLikes = sqliteTable("dating_likes", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id).notNull(),
  likedUserId: text("liked_user_id").references(() => users.id).notNull(),
  type: text("type").default("like"), // like | superlike
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
});

export const datingMessages = sqliteTable("dating_messages", {
  id: text("id").primaryKey(),
  matchId: text("match_id").references(() => datingMatches.id).notNull(),
  senderId: text("sender_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  read: integer("read", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
});

export const datingSubscriptions = sqliteTable("dating_subscriptions", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id).notNull(),
  tier: text("tier").default("free"), // free | premium | vip
  expiresAt: integer("expires_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
});

export const datingPreferences = sqliteTable("dating_preferences", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id).notNull(),
  minAge: integer("min_age").default(18),
  maxAge: integer("max_age").default(65),
  maxDistance: integer("max_distance").default(50),
  genderPreference: text("gender_preference"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
});

export const datingNotifications = sqliteTable("dating_notifications", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // match | message | like
  relatedUserId: text("related_user_id"),
  read: integer("read", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
});

export const datingBlocks = sqliteTable("dating_blocks", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id).notNull(),
  blockedUserId: text("blocked_user_id").references(() => users.id).notNull(),
  reason: text("reason"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
});

export const datingReports = sqliteTable("dating_reports", {
  id: text("id").primaryKey(),
  reporterId: text("reporter_id").references(() => users.id).notNull(),
  reportedUserId: text("reported_user_id").references(() => users.id).notNull(),
  reason: text("reason").notNull(),
  status: text("status").default("pending"), // pending | reviewed | resolved
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
});

// ============ FRAUD & SECURITY TABLES ============
export const fraudSignals = sqliteTable("fraud_signals", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id),
  signalType: text("signal_type").notNull(),
  severity: text("severity").default("low"), // low | medium | high | critical
  details: text("details"),
  resolved: integer("resolved", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
});

export const rateLimitBuckets = sqliteTable("rate_limit_buckets", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id),
  endpoint: text("endpoint").notNull(),
  count: integer("count").default(0),
  resetAt: integer("reset_at", { mode: "timestamp" }),
});

// ============ WALLET & TRANSACTION TABLES ============
export const walletTransactions = sqliteTable("wallet_transactions", {
  id: text("id").primaryKey(),
  walletId: text("wallet_id").references(() => wallets.id).notNull(),
  type: text("type").notNull(), // deposit | withdrawal | transfer | swap
  amount: real("amount").notNull(),
  fee: real("fee").default(0),
  status: text("status").default("pending"), // pending | confirmed | failed
  txHash: text("tx_hash"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
});

export const walletAuditLog = sqliteTable("wallet_audit_log", {
  id: text("id").primaryKey(),
  walletId: text("wallet_id").references(() => wallets.id).notNull(),
  action: text("action").notNull(),
  details: text("details"),
  ipAddress: text("ip_address"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
});

export const custodyWallets = sqliteTable("custody_wallets", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id).notNull(),
  provider: text("provider").notNull(), // coinbase | kraken | etc
  externalId: text("external_id").notNull(),
  balance: real("balance").default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
});

export const onChainTransactions = sqliteTable("on_chain_transactions", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id).notNull(),
  blockchain: text("blockchain").notNull(), // ethereum | solana | bitcoin
  txHash: text("tx_hash").notNull(),
  fromAddress: text("from_address"),
  toAddress: text("to_address"),
  amount: real("amount"),
  status: text("status").default("pending"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
});

// ============ TOKEN & ECONOMY TABLES ============
export const tokenMarketState = sqliteTable("token_market_state", {
  id: text("id").primaryKey(),
  tokenSymbol: text("token_symbol").notNull(),
  price: real("price").notNull(),
  marketCap: real("market_cap"),
  volume24h: real("volume_24h"),
  circulatingSupply: real("circulating_supply"),
  totalSupply: real("total_supply"),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(new Date()),
});

export const tokenEmissionCaps = sqliteTable("token_emission_caps", {
  id: text("id").primaryKey(),
  tokenSymbol: text("token_symbol").notNull(),
  maxEmission: real("max_emission"),
  currentEmission: real("current_emission"),
  emissionRate: real("emission_rate"),
  lastAdjustedAt: integer("last_adjusted_at", { mode: "timestamp" }),
});

export const userArchetypes = sqliteTable("user_archetypes", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id).notNull(),
  archetype: text("archetype").notNull(), // trader | hodler | miner | creator | etc
  score: real("score").default(0),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(new Date()),
});

// ============ GOVERNANCE & MODERATION TABLES ============
export const governanceProposals = sqliteTable("governance_proposals", {
  id: text("id").primaryKey(),
  proposerId: text("proposer_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").default("active"), // active | passed | failed | executed
  votesFor: integer("votes_for").default(0),
  votesAgainst: integer("votes_against").default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
  expiresAt: integer("expires_at", { mode: "timestamp" }),
});

export const governanceVotes = sqliteTable("governance_votes", {
  id: text("id").primaryKey(),
  proposalId: text("proposal_id").references(() => governanceProposals.id).notNull(),
  voterId: text("voter_id").references(() => users.id).notNull(),
  vote: text("vote").notNull(), // for | against
  weight: real("weight").default(1),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
});

export const moderationLogs = sqliteTable("moderation_logs", {
  id: text("id").primaryKey(),
  moderatorId: text("moderator_id").references(() => users.id),
  targetUserId: text("target_user_id").references(() => users.id),
  action: text("action").notNull(), // warn | mute | ban | delete
  reason: text("reason"),
  duration: integer("duration"), // in seconds, null for permanent
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
});

export const platformMetrics = sqliteTable("platform_metrics", {
  id: text("id").primaryKey(),
  metricType: text("metric_type").notNull(), // dau | mau | tvl | volume
  value: real("value").notNull(),
  timestamp: integer("timestamp", { mode: "timestamp" }).default(new Date()),
});
