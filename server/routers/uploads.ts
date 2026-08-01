import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { storagePut } from "../storage";
import { adminProcedure, router } from "../_core/trpc";

/** 60MB ceiling keeps WAV uploads workable while protecting the request budget. */
const MAX_BYTES = 60 * 1024 * 1024;

const AUDIO_TYPES = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/wave",
  "audio/x-wav",
  "audio/vnd.wave",
];

const IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/avif"];

function sanitizeName(name: string) {
  const cleaned = name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return cleaned.length > 0 ? cleaned.slice(-80) : "upload";
}

function decodeBase64(dataBase64: string) {
  const stripped = dataBase64.includes(",") ? dataBase64.split(",").pop()! : dataBase64;
  const buffer = Buffer.from(stripped, "base64");
  if (buffer.byteLength === 0) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Uploaded file is empty." });
  }
  if (buffer.byteLength > MAX_BYTES) {
    throw new TRPCError({
      code: "PAYLOAD_TOO_LARGE",
      message: "File exceeds the 60MB upload limit.",
    });
  }
  return buffer;
}

export const uploadsRouter = router({
  /** Uploads an MP3/WAV master and returns its storage key + served URL. */
  audio: adminProcedure
    .input(
      z.object({
        fileName: z.string().min(1).max(200),
        contentType: z.string().min(1).max(128),
        dataBase64: z.string().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      if (!AUDIO_TYPES.includes(input.contentType.toLowerCase())) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Only MP3 and WAV audio files are supported.",
        });
      }
      const buffer = decodeBase64(input.dataBase64);
      return storagePut(
        `sgtb/audio/${sanitizeName(input.fileName)}`,
        buffer,
        input.contentType,
      );
    }),

  /** Uploads cover art or a creator portrait. */
  image: adminProcedure
    .input(
      z.object({
        fileName: z.string().min(1).max(200),
        contentType: z.string().min(1).max(128),
        dataBase64: z.string().min(1),
        folder: z.enum(["covers", "creators"]).default("covers"),
      }),
    )
    .mutation(async ({ input }) => {
      if (!IMAGE_TYPES.includes(input.contentType.toLowerCase())) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Only PNG, JPEG, WEBP, or AVIF images are supported.",
        });
      }
      const buffer = decodeBase64(input.dataBase64);
      return storagePut(
        `sgtb/${input.folder}/${sanitizeName(input.fileName)}`,
        buffer,
        input.contentType,
      );
    }),
});
