ALTER TABLE "tasks" DROP CONSTRAINT "tasks_type_fields_check";--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "scheduled_date" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "tasks" ALTER COLUMN "scheduled_date" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_leaf_fields_check" CHECK ("tasks"."type" <> 'leaf' OR ("tasks"."completed" IS NOT NULL AND "tasks"."weight" IS NOT NULL AND "tasks"."scheduled_date" IS NOT NULL));--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_group_fields_check" CHECK ("tasks"."type" <> 'group' OR ("tasks"."completed" IS NULL AND "tasks"."weight" IS NULL AND "tasks"."scheduled_date" IS NULL));