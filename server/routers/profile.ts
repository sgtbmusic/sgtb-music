import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getUserByVerificationToken, updateUserProfile, verifyUserEmailByToken } from "../db";
import { TRPCError } from "@trpc/server";
import { sendVerificationEmail, createVerificationToken } from "../email";
import { getSessionCookieOptions } from "../_core/cookies";
import { sdk } from "../_core/sdk";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

const optionalNullableText = (max: number) =>
  z.string().max(max).nullable().optional();

export const profileRouter = router({
  me: protectedProcedure.query(({ ctx }) => ctx.user),

  sendVerificationEmail: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.user.email) throw new TRPCError({ code: "BAD_REQUEST", message: "No email address is available for this account." });
    const token = createVerificationToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await updateUserProfile(ctx.user.id, { verificationToken: token, verificationExpiresAt: expiresAt });
    const origin = `${ctx.req.protocol}://${ctx.req.get("host")}`;
    await sendVerificationEmail({ to: ctx.user.email, token, origin });
    return { success: true, message: "Verification email sent. Please check your inbox." };
  }),

  verifyEmail: publicProcedure
    .input(z.object({ token: z.string().min(1).max(128) }))
    .mutation(async ({ ctx, input }) => {
      const user = await getUserByVerificationToken(input.token);
      if (!user || !user.verificationExpiresAt || user.verificationExpiresAt.getTime() < Date.now()) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "This verification link is invalid or expired." });
      }
      const verifiedUser = await verifyUserEmailByToken(input.token);
      if (!verifiedUser) throw new TRPCError({ code: "BAD_REQUEST", message: "This verification link is invalid or expired." });
      const sessionToken = await sdk.createSessionToken(verifiedUser.openId, { name: verifiedUser.name || "", expiresInMs: ONE_YEAR_MS });
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      return { success: true } as const;
    }),

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
