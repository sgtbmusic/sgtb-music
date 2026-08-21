import { and, asc, desc, eq, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  contactMessages,
  creators,
  InsertContactMessage,
  InsertCreator,
  InsertTrack,
  tracks,
  InsertUser,
  users,
  cadenceTournaments,
  sunoEpisodes,
  InsertSunoEpisode,
  executiveCatalog,
  InsertExecutiveCatalogItem,
  executiveMeetings,
  InsertExecutiveMeeting,
  userRewards,
  UserReward,
  InsertUserReward,
  directMessages,
  socialPosts,
  socialPostComments,
  socialPostLikes,
  InsertSocialPost,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createLocalUser(data: { openId: string; email: string; name: string; passwordHash: string; verificationToken: string; verificationExpiresAt: Date }) {
  const db = await requireDb();
  await db.insert(users).values({ ...data, loginMethod: "email", emailVerified: 0, lastSignedIn: new Date() });
  return getUserByOpenId(data.openId);
}

async function requireDb() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db;
}

/* ------------------------------ Tracks ------------------------------ */

export async function listTracks() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(tracks)
    .where(eq(tracks.status, "approved"))
    .orderBy(asc(tracks.sortOrder), asc(tracks.id));
}

export async function listAllTracksAdmin() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(tracks).orderBy(asc(tracks.sortOrder), asc(tracks.id));
}

export async function listPendingTracks(limit = 8) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      track: {
        id: tracks.id,
        title: tracks.title,
        artist: tracks.artist,
        audioUrl: tracks.audioUrl,
        coverUrl: tracks.coverUrl,
        coverVariant: tracks.coverVariant,
        durationSeconds: tracks.durationSeconds,
        genre: tracks.genre,
        subGenre: tracks.subGenre,
        bpm: tracks.bpm,
        trackKey: tracks.trackKey,
        vibe: tracks.vibe,
        playsCount: tracks.playsCount,
        upvotesCount: tracks.upvotesCount,
        hitPotential: tracks.hitPotential,
        syncReady: tracks.syncReady,
        status: tracks.status,
        createdAt: tracks.createdAt,
      },
      uploader: {
        id: users.id,
        name: users.name,
        username: users.username,
        sunoHandle: users.sunoHandle,
      },
    })
    .from(tracks)
    .leftJoin(users, eq(tracks.uploaderId, users.id))
    .where(eq(tracks.status, "pending"))
    .orderBy(desc(tracks.upvotesCount), desc(tracks.playsCount), asc(tracks.createdAt))
    .limit(limit);
}

export async function listUserTracks(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(tracks)
    .where(eq(tracks.uploaderId, userId))
    .orderBy(desc(tracks.createdAt));
}

export async function createTrack(values: InsertTrack) {
  const db = await requireDb();
  const result = await db.insert(tracks).values(values).$returningId();
  return result[0]?.id;
}

export async function updateTrack(id: number, values: Partial<InsertTrack>) {
  const db = await requireDb();
  await db.update(tracks).set(values).where(eq(tracks.id, id));
}

export async function deleteTrack(id: number) {
  const db = await requireDb();
  await db.delete(tracks).where(eq(tracks.id, id));
}

export async function getMaxTrackSortOrder() {
  const db = await getDb();
  if (!db) return 0;
  const rows = await db
    .select({ sortOrder: tracks.sortOrder })
    .from(tracks)
    .orderBy(desc(tracks.sortOrder))
    .limit(1);
  return rows[0]?.sortOrder ?? 0;
}

/* ----------------------------- Creators ----------------------------- */

export async function listCreators() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(creators).orderBy(asc(creators.sortOrder), asc(creators.id));
}

export async function createCreator(values: InsertCreator) {
  const db = await requireDb();
  const result = await db.insert(creators).values(values).$returningId();
  return result[0]?.id;
}

export async function updateCreator(id: number, values: Partial<InsertCreator>) {
  const db = await requireDb();
  await db.update(creators).set(values).where(eq(creators.id, id));
}

export async function deleteCreator(id: number) {
  const db = await requireDb();
  await db.delete(creators).where(eq(creators.id, id));
}

export async function getMaxCreatorSortOrder() {
  const db = await getDb();
  if (!db) return 0;
  const rows = await db
    .select({ sortOrder: creators.sortOrder })
    .from(creators)
    .orderBy(desc(creators.sortOrder))
    .limit(1);
  return rows[0]?.sortOrder ?? 0;
}

/* ------------------------- Contact messages ------------------------- */

export async function createContactMessage(values: InsertContactMessage) {
  const db = await requireDb();
  const result = await db.insert(contactMessages).values(values).$returningId();
  return result[0]?.id;
}

export async function listContactMessages() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(contactMessages)
    .orderBy(desc(contactMessages.createdAt))
    .limit(200);
}

/* -------------------------- Suno Episodes --------------------------- */

export async function listSunoEpisodes() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(sunoEpisodes).orderBy(asc(sunoEpisodes.sortOrder), asc(sunoEpisodes.id));
}

export async function createSunoEpisode(values: InsertSunoEpisode) {
  const db = await requireDb();
  const result = await db.insert(sunoEpisodes).values(values).$returningId();
  return result[0]?.id;
}

export async function deleteSunoEpisode(id: number) {
  const db = await requireDb();
  await db.delete(sunoEpisodes).where(eq(sunoEpisodes.id, id));
}

export async function getMaxSunoEpisodeSortOrder() {
  const db = await getDb();
  if (!db) return 0;
  const rows = await db
    .select({ sortOrder: sunoEpisodes.sortOrder })
    .from(sunoEpisodes)
    .orderBy(desc(sunoEpisodes.sortOrder))
    .limit(1);
  return rows[0]?.sortOrder ?? 0;
}

/* ----------------------- Executive Portal ------------------------- */

export async function listExecutiveCatalog() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(executiveCatalog).orderBy(asc(executiveCatalog.sortOrder), asc(executiveCatalog.id));
}

export async function createExecutiveCatalogItem(values: InsertExecutiveCatalogItem) {
  const db = await requireDb();
  const result = await db.insert(executiveCatalog).values(values).$returningId();
  return result[0]?.id;
}

export async function createExecutiveMeeting(values: InsertExecutiveMeeting) {
  const db = await requireDb();
  const result = await db.insert(executiveMeetings).values(values).$returningId();
  return result[0]?.id;
}

export async function listExecutiveMeetings() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(executiveMeetings).orderBy(desc(executiveMeetings.createdAt));
}

/* ----------------------- Rewards & Cadence Club ------------------------- */

export async function getUserRewards(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(userRewards).where(eq(userRewards.userId, userId)).limit(1);
  if (rows[0]) return rows[0];

  // Auto-provision initial rewards row for new user
  const newRow: InsertUserReward = {
    userId,
    points: 150,
    tracksListened: 3,
    episodesListened: 1,
    tracksShared: 0,
    draftsRated: 2,
    tier: "Listener",
  };
  try {
    await db.insert(userRewards).values(newRow);
    const created = await db.select().from(userRewards).where(eq(userRewards.userId, userId)).limit(1);
    return created[0] || null;
  } catch {
    return null;
  }
}

export async function updateUserRewards(userId: number, values: Partial<InsertUserReward>) {
  const db = await requireDb();
  await db.update(userRewards).set(values).where(eq(userRewards.userId, userId));
  return getUserRewards(userId);
}

export async function listTopLeaderboard(limit = 10) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      id: userRewards.id,
      userId: userRewards.userId,
      points: userRewards.points,
      tier: userRewards.tier,
      userName: users.name,
      userEmail: users.email,
      avatarUrl: users.avatarUrl,
    })
    .from(userRewards)
    .leftJoin(users, eq(userRewards.userId, users.id))
    .orderBy(desc(userRewards.points))
    .limit(limit);
}

export async function listPastTournaments() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(cadenceTournaments).orderBy(desc(cadenceTournaments.endedAt));
}

export async function updateUserProfile(
  userId: number,
  updates: Partial<{
    name: string | null;
    username: string | null;
    bio: string | null;
    avatarUrl: string | null;
    websiteUrl: string | null;
    socialLinksJson: string | null;
    sunoHandle: string | null;
    agreementAcceptedAt: Date | null;
    emailVerified: number;
    verificationToken: string | null;
    verificationExpiresAt: Date | null;
    resetToken: string | null;
    resetExpiresAt: Date | null;
    passwordHash: string | null;
    emailUpdatesEnabled: number;
    pushEnabled: number;
  }>,
) {
  const db = await getDb();
  if (!db || Object.keys(updates).length === 0) return;
  await db.update(users).set(updates).where(eq(users.id, userId));
}

export async function getUserByVerificationToken(token: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.verificationToken, token)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByResetToken(token: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.resetToken, token)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function verifyUserEmailByToken(token: string) {
  const db = await getDb();
  if (!db) return undefined;
  const user = await getUserByVerificationToken(token);
  if (!user || !user.verificationExpiresAt || user.verificationExpiresAt.getTime() < Date.now()) return undefined;
  await db.update(users).set({ emailVerified: 1, verificationToken: null, verificationExpiresAt: null }).where(eq(users.id, user.id));
  return user;
}

export async function updateUserAvatarAndPush(userId: number, avatarUrl?: string, pushEnabled?: number) {
  const updates: Parameters<typeof updateUserProfile>[1] = {};
  if (avatarUrl !== undefined) updates.avatarUrl = avatarUrl;
  if (pushEnabled !== undefined) updates.pushEnabled = pushEnabled;
  await updateUserProfile(userId, updates);
}

export async function listSocialPosts(limit = 30) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({ post: socialPosts, author: users })
    .from(socialPosts)
    .leftJoin(users, eq(socialPosts.authorId, users.id))
    .orderBy(desc(socialPosts.createdAt))
    .limit(limit);
}

export async function createSocialPost(input: InsertSocialPost) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(socialPosts).values(input);
  const id = Number(result[0].insertId);
  return db.select().from(socialPosts).where(eq(socialPosts.id, id)).limit(1).then((rows) => rows[0] ?? null);
}

export async function toggleSocialPostLike(postId: number, userId: number) {
  const db = await getDb();
  if (!db) return { liked: false };
  const existing = await db.select().from(socialPostLikes).where(and(eq(socialPostLikes.postId, postId), eq(socialPostLikes.userId, userId))).limit(1);
  if (existing.length > 0) {
    await db.delete(socialPostLikes).where(eq(socialPostLikes.id, existing[0].id));
    await db.update(socialPosts).set({ likesCount: Math.max(0, (await db.select({ count: socialPosts.likesCount }).from(socialPosts).where(eq(socialPosts.id, postId)).then((rows) => rows[0]?.count ?? 1)) - 1) }).where(eq(socialPosts.id, postId));
    return { liked: false };
  }
  await db.insert(socialPostLikes).values({ postId, userId });
  const current = await db.select({ count: socialPosts.likesCount }).from(socialPosts).where(eq(socialPosts.id, postId));
  await db.update(socialPosts).set({ likesCount: (current[0]?.count ?? 0) + 1 }).where(eq(socialPosts.id, postId));
  return { liked: true };
}

export async function addSocialPostComment(postId: number, authorId: number, body: string) {
  const db = await getDb();
  if (!db) return null;
  await db.insert(socialPostComments).values({ postId, authorId, body });
  const current = await db.select({ count: socialPosts.commentsCount }).from(socialPosts).where(eq(socialPosts.id, postId));
  await db.update(socialPosts).set({ commentsCount: (current[0]?.count ?? 0) + 1 }).where(eq(socialPosts.id, postId));
  return { success: true } as const;
}

export async function listDirectMessages(userId: number, otherUserId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select({ message: directMessages, sender: users }).from(directMessages).leftJoin(users, eq(directMessages.senderId, users.id)).where(or(and(eq(directMessages.senderId, userId), eq(directMessages.recipientId, otherUserId)), and(eq(directMessages.senderId, otherUserId), eq(directMessages.recipientId, userId)))).orderBy(asc(directMessages.createdAt));
}

export async function sendDirectMessage(senderId: number, recipientId: number, body: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(directMessages).values({ senderId, recipientId, body });
  const id = Number(result[0].insertId);
  return db.select().from(directMessages).where(eq(directMessages.id, id)).limit(1).then((rows) => rows[0] ?? null);
}
