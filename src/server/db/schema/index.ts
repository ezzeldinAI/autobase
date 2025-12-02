import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/*
 
   _   _                     _____     _     _      
  | | | |___  ___ _ __ ___  |_   _|_ _| |__ | | ___ 
  | | | / __|/ _ \ '__/ __|   | |/ _` | '_ \| |/ _ \
  | |_| \__ \  __/ |  \__ \   | | (_| | |_) | |  __/
   \___/|___/\___|_|  |___/   |_|\__,_|_.__/|_|\___|
                                                    
 
*/

export const usersTable = pgTable("usersTable", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const userRelations = relations(usersTable, ({ many }) => ({
  sessions: many(sessionsTable),
  accounts: many(accountsTable),
  workflows: many(workflowsTable),
}));

/*
 
   ____                _               _____     _     _      
  / ___|  ___  ___ ___(_) ___  _ __   |_   _|_ _| |__ | | ___ 
  \___ \ / _ \/ __/ __| |/ _ \| '_ \    | |/ _` | '_ \| |/ _ \
   ___) |  __/\__ \__ \ | (_) | | | |   | | (_| | |_) | |  __/
  |____/ \___||___/___/_|\___/|_| |_|   |_|\__,_|_.__/|_|\___|
                                                              
 
*/

export const sessionsTable = pgTable(
  "sessionsTable",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)]
);

export const sessionRelations = relations(sessionsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [sessionsTable.userId],
    references: [usersTable.id],
  }),
}));

/*
 
      _                             _     _____     _     _      
     / \   ___ ___ ___  _   _ _ __ | |_  |_   _|_ _| |__ | | ___ 
    / _ \ / __/ __/ _ \| | | | '_ \| __|   | |/ _` | '_ \| |/ _ \
   / ___ \ (_| (_| (_) | |_| | | | | |_    | | (_| | |_) | |  __/
  /_/   \_\___\___\___/ \__,_|_| |_|\__|   |_|\__,_|_.__/|_|\___|
                                                                 
 
*/

export const accountsTable = pgTable(
  "accountsTable",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)]
);

export const accountRelations = relations(accountsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [accountsTable.userId],
    references: [usersTable.id],
  }),
}));

/*
 
  __     __        _  __ _           _   _               _____     _     _      
  \ \   / /__ _ __(_)/ _(_) ___ __ _| |_(_) ___  _ __   |_   _|_ _| |__ | | ___ 
   \ \ / / _ \ '__| | |_| |/ __/ _` | __| |/ _ \| '_ \    | |/ _` | '_ \| |/ _ \
    \ V /  __/ |  | |  _| | (_| (_| | |_| | (_) | | | |   | | (_| | |_) | |  __/
     \_/ \___|_|  |_|_| |_|\___\__,_|\__|_|\___/|_| |_|   |_|\__,_|_.__/|_|\___|
                                                                                
 
*/

export const verificationsTable = pgTable(
  "verificationsTable",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)]
);

/*
 
  __        __         _     __ _                 _____     _     _      
  \ \      / /__  _ __| | __/ _| | _____      __ |_   _|_ _| |__ | | ___ 
   \ \ /\ / / _ \| '__| |/ / |_| |/ _ \ \ /\ / /   | |/ _` | '_ \| |/ _ \
    \ V  V / (_) | |  |   <|  _| | (_) \ V  V /    | | (_| | |_) | |  __/
     \_/\_/ \___/|_|  |_|\_\_| |_|\___/ \_/\_/     |_|\__,_|_.__/|_|\___|
                                                                         
 
*/

export const workflowsTable = pgTable("workflowsTable", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),

  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
});

export const workflowRelations = relations(workflowsTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [workflowsTable.userId],
    references: [usersTable.id],
  }),
  nodes: many(nodesTable),
  connects: many(connectionsTable),
}));

/*
 
   _   _           _        _____     _     _      
  | \ | | ___   __| | ___  |_   _|_ _| |__ | | ___ 
  |  \| |/ _ \ / _` |/ _ \   | |/ _` | '_ \| |/ _ \
  | |\  | (_) | (_| |  __/   | | (_| | |_) | |  __/
  |_| \_|\___/ \__,_|\___|   |_|\__,_|_.__/|_|\___|
                                                   
 
*/

export enum NodeType {
  INITIAL = "INITIAL",
  MANUAL_TRIGGER = "MANUAL_TRIGGER",
  HTTP_REQUEST = "HTTP_REQUEST",
}
export default NodeType;

export function enumToPgEnum<T extends Record<string, any>>(
  myEnum: T
): [T[keyof T], ...T[keyof T][]] {
  return Object.values(myEnum).map((value: any) => `${value}`) as any;
}

export const nodeTypeEnum = pgEnum("role", enumToPgEnum(NodeType));

export const nodesTable = pgTable("nodesTable", {
  id: text("id").primaryKey().unique(),
  workflowId: text("workflow_id")
    .notNull()
    .references(() => workflowsTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  type: nodeTypeEnum("type").notNull(),
  position: jsonb("position").notNull(),
  data: jsonb("data").notNull().default("{}"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const nodeRelations = relations(nodesTable, ({ one, many }) => ({
  workflow: one(workflowsTable, {
    fields: [nodesTable.workflowId],
    references: [workflowsTable.id],
  }),
  outputConnections: many(connectionsTable),
  inputConnections: many(connectionsTable),
}));

/*
 
    ____                            _   _               _____     _     _      
   / ___|___  _ __  _ __   ___  ___| |_(_) ___  _ __   |_   _|_ _| |__ | | ___ 
  | |   / _ \| '_ \| '_ \ / _ \/ __| __| |/ _ \| '_ \    | |/ _` | '_ \| |/ _ \
  | |__| (_) | | | | | | |  __/ (__| |_| | (_) | | | |   | | (_| | |_) | |  __/
   \____\___/|_| |_|_| |_|\___|\___|\__|_|\___/|_| |_|   |_|\__,_|_.__/|_|\___|
                                                                               
 
*/

export const connectionsTable = pgTable("connectionsTable", {
  id: text("id").primaryKey(),
  workflowId: text("workflow_id").notNull(),

  fromNodeId: text("from_node_id").notNull(),
  toNodeId: text("to_node_id").notNull(),

  fromOutput: text("from_output").default("main"),
  toOutput: text("to_output").default("main"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const connectionRelations = relations(connectionsTable, ({ one }) => ({
  fromNode: one(nodesTable, {
    fields: [connectionsTable.fromNodeId],
    references: [nodesTable.id],
  }),
  toNode: one(nodesTable, {
    fields: [connectionsTable.toNodeId],
    references: [nodesTable.id],
  }),
}));
