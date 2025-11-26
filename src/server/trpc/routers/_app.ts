import { inngest } from "@/inngest/client";
import { CONSTANTS } from "@/inngest/const/events-id";
import { createTRPCRouter, protectedProcedure } from "@/server/trpc/init";

export const appRouter = createTRPCRouter({
  testAI: protectedProcedure.mutation(async () => {
    await inngest.send({
      name: CONSTANTS.AI.event,
    });

    return {
      success: true,
      message: "AI Job queued",
    };
  }),
});

export type AppRouter = typeof appRouter;
