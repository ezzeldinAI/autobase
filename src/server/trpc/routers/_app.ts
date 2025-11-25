import { db } from "@/lib/db";
import { usersTable } from "@/server/db/schema";
import { baseProcedure, createTRPCRouter } from "../init";
export const appRouter = createTRPCRouter({
  users: {
    getAll: baseProcedure.query(async () => await db.select().from(usersTable)),
  },
});

export type AppRouter = typeof appRouter;
