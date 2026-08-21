import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { randomBytes } from "node:crypto";
import { getSessionCookieOptions } from "./_core/cookies";
import { sdk } from "./_core/sdk";
import * as db from "./db";
import { createVerificationToken, sendVerificationEmail, sendPasswordResetEmail } from "./email";
import { hashPassword, verifyPassword } from "./auth/password";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { sunoEpisodesRouter } from "./routers/sunoEpisodes";
import { executiveRouter } from "./routers/executive";
import { contactRouter } from "./routers/contact";
import { creatorsRouter } from "./routers/creators";
import { tracksRouter } from "./routers/tracks";
import { uploadsRouter } from "./routers/uploads";
import { rewardsRouter } from "./routers/rewards";
import { profileRouter } from "./routers/profile";
import { socialRouter } from "./routers/social";
import { messagesRouter } from "./routers/messages";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    register: publicProcedure
      .input(z.object({ email: z.string().email().max(320), password: z.string().min(8).max(128), name: z.string().trim().min(1).max(200) }))
      .mutation(async ({ ctx, input }) => {
        const email = input.email.trim().toLowerCase();
        const existing = await db.getUserByEmail(email);
        if (existing) throw new TRPCError({ code: "CONFLICT", message: "An account already exists for this email. Sign in or use Google/Manus OAuth." });
        const token = createVerificationToken();
        const user = await db.createLocalUser({ openId: `email_${randomBytes(16).toString("hex")}`, email, name: input.name.trim(), passwordHash: await hashPassword(input.password), verificationToken: token, verificationExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) });
        if (!user) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Account could not be created." });
        try {
          await sendVerificationEmail({ to: email, token, origin: `${ctx.req.protocol}://${ctx.req.get("host")}` });
        } catch (error) {
          console.error("[Auth] Registration email dispatch failed", error);
          throw new TRPCError({ code: "SERVICE_UNAVAILABLE", message: "Account created, but the confirmation email could not be sent. Check the email configuration or try again later." });
        }
        return { success: true, requiresVerification: true, message: "Account created. Check your email to confirm your account." } as const;
      }),
    login: publicProcedure
      .input(z.object({ email: z.string().email().max(320), password: z.string().min(1).max(128) }))
      .mutation(async ({ ctx, input }) => {
        const user = await db.getUserByEmail(input.email.trim().toLowerCase());
        if (!user || !user.passwordHash || !(await verifyPassword(input.password, user.passwordHash))) throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password." });
        if (user.emailVerified !== 1) return { success: false, requiresVerification: true, message: "Confirm your email before signing in." } as const;
        const sessionToken = await sdk.createSessionToken(user.openId, { name: user.name || "", expiresInMs: ONE_YEAR_MS });
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
        await db.upsertUser({ openId: user.openId, lastSignedIn: new Date() });
        return { success: true, requiresVerification: false, message: "Signed in successfully." } as const;
      }),
    resendVerification: publicProcedure
      .input(z.object({ email: z.string().email().max(320) }))
      .mutation(async ({ ctx, input }) => {
        const user = await db.getUserByEmail(input.email.trim().toLowerCase());
        if (user && user.emailVerified !== 1 && user.email) {
          const token = createVerificationToken();
          await db.updateUserProfile(user.id, { verificationToken: token, verificationExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) });
          try { await sendVerificationEmail({ to: user.email, token, origin: `${ctx.req.protocol}://${ctx.req.get("host")}` }); } catch (error) { console.error("[Auth] Resend verification failed", error); }
        }
        return { success: true, message: "If an unverified account exists for that email, a confirmation link has been sent." } as const;
      }),
    requestPasswordReset: publicProcedure
      .input(z.object({ email: z.string().email().max(320) }))
      .mutation(async ({ ctx, input }) => {
        const user = await db.getUserByEmail(input.email.trim().toLowerCase());
        if (user && user.email) {
          const token = createVerificationToken();
          const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
          await db.updateUserProfile(user.id, { resetToken: token, resetExpiresAt: expiresAt });
          try {
            await sendPasswordResetEmail({ to: user.email, token, origin: `${ctx.req.protocol}://${ctx.req.get("host")}` });
          } catch (error) {
            console.error("[Auth] Password reset email dispatch failed", error);
          }
        }
        return { success: true, message: "If an account exists for that email, a password reset link has been sent." } as const;
      }),
    resetPassword: publicProcedure
      .input(z.object({ token: z.string().min(1).max(128), newPassword: z.string().min(8).max(128) }))
      .mutation(async ({ ctx, input }) => {
        const user = await db.getUserByResetToken(input.token);
        if (!user || !user.resetExpiresAt || user.resetExpiresAt.getTime() < Date.now()) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "This password reset link is invalid or expired." });
        }
        const passwordHash = await hashPassword(input.newPassword);
        await db.updateUserProfile(user.id, { passwordHash, resetToken: null, resetExpiresAt: null, emailVerified: 1 });
        return { success: true, message: "Password updated successfully. You can now sign in." } as const;
      }),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  sunoEpisodes: sunoEpisodesRouter,
  executive: executiveRouter,
  rewards: rewardsRouter,
  profile: profileRouter,
  social: socialRouter,
  messages: messagesRouter,
  tracks: tracksRouter,
  creators: creatorsRouter,
  uploads: uploadsRouter,
  contact: contactRouter,
});

export type AppRouter = typeof appRouter;
