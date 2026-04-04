CREATE TYPE "public"."task_node_type" AS ENUM('group', 'leaf');--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"parent_id" uuid,
	"title" text NOT NULL,
	"description" text,
	"type" "task_node_type" NOT NULL,
	"completed" boolean,
	"weight" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tasks_type_fields_check" CHECK (("tasks"."type" = 'leaf' AND "tasks"."completed" IS NOT NULL AND "tasks"."weight" IS NOT NULL) OR ("tasks"."type" = 'group' AND "tasks"."completed" IS NULL AND "tasks"."weight" IS NULL))
);
--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE no action;