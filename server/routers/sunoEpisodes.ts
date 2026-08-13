import { z } from "zod";
import {
  createSunoEpisode,
  deleteSunoEpisode,
  getMaxSunoEpisodeSortOrder,
  listSunoEpisodes,
} from "../db";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";

const episodeInput = z.object({
  title: z.string().min(1).max(200),
  host: z.string().min(1).max(200).default("Rosie Nguyen & Guests"),
  description: z.string().optional().nullable(),
  audioUrl: z.string().min(1),
  audioKey: z.string().min(1).max(512),
  durationSeconds: z.number().int().min(0).optional().nullable(),
});

export const sunoEpisodesRouter = router({
  list: publicProcedure.query(() => listSunoEpisodes()),

  create: adminProcedure.input(episodeInput).mutation(async ({ input }) => {
    const nextOrder = (await getMaxSunoEpisodeSortOrder()) + 1;
    const id = await createSunoEpisode({ ...input, sortOrder: nextOrder });
    return { id };
  }),

  remove: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      await deleteSunoEpisode(input.id);
      return { success: true } as const;
    }),
});
