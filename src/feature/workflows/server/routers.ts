import { and, desc, eq } from "drizzle-orm";
import { generateSlug } from "random-word-slugs";
import { z } from "zod";
import { db } from "@/lib/db";
import { workflowsTable } from "@/server/db/schema";
import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "@/server/trpc/init";

export const workflowsRouter = createTRPCRouter({
  create: premiumProcedure.mutation(async ({ ctx }) => {
    const row = await db
      .insert(workflowsTable)
      .values({
        name: generateSlug(3),
        userId: ctx.auth.user.id,
      })
      .returning();

    return {
      success: true,
      data: {
        id: row[0].id,
        name: row[0].name,
      },
    };
  }),
  read: {
    one: protectedProcedure.input(z.object({ id: z.string() })).query(
      async ({ ctx, input }) =>
        await db
          .select()
          .from(workflowsTable)
          .where(
            and(
              eq(workflowsTable.userId, ctx.auth.user.id),
              eq(workflowsTable.id, input.id)
            )
          )
    ),
    all: protectedProcedure.query(
      async ({ ctx }) =>
        await db
          .select()
          .from(workflowsTable)
          .where(eq(workflowsTable.userId, ctx.auth.user.id))
          .orderBy(desc(workflowsTable.createdAt))
    ),
  },
  update: {
    name: protectedProcedure
      .input(z.object({ id: z.string(), name: z.string().min(3).max(25) }))
      .mutation(
        async ({ ctx, input }) =>
          await db
            .update(workflowsTable)
            .set({ name: input.name })
            .where(
              and(
                eq(workflowsTable.userId, ctx.auth.user.id),
                eq(workflowsTable.id, input.id)
              )
            )
      ),
  },
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(
      async ({ ctx, input }) =>
        await db
          .delete(workflowsTable)
          .where(
            and(
              eq(workflowsTable.userId, ctx.auth.user.id),
              eq(workflowsTable.id, input.id)
            )
          )
    ),
});
