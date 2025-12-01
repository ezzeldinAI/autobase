/** biome-ignore-all lint/style/noNonNullAssertion: false positive */
import { TRPCError } from "@trpc/server";
import type { Edge, Node } from "@xyflow/react";
import { and, count, desc, eq, ilike } from "drizzle-orm";
import { generateSlug } from "random-word-slugs";
import { z } from "zod";
import { PAGINATION } from "@/constants/pagination";
import { db } from "@/lib/db";
import NodeType, {
  connectionsTable,
  nodesTable,
  workflowsTable,
} from "@/server/db/schema";
import type { Workflow } from "@/server/db/types";
import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "@/server/trpc/init";

export const workflowsRouter = createTRPCRouter({
  create: premiumProcedure
    .input(
      z.object({
        withInitialNode: z.boolean().default(true),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Simple case: just create workflow
      if (!input.withInitialNode) {
        const [simpleWorkflow] = await db
          .insert(workflowsTable)
          .values({
            name: generateSlug(3),
            userId: ctx.auth.user.id,
          })
          .returning();

        if (!simpleWorkflow) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
          });
        }

        return { workflow: simpleWorkflow };
      }

      // Complex case: workflow + initial node (sequential inserts - no transaction support in neon-http)
      // Insert workflow first
      const [workflow] = await db
        .insert(workflowsTable)
        .values({
          name: generateSlug(3),
          userId: ctx.auth.user.id,
        })
        .returning();

      // Insert initial node with workflow ID
      const [initialNode] = await db
        .insert(nodesTable)
        .values([
          {
            workflowId: workflow.id,
            name: NodeType.INITIAL,
            type: NodeType.INITIAL,
            position: { x: 0, y: 0 },
            data: {},
          },
          // {
          //   workflowId: workflow.id,
          //   name: NodeType.INITIAL,
          //   type: NodeType.INITIAL,
          //   position: { x: 0, y: 200 },
          //   data: {},
          // },
        ])
        .returning();

      if (!(workflow || initialNode)) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      return {
        workflow,
        initialNode,
      };
    }),
  read: {
    one: protectedProcedure
      .input(
        z.object({
          id: z.string(),
          includeNodes: z.boolean().default(true),
          includeEdges: z.boolean().default(true),
        })
      )
      .query(async ({ ctx, input }) => {
        if (!(input.includeNodes && input.includeEdges)) {
          // Simple query without nodes
          const result = await db
            .select({
              id: workflowsTable.id,
              name: workflowsTable.name,
              createdAt: workflowsTable.createdAt,
              updatedAt: workflowsTable.updatedAt,
              userId: workflowsTable.userId,
              nodes: nodesTable,
              edges: connectionsTable,
            })
            .from(workflowsTable)
            .leftJoin(
              nodesTable,
              and(eq(nodesTable.workflowId, workflowsTable.id))
            )
            .leftJoin(
              connectionsTable,
              and(eq(connectionsTable.workflowId, workflowsTable.id))
            )
            .where(
              and(
                eq(workflowsTable.id, input.id),
                eq(workflowsTable.userId, ctx.auth.user.id)
              )
            )
            .limit(1);

          const workflow = result[0];

          if (!workflow) {
            throw new TRPCError({
              code: "NOT_FOUND",
            });
          }

          return workflow;
        }

        // Query with nodes (LEFT JOIN)
        const result = await db
          .select({
            // Workflow fields
            id: workflowsTable.id,
            name: workflowsTable.name,
            createdAt: workflowsTable.createdAt,
            updatedAt: workflowsTable.updatedAt,
            userId: workflowsTable.userId,
            // Node fields (nullable because of LEFT JOIN)
            nodeId: nodesTable.id,
            nodeName: nodesTable.name,
            nodeType: nodesTable.type,
            nodePosition: nodesTable.position,
            nodeData: nodesTable.data,
            nodeCreatedAt: nodesTable.createdAt,
            // Edge fields (nullable because of LEFT JOIN)
            edgeId: connectionsTable.id,
            fromNodeId: connectionsTable.fromNodeId,
            toNodeId: connectionsTable.toNodeId,
            sourceHandle: connectionsTable.fromOutput,
            targetHandle: connectionsTable.toOutput,
          })
          .from(workflowsTable)
          .leftJoin(
            nodesTable,
            and(eq(nodesTable.workflowId, workflowsTable.id))
          )
          .leftJoin(
            connectionsTable,
            and(eq(connectionsTable.workflowId, workflowsTable.id))
          )
          .where(
            and(
              eq(workflowsTable.id, input.id),
              eq(workflowsTable.userId, ctx.auth.user.id)
            )
          );

        if (result.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
          });
        }

        // Transforming data
        const nodes: Node[] = result
          .filter((row) => row.nodeId !== null)
          .map((row) => ({
            id: row.nodeId!,
            workflowId: result[0].id, // All nodes belong to this workflow
            name: row.nodeName!,
            type: row.nodeType!,
            position: row.nodePosition! as { x: number; y: number },
            data: (row.nodeData! as Record<string, unknown>) || {},
            createdAt: row.nodeCreatedAt!,
            updatedAt: row.nodeCreatedAt!,
          }));

        const edges: Edge[] = result
          .filter((row) => row.edgeId !== null)
          .map((row) => ({
            id: row.edgeId!,
            source: row.fromNodeId!,
            target: row.toNodeId!,
            sourceHandle: row.sourceHandle!,
            targetHandle: row.targetHandle!,
          }));

        const workflow: Workflow & { nodes: Node[]; edges: Edge[] } = {
          id: result[0].id,
          name: result[0].name,
          createdAt: result[0].createdAt,
          updatedAt: result[0].updatedAt,
          userId: result[0].userId,
          edges,
          nodes,
        };

        return workflow;
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
        const [updatedWorkflow] = await db
          .update(workflowsTable)
          .set({ name: input.name })
          .where(
            and(
              eq(workflowsTable.userId, ctx.auth.user.id),
              eq(workflowsTable.id, input.id)
            )
          )
          .returning();

        if (!updatedWorkflow) {
          throw new TRPCError({
            code: "NOT_FOUND",
          });
        }

        return { updatedWorkflow };
      }),
    state: protectedProcedure
      .input(
        z.object({
          id: z.string(),
          nodes: z.array(
            z.object({
              id: z.string(),
              type: z.string(),
              position: z.object({ x: z.number(), y: z.number() }),
              data: z.record(z.unknown()),
            })
          ),
          edges: z.array(
            z.object({
              id: z.string(),
              source: z.string(),
              target: z.string(),
              sourceHandle: z.string().optional(),
              targetHandle: z.string().optional(),
            })
          ),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { id, nodes, edges } = input;

        // Verify workflow ownership
        const [workflow] = await db
          .select()
          .from(workflowsTable)
          .where(
            and(
              eq(workflowsTable.id, id),
              eq(workflowsTable.userId, ctx.auth.user.id)
            )
          )
          .limit(1);

        if (!workflow) {
          throw new TRPCError({
            code: "NOT_FOUND",
          });
        }

        // Delete existing connections
        await db
          .delete(connectionsTable)
          .where(eq(connectionsTable.workflowId, id));

        // Delete existing nodes
        await db.delete(nodesTable).where(eq(nodesTable.workflowId, id));

        // Insert new nodes
        if (nodes.length > 0) {
          await db.insert(nodesTable).values(
            nodes.map((node) => ({
              id: node.id,
              workflowId: id,
              name: (node.data.label as string) || node.id,
              type: node.type as NodeType, // Cast to NodeType enum
              position: node.position,
              data: node.data,
            }))
          );
        }

        // Insert new connections
        if (edges.length > 0) {
          await db.insert(connectionsTable).values(
            edges.map((edge) => ({
              id: edge.id,
              workflowId: id,
              fromNodeId: edge.source,
              toNodeId: edge.target,
              fromOutput: edge.sourceHandle,
              toOutput: edge.targetHandle,
            }))
          );
        }

        return { success: true };
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
        });
      }

      return {
        workflow: res,
      };
    }),
});
