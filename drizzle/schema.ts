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
  avatarUrl: text("avatarUrl"),
  username: varchar("username", { length: 80 }).unique(),
  bio: text("bio"),
  websiteUrl: varchar("websiteUrl", { length: 512 }),
  socialLinksJson: text("socialLinksJson"),
  emailUpdatesEnabled: int("emailUpdatesEnabled").default(1).notNull(),
  pushEnabled: int("pushEnabled").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const socialPosts = mysqlTable("social_posts", {
  id: int("id").autoincrement().primaryKey(),
  authorId: int("authorId").notNull(),
  body: text("body").notNull(),
  mediaUrl: text("mediaUrl"),
  mediaType: mysqlEnum("mediaType", ["image", "audio"]),
  mediaTitle: varchar("mediaTitle", { length: 200 }),
  likesCount: int("likesCount").default(0).notNull(),
  commentsCount: int("commentsCount").default(0).notNull(),
  repostsCount: int("repostsCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SocialPost = typeof socialPosts.$inferSelect;
export type InsertSocialPost = typeof socialPosts.$inferInsert;

export const socialPostLikes = mysqlTable("social_post_likes", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull(),
  userId: int("userId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const socialPostComments = mysqlTable("social_post_comments", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull(),
  authorId: int("authorId").notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const directMessages = mysqlTable("direct_messages", {
  id: int("id").autoincrement().primaryKey(),
  senderId: int("senderId").notNull(),
  recipientId: int("recipientId").notNull(),
  body: text("body").notNull(),
  readAt: timestamp("readAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/**
 * Music catalog powering the BeatStars-style player on /music.
 * Audio bytes and cover art live in S3; only keys/urls are stored here.
 */
export const tracks = mysqlTable("tracks", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  artist: varchar("artist", { length: 200 }).default("SGTB Music").notNull(),
  genre: varchar("genre", { length: 120 }),
  subGenre: varchar("subGenre", { length: 120 }),
  bpm: int("bpm"),
  trackKey: varchar("trackKey", { length: 30 }),
  vibe: varchar("vibe", { length: 150 }),
  dspPlacement: varchar("dspPlacement", { length: 150 }),
  lyrics: text("lyrics"),
  aiPackagingEnabled: int("aiPackagingEnabled").default(0).notNull(),
  virtualArtistsJson: text("virtualArtistsJson"),
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

export const sunoEpisodes = mysqlTable("sunoEpisodes", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  host: varchar("host", { length: 200 }).default("Rosie Nguyen & Guests").notNull(),
  description: text("description"),
  audioUrl: text("audioUrl").notNull(),
  audioKey: varchar("audioKey", { length: 512 }).notNull(),
  durationSeconds: int("durationSeconds"),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SunoEpisode = typeof sunoEpisodes.$inferSelect;
export type InsertSunoEpisode = typeof sunoEpisodes.$inferInsert;

export const userRewards = mysqlTable("user_rewards", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().unique(),
  points: int("points").default(150).notNull(),
  tracksListened: int("tracks_listened").default(3).notNull(),
  episodesListened: int("episodes_listened").default(1).notNull(),
  tracksShared: int("tracks_shared").default(0).notNull(),
  draftsRated: int("drafts_rated").default(2).notNull(),
  tier: varchar("tier", { length: 32 }).default("Listener").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type UserReward = typeof userRewards.$inferSelect;
export type InsertUserReward = typeof userRewards.$inferInsert;

export const executiveCatalog = mysqlTable("executiveCatalog", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  artist: varchar("artist", { length: 200 }).notNull(),
  category: mysqlEnum("category", ["Suno Voice Persona", "Hybrid Stems (Pro Tools Mix)", "Live Sync Concepts"]).notNull(),
  audioUrl: text("audioUrl").notNull(),
  stemPackageUrl: text("stemPackageUrl"),
  bpm: int("bpm").default(120).notNull(),
  genre: varchar("genre", { length: 100 }).default("Pop / Cinematic").notNull(),
  hitPotential: int("hitPotential").default(95).notNull(),
  description: text("description"),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ExecutiveCatalogItem = typeof executiveCatalog.$inferSelect;
export type InsertExecutiveCatalogItem = typeof executiveCatalog.$inferInsert;

export const executiveMeetings = mysqlTable("executiveMeetings", {
  id: int("id").autoincrement().primaryKey(),
  executiveName: varchar("executiveName", { length: 200 }).notNull(),
  organization: varchar("organization", { length: 200 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  requestedDate: varchar("requestedDate", { length: 100 }).notNull(),
  notes: text("notes"),
  status: mysqlEnum("status", ["pending", "confirmed", "completed"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ExecutiveMeeting = typeof executiveMeetings.$inferSelect;
export type InsertExecutiveMeeting = typeof executiveMeetings.$inferInsert;

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

export const cadenceTournaments = mysqlTable("cadence_tournaments", {
  id: int("id").autoincrement().primaryKey(),
  seasonName: varchar("seasonName", { length: 128 }).notNull(),
  winnerName: varchar("winnerName", { length: 128 }).notNull(),
  winningPoints: int("winningPoints").notNull(),
  prizeDescription: text("prizeDescription").notNull(),
  endedAt: timestamp("endedAt").defaultNow().notNull(),
});

export type CadenceTournament = typeof cadenceTournaments.$inferSelect;
export type InsertCadenceTournament = typeof cadenceTournaments.$inferInsert;
