import { z } from "zod";
import { createContactMessage, listContactMessages } from "../db";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";

export const contactRouter = router({
  submit: publicProcedure
    .input(
      z.object({
        name: z.string().min(1).max(200),
        email: z.string().email().max(320),
        projectType: z.string().max(120).optional().nullable(),
        message: z.string().min(10).max(4000),
      }),
    )
    .mutation(async ({ input }) => {
      const id = await createContactMessage(input);
      return { id, success: true } as const;
    }),

  list: adminProcedure.query(() => listContactMessages()),
});
