import { z } from "zod";
import {
  createTrack,
  deleteTrack,
  getMaxTrackSortOrder,
  listTracks,
  updateTrack,
} from "../db";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";

const trackInput = z.object({
  title: z.string().min(1).max(200),
  artist: z.string().min(1).max(200).default("SGTB Music"),
  genre: z.string().max(120).optional().nullable(),
  bpm: z.number().int().min(20).max(400).optional().nullable(),
  audioUrl: z.string().min(1),
  audioKey: z.string().min(1).max(512),
  mimeType: z.string().max(128).optional().nullable(),
  coverUrl: z.string().optional().nullable(),
  coverKey: z.string().max(512).optional().nullable(),
  coverVariant: z.number().int().min(0).max(11).default(0),
  durationSeconds: z.number().int().min(0).optional().nullable(),
});

export const tracksRouter = router({
  list: publicProcedure.query(() => listTracks()),

  create: adminProcedure.input(trackInput).mutation(async ({ input }) => {
    const nextOrder = (await getMaxTrackSortOrder()) + 1;
    const id = await createTrack({ ...input, sortOrder: nextOrder });
    return { id };
  }),

  update: adminProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
        title: z.string().min(1).max(200).optional(),
        artist: z.string().min(1).max(200).optional(),
        genre: z.string().max(120).optional().nullable(),
        bpm: z.number().int().min(20).max(400).optional().nullable(),
        coverUrl: z.string().optional().nullable(),
        coverKey: z.string().max(512).optional().nullable(),
        coverVariant: z.number().int().min(0).max(11).optional(),
        durationSeconds: z.number().int().min(0).optional().nullable(),
      }),
    )
    .mutation(async ({ input }) => {
      const { id, ...rest } = input;
      await updateTrack(id, rest);
      return { success: true } as const;
    }),

  remove: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      await deleteTrack(input.id);
      return { success: true } as const;
    }),

  reorder: adminProcedure
    .input(z.object({ orderedIds: z.array(z.number().int().positive()).min(1) }))
    .mutation(async ({ input }) => {
      await Promise.all(
        input.orderedIds.map((id, index) => updateTrack(id, { sortOrder: index + 1 })),
      );
      return { success: true } as const;
    }),
});
