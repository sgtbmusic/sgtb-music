import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb, listDirectMessages, sendDirectMessage } from "../db";
import { users } from "../../drizzle/schema";
import { asc, eq, ne } from "drizzle-orm";

export const messagesRouter = router({
  directory: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return [];
    return db
      .select({ id: users.id, name: users.name, username: users.username, avatarUrl: users.avatarUrl, role: users.role })
      .from(users)
      .where(ne(users.id, ctx.user.id))
      .orderBy(asc(users.name))
      .limit(50);
  }),

  thread: protectedProcedure
    .input(z.object({ otherUserId: z.number().int().positive() }))
    .query(({ ctx, input }) => listDirectMessages(ctx.user.id, input.otherUserId)),

  send: protectedProcedure
    .input(
      z.object({
        recipientId: z.number().int().positive(),
        body: z.string().trim().min(1).max(4000),
      }),
    )
    .mutation(({ ctx, input }) => sendDirectMessage(ctx.user.id, input.recipientId, input.body)),
});
