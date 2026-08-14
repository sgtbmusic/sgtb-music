import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getUserRewards, updateUserRewards, listTopLeaderboard, listPastTournaments, updateUserAvatarAndPush } from "../db";

export const rewardsRouter = router({
  myRewards: protectedProcedure.query(async ({ ctx }) => {
    return getUserRewards(ctx.user.id);
  }),

  earnPoints: protectedProcedure
    .input(
      z.object({
        action: z.enum(["listen_track", "listen_episode", "share_track", "rate_draft"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const current = await getUserRewards(ctx.user.id);
      if (!current) return null;

      let pointsDelta = 10;
      let tracksListened = current.tracksListened;
      let episodesListened = current.episodesListened;
      let tracksShared = current.tracksShared;
      let draftsRated = current.draftsRated;

      if (input.action === "listen_track") {
        pointsDelta = 15;
        tracksListened += 1;
      } else if (input.action === "listen_episode") {
        pointsDelta = 25;
        episodesListened += 1;
      } else if (input.action === "share_track") {
        pointsDelta = 35;
        tracksShared += 1;
      } else if (input.action === "rate_draft") {
        pointsDelta = 20;
        draftsRated += 1;
      }

      const newPoints = current.points + pointsDelta;
      
      let newTier = "Listener";
      if (ctx.user.role === "admin" || ctx.user.role === "rep") {
        newTier = "Industry Partner";
      } else if (newPoints >= 500 || episodesListened >= 5) {
        newTier = "VIP Tastemaker";
      } else {
        newTier = "Listener";
      }

      return updateUserRewards(ctx.user.id, {
        points: newPoints,
        tracksListened,
        episodesListened,
        tracksShared,
        draftsRated,
        tier: newTier,
      });
    }),

  leaderboard: publicProcedure.query(async () => {
    return listTopLeaderboard(10);
  }),

  pastTournaments: publicProcedure.query(async () => {
    return listPastTournaments();
  }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        avatarUrl: z.string().optional(),
        pushEnabled: z.number().int().min(0).max(1).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await updateUserAvatarAndPush(ctx.user.id, input.avatarUrl, input.pushEnabled);
      return { success: true };
    }),
});
