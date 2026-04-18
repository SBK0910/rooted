/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'public'
                AND table_name = 'views'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "views" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
ALTER TABLE "views" ALTER COLUMN "id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "views" ADD CONSTRAINT "views_pkey" PRIMARY KEY("id","user_id");--> statement-breakpoint
ALTER TABLE "views" ADD CONSTRAINT "views_id_unique" UNIQUE("id");