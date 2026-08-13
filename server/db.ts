import { asc, desc, eq } from "drizzle-orm";
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
  sunoEpisodes,
  InsertSunoEpisode,
  executiveCatalog,
  InsertExecutiveCatalogItem,
  executiveMeetings,
  InsertExecutiveMeeting,
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
