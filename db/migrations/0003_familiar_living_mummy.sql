ALTER TABLE "series" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "views" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "views" ADD CONSTRAINT "views_title_unique" UNIQUE("title");