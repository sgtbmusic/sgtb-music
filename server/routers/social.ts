import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import {
  addSocialPostComment,
  createSocialPost,
  listSocialPosts,
  toggleSocialPostLike,
} from "../db";

export const socialRouter = router({
  feed: publicProcedure.query(() => listSocialPosts(40)),

  createPost: protectedProcedure
    .input(
      z.object({
        body: z.string().trim().min(1).max(4000),
        mediaUrl: z.string().url().or(z.string().startsWith("/manus-storage/")).nullable().optional(),
        mediaType: z.enum(["image", "audio"]).nullable().optional(),
        mediaTitle: z.string().max(200).nullable().optional(),
      }),
    )
    .mutation(({ ctx, input }) =>
      createSocialPost({
        authorId: ctx.user.id,
        body: input.body,
        mediaUrl: input.mediaUrl ?? null,
        mediaType: input.mediaType ?? null,
        mediaTitle: input.mediaTitle ?? null,
      }),
    ),

  toggleLike: protectedProcedure
    .input(z.object({ postId: z.number().int().positive() }))
    .mutation(({ ctx, input }) => toggleSocialPostLike(input.postId, ctx.user.id)),

  comment: protectedProcedure
    .input(
      z.object({
        postId: z.number().int().positive(),
        body: z.string().trim().min(1).max(1000),
      }),
    )
    .mutation(({ ctx, input }) => addSocialPostComment(input.postId, ctx.user.id, input.body)),
});
