import { inngest } from "@/inngest/client";
import { CONSTANTS } from "@/inngest/const/events-id";
import { createTRPCRouter, premiumProcedure } from "@/server/trpc/init";

export const appRouter = createTRPCRouter({
  testAI: premiumProcedure.mutation(async () => {
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
