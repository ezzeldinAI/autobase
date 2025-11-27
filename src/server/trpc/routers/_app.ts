import { workflowsRouter } from "@/feature/workflows/server/routers";
import { createTRPCRouter } from "@/server/trpc/init";

export const appRouter = createTRPCRouter({
  workflows: workflowsRouter,
});

export type AppRouter = typeof appRouter;
