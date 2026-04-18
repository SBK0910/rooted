ALTER TABLE "tasks" DROP CONSTRAINT "tasks_view_id_fkey";
--> statement-breakpoint
ALTER TABLE "views" DROP CONSTRAINT "views_parent_id_fkey";
--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_view_id_fkey" FOREIGN KEY ("view_id","user_id") REFERENCES "public"."views"("id","user_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "views" ADD CONSTRAINT "views_parent_id_fkey" FOREIGN KEY ("parent_id","user_id") REFERENCES "public"."views"("id","user_id") ON DELETE restrict ON UPDATE no action;