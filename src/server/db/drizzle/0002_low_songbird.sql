CREATE TYPE "public"."workflow_status" AS ENUM('draft', 'active', 'paused', 'archived');--> statement-breakpoint
CREATE TABLE "workflowsTable" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"status" "workflow_status" DEFAULT 'draft' NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"last_executed_at" timestamp,
	"execution_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accountsTable" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "sessionsTable" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "workflowsTable" ADD CONSTRAINT "workflowsTable_user_id_usersTable_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."usersTable"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "workflow_userId_idx" ON "workflowsTable" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "workflow_status_idx" ON "workflowsTable" USING btree ("status");--> statement-breakpoint
CREATE INDEX "workflow_userId_status_idx" ON "workflowsTable" USING btree ("user_id","status");--> statement-breakpoint
CREATE INDEX "account_provider_idx" ON "accountsTable" USING btree ("provider_id","account_id");--> statement-breakpoint
CREATE INDEX "session_token_idx" ON "sessionsTable" USING btree ("token");--> statement-breakpoint
CREATE INDEX "verification_expiresAt_idx" ON "verificationsTable" USING btree ("expires_at");