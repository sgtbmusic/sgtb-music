import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { sunoEpisodesRouter } from "./routers/sunoEpisodes";
import { executiveRouter } from "./routers/executive";
import { contactRouter } from "./routers/contact";
import { creatorsRouter } from "./routers/creators";
import { tracksRouter } from "./routers/tracks";
import { uploadsRouter } from "./routers/uploads";
import { rewardsRouter } from "./routers/rewards";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
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
  tracks: tracksRouter,
  creators: creatorsRouter,
  uploads: uploadsRouter,
  contact: contactRouter,
});

export type AppRouter = typeof appRouter;
