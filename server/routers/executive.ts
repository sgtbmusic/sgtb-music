import { z } from "zod";
import {
  createExecutiveCatalogItem,
  createExecutiveMeeting,
  listExecutiveCatalog,
  listExecutiveMeetings,
} from "../db";
import { adminProcedure, publicProcedure, repOrAdminProcedure, router } from "../_core/trpc";

const catalogInput = z.object({
  title: z.string().min(1).max(200),
  artist: z.string().min(1).max(200),
  category: z.enum(["Suno Voice Persona", "Hybrid Stems (Pro Tools Mix)", "Live Sync Concepts"]),
  audioUrl: z.string().min(1),
  stemPackageUrl: z.string().optional().nullable(),
  bpm: z.number().int().min(60).max(200).default(120),
  genre: z.string().min(1).max(100).default("Pop / Cinematic"),
  hitPotential: z.number().int().min(50).max(100).default(95),
  description: z.string().optional().nullable(),
});

const meetingInput = z.object({
  executiveName: z.string().min(1).max(200),
  organization: z.string().min(1).max(200),
  email: z.string().email(),
  requestedDate: z.string().min(1).max(100),
  notes: z.string().optional().nullable(),
});

export const executiveRouter = router({
  listCatalog: publicProcedure.query(() => listExecutiveCatalog()),

  createCatalogItem: adminProcedure.input(catalogInput).mutation(async ({ input }) => {
    const id = await createExecutiveCatalogItem({ ...input, sortOrder: 0 });
    return { id };
  }),

  requestMeeting: publicProcedure.input(meetingInput).mutation(async ({ input }) => {
    const id = await createExecutiveMeeting(input);
    return { id, success: true } as const;
  }),

  listMeetings: repOrAdminProcedure.query(() => listExecutiveMeetings()),
});
