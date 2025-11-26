import { inngest } from "@/inngest/client";
import { CONSTANTS } from "@/inngest/const/events-id";
import { db } from "@/lib/db";
import { workflowsTable } from "@/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/server/trpc/init";

export const appRouter = createTRPCRouter({
  users: {
    getAllWorkflows: protectedProcedure.query(
      async () => await db.select().from(workflowsTable)
    ),
    createWorkflow: protectedProcedure.mutation(async ({ ctx }) => {
      await inngest.send({
        name: CONSTANTS.BASE.event,
        data: {
          userID: ctx.auth.user.id,
        },
      });

      return {
        success: true,
        message: "Job queued",
      };
    }),
  },
});

export type AppRouter = typeof appRouter;
