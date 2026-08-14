import { z } from "zod";
import { createContactMessage, listContactMessages } from "../db";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import { notifyOwner } from "../_core/notification";

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
      try {
        await notifyOwner({
          title: `[SGTB Contact Inquiry] From ${input.name} (${input.email})`,
          content: `Project Type: ${input.projectType || "General Inquiry"}\n\nMessage:\n${input.message}\n\n---\nNotification destination: sgtbmusic.business@gmail.com\nLogged in platform admin portal to review.`,
        });
      } catch (err) {
        console.warn("[Contact] Failed to dispatch owner notification:", err);
      }
      return { id, success: true } as const;
    }),

  list: adminProcedure.query(() => listContactMessages()),
});
