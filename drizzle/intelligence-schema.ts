import {
  boolean,
  decimal,
  index,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

// HOPE AI intelligence-layer persistence.
// User identifiers intentionally use varchar to match the canonical users.id
// string/UUID architecture in drizzle/schema.ts.

export const twinMemory = mysqlTable(
  "twin_memory",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: varchar("userId", { length: 255 }).notNull(),
    summary: text("summary"),
    goals: json("goals"),
    projects: json("projects"),
    preferences: json("preferences"),
    finances: json("finances"),
    learning: json("learning"),
    lastInteractionAt: timestamp("lastInteractionAt").defaultNow().notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    userIdUnique: uniqueIndex("twin_memory_userId_unique").on(table.userId),
  })
);

export const twinFacts = mysqlTable(
  "twin_facts",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: varchar("userId", { length: 255 }).notNull(),
    kind: mysqlEnum("kind", [
      "goal",
      "project",
      "preference",
      "finance",
      "learning",
      "fact",
      "event",
    ])
      .default("fact")
      .notNull(),
    content: text("content").notNull(),
    source: varchar("source", { length: 64 }).default("chat").notNull(),
    confidence: int("confidence").default(80).notNull(),
    active: boolean("active").default(true).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => ({
    userIdIdx: index("twin_facts_userId_idx").on(table.userId),
  })
);

export const reputationScores = mysqlTable(
  "reputation_scores",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: varchar("userId", { length: 255 }).notNull(),
    learningScore: int("learningScore").default(0).notNull(),
    builderScore: int("builderScore").default(0).notNull(),
    teachingScore: int("teachingScore").default(0).notNull(),
    communityScore: int("communityScore").default(0).notNull(),
    trustScore: int("trustScore").default(50).notNull(),
    overall: int("overall").default(0).notNull(),
    breakdown: json("breakdown"),
    computedAt: timestamp("computedAt").defaultNow().notNull(),
  },
  table => ({
    userIdUnique: uniqueIndex("reputation_scores_userId_unique").on(table.userId),
  })
);

export const opportunities = mysqlTable(
  "opportunities",
  {
    id: int("id").autoincrement().primaryKey(),
    postedBy: varchar("postedBy", { length: 255 }),
    type: mysqlEnum("type", [
      "job",
      "project",
      "investor",
      "cofounder",
      "mentor",
      "study_partner",
      "language_partner",
      "gig",
    ]).notNull(),
    title: varchar("title", { length: 200 }).notNull(),
    description: text("description"),
    skills: json("skills").$type<string[]>(),
    tags: json("tags").$type<string[]>(),
    location: varchar("location", { length: 120 }),
    remote: boolean("remote").default(true).notNull(),
    compensation: varchar("compensation", { length: 120 }),
    status: mysqlEnum("status", ["open", "closed", "filled"])
      .default("open")
      .notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => ({
    typeIdx: index("opportunities_type_idx").on(table.type),
    statusIdx: index("opportunities_status_idx").on(table.status),
  })
);

export const opportunityMatches = mysqlTable(
  "opportunity_matches",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: varchar("userId", { length: 255 }).notNull(),
    opportunityId: int("opportunityId").notNull(),
    score: int("score").default(0).notNull(),
    reasoning: text("reasoning"),
    status: mysqlEnum("status", ["suggested", "saved", "applied", "dismissed"])
      .default("suggested")
      .notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => ({
    userIdIdx: index("opportunity_matches_userId_idx").on(table.userId),
  })
);

export const missions = mysqlTable(
  "missions",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: varchar("userId", { length: 255 }).notNull(),
    title: varchar("title", { length: 200 }).notNull(),
    category: mysqlEnum("category", [
      "skill",
      "language",
      "startup",
      "career",
      "fitness",
      "custom",
    ])
      .default("skill")
      .notNull(),
    description: text("description"),
    status: mysqlEnum("status", ["active", "completed", "paused", "abandoned"])
      .default("active")
      .notNull(),
    progress: int("progress").default(0).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    userIdIdx: index("missions_userId_idx").on(table.userId),
  })
);

export const missionSteps = mysqlTable(
  "mission_steps",
  {
    id: int("id").autoincrement().primaryKey(),
    missionId: int("missionId").notNull(),
    ordinal: int("ordinal").default(0).notNull(),
    title: varchar("title", { length: 200 }).notNull(),
    detail: text("detail"),
    done: boolean("done").default(false).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => ({
    missionIdIdx: index("mission_steps_missionId_idx").on(table.missionId),
  })
);

export const startupBlueprints = mysqlTable(
  "startup_blueprints",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: varchar("userId", { length: 255 }).notNull(),
    idea: text("idea").notNull(),
    name: varchar("name", { length: 160 }),
    tagline: varchar("tagline", { length: 240 }),
    businessPlan: json("businessPlan"),
    branding: json("branding"),
    marketing: json("marketing"),
    mvpRoadmap: json("mvpRoadmap"),
    teamPlan: json("teamPlan"),
    status: mysqlEnum("status", ["draft", "generated", "launched"])
      .default("generated")
      .notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => ({
    userIdIdx: index("startup_blueprints_userId_idx").on(table.userId),
  })
);

export const aiMarketListings = mysqlTable(
  "ai_market_listings",
  {
    id: int("id").autoincrement().primaryKey(),
    sellerId: varchar("sellerId", { length: 255 }).notNull(),
    kind: mysqlEnum("kind", [
      "agent",
      "prompt",
      "workflow",
      "template",
      "automation",
    ]).notNull(),
    title: varchar("title", { length: 200 }).notNull(),
    description: text("description"),
    content: text("content"),
    priceCents: int("priceCents").default(0).notNull(),
    tags: json("tags").$type<string[]>(),
    sales: int("sales").default(0).notNull(),
    ratingSum: int("ratingSum").default(0).notNull(),
    ratingCount: int("ratingCount").default(0).notNull(),
    active: boolean("active").default(true).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => ({
    kindIdx: index("ai_market_listings_kind_idx").on(table.kind),
  })
);

export const aiMarketPurchases = mysqlTable(
  "ai_market_purchases",
  {
    id: int("id").autoincrement().primaryKey(),
    listingId: int("listingId").notNull(),
    buyerId: varchar("buyerId", { length: 255 }).notNull(),
    pricePaidCents: int("pricePaidCents").default(0).notNull(),
    rated: boolean("rated").default(false).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => ({
    buyerIdIdx: index("ai_market_purchases_buyerId_idx").on(table.buyerId),
  })
);

// These two durable tables are consumed by the mission-control intelligence
// aggregation but were previously missing from the exported schema.
export const directMessages = mysqlTable(
  "direct_messages",
  {
    id: int("id").autoincrement().primaryKey(),
    senderId: varchar("senderId", { length: 255 }).notNull(),
    recipientId: varchar("recipientId", { length: 255 }).notNull(),
    content: text("content").notNull(),
    readAt: timestamp("readAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => ({
    recipientIdx: index("direct_messages_recipientId_idx").on(table.recipientId),
  })
);

export const payouts = mysqlTable(
  "payouts",
  {
    id: int("id").autoincrement().primaryKey(),
    creatorId: varchar("creatorId", { length: 255 }).notNull(),
    amount: decimal("amount", { precision: 18, scale: 2 }).default("0").notNull(),
    status: mysqlEnum("status", ["pending", "completed", "failed"])
      .default("pending")
      .notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => ({
    creatorIdx: index("payouts_creatorId_idx").on(table.creatorId),
    statusIdx: index("payouts_status_idx").on(table.status),
  })
);

export const hopeAiMessages = mysqlTable(
  "hope_ai_messages",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: varchar("userId", { length: 255 }).notNull(),
    role: mysqlEnum("role", ["user", "assistant", "system"]).notNull(),
    content: text("content").notNull(),
    tone: varchar("tone", { length: 64 }),
    emotionalState: varchar("emotionalState", { length: 64 }),
    sessionId: varchar("sessionId", { length: 120 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => ({
    userIdx: index("hope_ai_messages_userId_idx").on(table.userId),
    sessionIdx: index("hope_ai_messages_sessionId_idx").on(table.sessionId),
  })
);

export type HopeAiMessage = typeof hopeAiMessages.$inferSelect;

export type TwinMemory = typeof twinMemory.$inferSelect;
export type TwinFact = typeof twinFacts.$inferSelect;
export type ReputationScore = typeof reputationScores.$inferSelect;
export type Opportunity = typeof opportunities.$inferSelect;
export type OpportunityMatch = typeof opportunityMatches.$inferSelect;
export type Mission = typeof missions.$inferSelect;
export type MissionStep = typeof missionSteps.$inferSelect;
export type StartupBlueprint = typeof startupBlueprints.$inferSelect;
export type AiMarketListing = typeof aiMarketListings.$inferSelect;
