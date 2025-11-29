import { TRPCError } from "@trpc/server";
import { and, count, desc, eq, ilike } from "drizzle-orm";
import { generateSlug } from "random-word-slugs";
import { z } from "zod";
import { PAGINATION } from "@/constants/pagination";
import { db } from "@/lib/db";
import { workflowsTable } from "@/server/db/schema";
import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "@/server/trpc/init";

export const workflowsRouter = createTRPCRouter({
  create: premiumProcedure.mutation(async ({ ctx }) => {
    const res = await db
      .insert(workflowsTable)
      .values({
        name: generateSlug(3),
        userId: ctx.auth.user.id,
      })
      .returning();

    if (!res) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create workflow",
      });
    }

    return {
      success: true,
      data: {
        id: res[0].id,
        name: res[0].name,
      },
    };
  }),
  read: {
    one: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ ctx, input }) => {
        const res = await db
          .select()
          .from(workflowsTable)
          .where(
            and(
              eq(workflowsTable.userId, ctx.auth.user.id),
              eq(workflowsTable.id, input.id)
            )
          );

        if (!res) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Workflow not found",
          });
        }

        return {
          success: true,
          data: {
            id: res[0].id,
            name: res[0].name,
          },
        };
      }),
    all: protectedProcedure
      .input(
        z.object({
          page: z.number().default(PAGINATION.DEFAULT_PAGE),
          pageSize: z
            .number()
            .min(PAGINATION.MIN_PAGE_SIZE)
            .max(PAGINATION.MAX_PAGE_SIZE)
            .default(PAGINATION.DEFAULT_PAGE_SIZE),
          search: z.string().default(""),
        })
      )
      .query(async ({ ctx, input }) => {
        const { page, pageSize, search } = input;

        const whereConditions = and(
          eq(workflowsTable.userId, ctx.auth.user.id),
          search ? ilike(workflowsTable.name, `%${search}%`) : undefined
        );

        const [items, [{ value: totalCount }]] = await Promise.all([
          db
            .select()
            .from(workflowsTable)
            .where(whereConditions)
            .orderBy(desc(workflowsTable.updatedAt))
            .limit(pageSize)
            .offset((page - 1) * pageSize),
          db
            .select({ value: count() })
            .from(workflowsTable)
            .where(whereConditions),
        ]);

        const totalPages = Math.ceil(totalCount / pageSize);

        return {
          items,
          totalCount,
          page,
          pageSize,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        };
      }),
  },
  update: {
    name: protectedProcedure
      .input(z.object({ id: z.string(), name: z.string().min(3).max(25) }))
      .mutation(async ({ ctx, input }) => {
        const res = await db
          .update(workflowsTable)
          .set({ name: input.name })
          .where(
            and(
              eq(workflowsTable.userId, ctx.auth.user.id),
              eq(workflowsTable.id, input.id)
            )
          )
          .returning();

        if (!res) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Workflow not found",
          });
        }

        return {
          success: true,
          data: {
            id: res[0].id,
            name: res[0].name,
          },
        };
      }),
  },
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const res = await db
        .delete(workflowsTable)
        .where(
          and(
            eq(workflowsTable.userId, ctx.auth.user.id),
            eq(workflowsTable.id, input.id)
          )
        )
        .returning();

      if (!res) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete workflow",
        });
      }

      return {
        success: true,
        data: {
          id: res[0].id,
          name: res[0].name,
        },
      };
    }),
});
