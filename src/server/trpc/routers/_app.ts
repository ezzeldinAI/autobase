import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { usersTable } from "@/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../init";

export const appRouter = createTRPCRouter({
  users: {
    getAll: protectedProcedure.query(
      async ({ ctx }) =>
        await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.id, ctx.auth.user.id))
    ),
  },
});

export type AppRouter = typeof appRouter;
