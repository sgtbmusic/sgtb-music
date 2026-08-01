import { z } from "zod";
import {
  createCreator,
  deleteCreator,
  getMaxCreatorSortOrder,
  listCreators,
  updateCreator,
} from "../db";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";

const credentialsSchema = z.array(z.string().max(160)).max(6);

export const creatorsRouter = router({
  list: publicProcedure.query(() => listCreators()),

  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(1).max(200),
        role: z.string().max(200).optional().nullable(),
        handle: z.string().max(120).optional().nullable(),
        imageUrl: z.string().optional().nullable(),
        imageKey: z.string().max(512).optional().nullable(),
        credentials: credentialsSchema.default([]),
        bio: z.string().max(4000).optional().nullable(),
        isPlaceholder: z.boolean().default(true),
      }),
    )
    .mutation(async ({ input }) => {
      const nextOrder = (await getMaxCreatorSortOrder()) + 1;
      const id = await createCreator({
        ...input,
        credentials: JSON.stringify(input.credentials),
        sortOrder: nextOrder,
      });
      return { id };
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
        name: z.string().min(1).max(200).optional(),
        role: z.string().max(200).optional().nullable(),
        handle: z.string().max(120).optional().nullable(),
        imageUrl: z.string().optional().nullable(),
        imageKey: z.string().max(512).optional().nullable(),
        credentials: credentialsSchema.optional(),
        bio: z.string().max(4000).optional().nullable(),
        isPlaceholder: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const { id, credentials, ...rest } = input;
      await updateCreator(id, {
        ...rest,
        ...(credentials ? { credentials: JSON.stringify(credentials) } : {}),
      });
      return { success: true } as const;
    }),

  remove: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input }) => {
      await deleteCreator(input.id);
      return { success: true } as const;
    }),

  reorder: adminProcedure
    .input(z.object({ orderedIds: z.array(z.number().int().positive()).min(1) }))
    .mutation(async ({ input }) => {
      await Promise.all(
        input.orderedIds.map((id, index) => updateCreator(id, { sortOrder: index })),
      );
      return { success: true } as const;
    }),
});
