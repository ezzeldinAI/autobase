import type { InferSelectModel } from "drizzle-orm";
import type {
  accountsTable,
  connectionsTable,
  nodesTable,
  sessionsTable,
  usersTable,
  verificationsTable,
  workflowsTable,
} from "@/server/db/schema";

export type Workflow = InferSelectModel<typeof workflowsTable>;
export type User = InferSelectModel<typeof usersTable>;
export type Session = InferSelectModel<typeof sessionsTable>;
export type Account = InferSelectModel<typeof accountsTable>;
export type Verification = InferSelectModel<typeof verificationsTable>;
export type Node = InferSelectModel<typeof nodesTable>;
export type Connect = InferSelectModel<typeof connectionsTable>;
