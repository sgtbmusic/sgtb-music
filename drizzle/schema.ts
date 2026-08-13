import { boolean, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "rep", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Music catalog powering the BeatStars-style player on /music.
 * Audio bytes and cover art live in S3; only keys/urls are stored here.
 */
export const tracks = mysqlTable("tracks", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  artist: varchar("artist", { length: 200 }).default("SGTB Music").notNull(),
  genre: varchar("genre", { length: 120 }),
  bpm: int("bpm"),
  /** Public-facing audio URL served from storage, e.g. /manus-storage/{key} */
  audioUrl: text("audioUrl").notNull(),
  /** Storage key for the audio object. */
  audioKey: varchar("audioKey", { length: 512 }).notNull(),
  mimeType: varchar("mimeType", { length: 128 }),
  /** Optional uploaded cover art. When null the UI renders a generated template. */
  coverUrl: text("coverUrl"),
  coverKey: varchar("coverKey", { length: 512 }),
  /** Index used to select one of the generated cover-art templates. */
  coverVariant: int("coverVariant").default(0).notNull(),
  durationSeconds: int("durationSeconds"),
  sortOrder: int("sortOrder").default(0).notNull(),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("approved").notNull(),
  playsCount: int("playsCount").default(1420).notNull(),
  upvotesCount: int("upvotesCount").default(320).notNull(),
  hitPotential: int("hitPotential").default(94).notNull(),
  syncReady: int("syncReady").default(1).notNull(),
  uploaderId: int("uploaderId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Track = typeof tracks.$inferSelect;
export type InsertTrack = typeof tracks.$inferInsert;

/**
 * Suno Business creator profiles shown on /suno.
 * `credentials` is a JSON-encoded string array of short highlight lines.
 */
export const creators = mysqlTable("creators", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  role: varchar("role", { length: 200 }),
  handle: varchar("handle", { length: 120 }),
  imageUrl: text("imageUrl"),
  imageKey: varchar("imageKey", { length: 512 }),
  /** JSON string array, e.g. ["Head of Creators at Suno","Forbes 30 Under 30"] */
  credentials: text("credentials"),
  bio: text("bio"),
  /** True for neutral placeholder cards awaiting owner input. */
  isPlaceholder: boolean("isPlaceholder").default(true).notNull(),
  /** Rosie is featured; featured cards render in the hero slot. */
  isFeatured: boolean("isFeatured").default(false).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Creator = typeof creators.$inferSelect;
export type InsertCreator = typeof creators.$inferInsert;

/** Inquiries submitted from /contact. */
export const contactMessages = mysqlTable("contactMessages", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  projectType: varchar("projectType", { length: 120 }),
  message: text("message").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = typeof contactMessages.$inferInsert;
