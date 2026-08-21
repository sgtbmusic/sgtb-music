import { randomBytes } from "node:crypto";
import { ENV } from "./_core/env";

export function createVerificationToken() {
  return randomBytes(32).toString("hex");
}

export async function sendVerificationEmail(params: { to: string; token: string; origin: string }) {
  if (!ENV.resendApiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const verificationUrl = `${params.origin}/verify-email?token=${encodeURIComponent(params.token)}`;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ENV.resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: ENV.resendFromEmail,
      to: [params.to],
      subject: "Confirm your SGTB Music account",
      html: `<div style="background:#0b0b0e;color:#f8f5ec;padding:32px;font-family:Arial,sans-serif"><p style="color:#d4af37;letter-spacing:.2em;text-transform:uppercase;font-size:11px">SGTB Music / Account Security</p><h1 style="font-size:28px">Confirm your account</h1><p>Click the secure button below to confirm your email address and activate your SGTB Music account.</p><p><a href="${verificationUrl}" style="display:inline-block;background:#d4af37;color:#0b0b0e;padding:14px 20px;text-decoration:none;font-weight:700;border-radius:8px">Confirm email address</a></p><p style="color:#aaa;font-size:12px">This confirmation link expires in 24 hours. If you did not create this account, you can ignore this message.</p></div>`,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Resend rejected verification email (${response.status}): ${detail}`);
  }

  return (await response.json()) as { id?: string };
}

export async function sendPasswordResetEmail(params: { to: string; token: string; origin: string }) {
  if (!ENV.resendApiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const resetUrl = `${params.origin}/reset-password?token=${encodeURIComponent(params.token)}`;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ENV.resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: ENV.resendFromEmail,
      to: [params.to],
      subject: "Reset your SGTB Music password",
      html: `<div style="background:#0b0b0e;color:#f8f5ec;padding:32px;font-family:Arial,sans-serif"><p style="color:#d4af37;letter-spacing:.2em;text-transform:uppercase;font-size:11px">SGTB Music / Account Security</p><h1 style="font-size:28px">Reset your password</h1><p>We received a request to reset your SGTB Music password. Click the secure button below to choose a new password.</p><p><a href="${resetUrl}" style="display:inline-block;background:#d4af37;color:#0b0b0e;padding:14px 20px;text-decoration:none;font-weight:700;border-radius:8px">Reset password</a></p><p style="color:#aaa;font-size:12px">This password reset link expires in 1 hour. If you did not request a password reset, you can safely ignore this message.</p></div>`,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Resend rejected password reset email (${response.status}): ${detail}`);
  }

  return (await response.json()) as { id?: string };
}
