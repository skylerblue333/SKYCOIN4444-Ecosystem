/**
 * HOPE AI intelligence persistence schema.
 *
 * This is the typed Drizzle counterpart of drizzle/manual/intelligence_layer.sql.
 * User identity columns intentionally use VARCHAR(255) to match the canonical
 * users.id / authenticated context model used by the current application.
 */
import {
  boolean,
  decimal,
  index,
  int,
  json,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

export const twinMemory = mysqlTable(
  "twin_memory",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: varchar("userId", { length: 255 }).notNull(),
    summary: text("summary"),
    goals: json("goals").$type<unknown[]>(),
    projects: json("projects").$type<unknown[]>(),
    preferences: json("preferences").$type<Record<string, string>>(),
    finances: json("finances").$type<Record<string, unknown>>(),
    learning: json("learning").$type<unknown[]>(),
    lastInteractionAt: timestamp("lastInteractionAt").defaultNow().notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    userUnique: uniqueIndex("twin_memory_userId_unique").on(table.userId),
  })
);

export const twinFacts = mysqlTable(
  "twin_facts",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: varchar("userId", { length: 255 }).notNull(),
    kind: varchar("kind", { length: 32 })
      .$type<"goal" | "project" | "preference" | "finance" | "learning" | "fact" | "event">()
      .default("fact")
      .notNull(),
    content: text("content").notNull(),
    source: varchar("source", { length: 64 }).default("chat").notNull(),
    confidence: int("confidence").default(80).notNull(),
    active: boolean("active").default(true).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => ({
    userIdx: index("twin_facts_userId_idx").on(table.userId),
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
    breakdown: json("breakdown").$type<Record<string, number>>(),
    computedAt: timestamp("computedAt").defaultNow().notNull(),
  },
  table => ({
    userUnique: uniqueIndex("reputation_scores_userId_unique").on(table.userId),
  })
);

export const opportunities = mysqlTable(
  "opportunities",
  {
    id: int("id").autoincrement().primaryKey(),
    postedBy: varchar("postedBy", { length: 255 }),
    type: varchar("type", { length: 32 })
      .$type<"job" | "project" | "investor" | "cofounder" | "mentor" | "study_partner" | "language_partner" | "gig">()
      .notNull(),
    title: varchar("title", { length: 200 }).notNull(),
    description: text("description"),
    skills: json("skills").$type<string[]>(),
    tags: json("tags").$type<string[]>(),
    location: varchar("location", { length: 120 }),
    remote: boolean("remote").default(true).notNull(),
    compensation: varchar("compensation", { length: 120 }),
    status: varchar("status", { length: 16 })
      .$type<"open" | "closed" | "filled">()
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
    status: varchar("status", { length: 16 })
      .$type<"suggested" | "saved" | "applied" | "dismissed">()
      .default("suggested")
      .notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => ({
    userIdx: index("opportunity_matches_userId_idx").on(table.userId),
  })
);

export const missions = mysqlTable(
  "missions",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: varchar("userId", { length: 255 }).notNull(),
    title: varchar("title", { length: 200 }).notNull(),
    category: varchar("category", { length: 24 })
      .$type<"skill" | "language" | "startup" | "career" | "fitness" | "custom">()
      .default("skill")
      .notNull(),
    description: text("description"),
    status: varchar("status", { length: 16 })
      .$type<"active" | "completed" | "paused" | "abandoned">()
      .default("active")
      .notNull(),
    progress: int("progress").default(0).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => ({
    userIdx: index("missions_userId_idx").on(table.userId),
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
    missionIdx: index("mission_steps_missionId_idx").on(table.missionId),
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
    businessPlan: json("businessPlan").$type<Record<string, unknown>>(),
    branding: json("branding").$type<Record<string, unknown>>(),
    marketing: json("marketing").$type<Record<string, unknown>>(),
    mvpRoadmap: json("mvpRoadmap").$type<Array<{ phase: string; items: string[] }>>(),
    teamPlan: json("teamPlan").$type<Array<{ role: string; focus: string }>>(),
    status: varchar("status", { length: 16 })
      .$type<"draft" | "generated" | "launched">()
      .default("generated")
      .notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => ({
    userIdx: index("startup_blueprints_userId_idx").on(table.userId),
  })
);

export const aiMarketListings = mysqlTable(
  "ai_market_listings",
  {
    id: int("id").autoincrement().primaryKey(),
    sellerId: varchar("sellerId", { length: 255 }).notNull(),
    kind: varchar("kind", { length: 24 })
      .$type<"agent" | "prompt" | "workflow" | "template" | "automation">()
      .notNull(),
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
    buyerIdx: index("ai_market_purchases_buyerId_idx").on(table.buyerId),
    buyerListingUnique: uniqueIndex("ai_market_purchases_buyer_listing_unique").on(
      table.buyerId,
      table.listingId
    ),
  })
);

export const directMessages = mysqlTable(
  "direct_messages",
  {
    id: int("id").autoincrement().primaryKey(),
    senderId: varchar("sender_id", { length: 255 }).notNull(),
    recipientId: varchar("recipient_id", { length: 255 }).notNull(),
    content: text("content").notNull(),
    mediaUrl: varchar("media_url", { length: 1024 }),
    isDisappearing: boolean("is_disappearing").default(false).notNull(),
    disappearsAt: timestamp("disappears_at"),
    deletedBySender: boolean("deleted_by_sender").default(false).notNull(),
    deletedByRecipient: boolean("deleted_by_recipient").default(false).notNull(),
    readAt: timestamp("read_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  table => ({
    recipientIdx: index("direct_messages_recipient_idx").on(table.recipientId),
    senderIdx: index("direct_messages_sender_idx").on(table.senderId),
  })
);

export const payouts = mysqlTable(
  "payouts",
  {
    id: int("id").autoincrement().primaryKey(),
    creatorId: varchar("creator_id", { length: 255 }).notNull(),
    amount: decimal("amount", { precision: 18, scale: 2 }).default("0").notNull(),
    status: varchar("status", { length: 24 }).default("pending").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  table => ({
    creatorIdx: index("payouts_creator_idx").on(table.creatorId),
    statusIdx: index("payouts_status_idx").on(table.status),
  })
);

export type TwinMemory = typeof twinMemory.$inferSelect;
export type TwinFact = typeof twinFacts.$inferSelect;
export type ReputationScore = typeof reputationScores.$inferSelect;
export type Opportunity = typeof opportunities.$inferSelect;
export type OpportunityMatch = typeof opportunityMatches.$inferSelect;
export type Mission = typeof missions.$inferSelect;
export type MissionStep = typeof missionSteps.$inferSelect;
export type StartupBlueprint = typeof startupBlueprints.$inferSelect;
export type AiMarketListing = typeof aiMarketListings.$inferSelect;
