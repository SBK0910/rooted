import { sql } from "drizzle-orm";
import {
    boolean,
    check,
    date,
    foreignKey,
    integer,
    pgTable,
    text,
    timestamp,
    uuid,
} from "drizzle-orm/pg-core";
import { views } from "./view";

export const series = pgTable(
    "series",
    {
        userid: text("user_id").notNull(),
        id: uuid("id").defaultRandom().primaryKey(),
        viewId: uuid("view_id").notNull(),
        title: text("title").notNull(),
        description: text("description"),
        weight: integer("weight").notNull().default(1),
        isActive: boolean("is_active").notNull().default(true),
        rrule: text("rrule").notNull(),
        lastGeneratedDate: date("last_generated_date"),
        createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
            .notNull()
            .defaultNow(),
        updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
            .notNull()
            .defaultNow(),
    },
    (table) => [
        foreignKey({
            columns: [table.viewId],
            foreignColumns: [views.id],
            name: "series_view_id_fkey",
        }).onDelete("restrict"),

        check("series_weight_check", sql`${table.weight} > 0`),
    ]
);