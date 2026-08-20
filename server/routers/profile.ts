import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { updateUserProfile } from "../db";

const optionalNullableText = (max: number) =>
  z.string().max(max).nullable().optional();

export const profileRouter = router({
  me: protectedProcedure.query(({ ctx }) => ctx.user),

  update: protectedProcedure
    .input(
      z.object({
        name: optionalNullableText(200),
        username: optionalNullableText(80),
        bio: optionalNullableText(800),
        avatarUrl: optionalNullableText(2000),
        websiteUrl: optionalNullableText(512),
        socialLinksJson: optionalNullableText(4000),
        emailUpdatesEnabled: z.number().int().min(0).max(1).optional(),
        pushEnabled: z.number().int().min(0).max(1).optional(),
        sunoHandle: optionalNullableText(128),
        acceptAgreement: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const username = input.username?.trim() || null;
      const websiteUrl = input.websiteUrl?.trim() || null;
      const sunoHandle = input.sunoHandle?.trim() || null;
      const agreementAcceptedAt = input.acceptAgreement && !ctx.user.agreementAcceptedAt ? new Date() : undefined;
      const updates = {
        name: input.name === undefined ? undefined : input.name?.trim() || null,
        username,
        bio: input.bio === undefined ? undefined : input.bio?.trim() || null,
        avatarUrl: input.avatarUrl === undefined ? undefined : input.avatarUrl || null,
        websiteUrl,
        socialLinksJson: input.socialLinksJson,
        emailUpdatesEnabled: input.emailUpdatesEnabled,
        pushEnabled: input.pushEnabled,
        sunoHandle,
        ...(agreementAcceptedAt ? { agreementAcceptedAt } : {}),
      };

      await updateUserProfile(ctx.user.id, updates);
      return { success: true } as const;
    }),
});

export type ProfileRouter = typeof profileRouter;

export function parseSocialLinks(value: string | null | undefined) {
  if (!value) return [] as Array<{ label: string; url: string }>;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter(
          (item): item is { label: string; url: string } =>
            Boolean(item && typeof item.label === "string" && typeof item.url === "string"),
        )
      : [];
  } catch {
    return [] as Array<{ label: string; url: string }>;
  }
}
