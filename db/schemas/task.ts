import { InferSelectModel } from "drizzle-orm";
import {
    boolean,
    date,
    foreignKey,
    integer,
    pgTable,
    text,
    timestamp,
    uuid,
} from "drizzle-orm/pg-core";
import { series } from "./series";
import { views } from "./view";


export const tasks = pgTable(
    "tasks",
    {
        userid: text("user_id").notNull(),
        id: uuid("id").defaultRandom().primaryKey(),
        title: text("title").notNull(),
        description: text("description"),
        completed: boolean("completed").notNull().default(false),
        weight: integer("weight").notNull().default(1),
        createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
            .notNull()
            .defaultNow(),
        updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
            .notNull()
            .defaultNow(),
        scheduledDate: date("scheduled_date").notNull(),
        viewId: uuid("view_id"),
        seriesId: uuid("series_id"),
    },
    (table) => [
        foreignKey({
            columns: [table.viewId, table.userid],
            foreignColumns: [views.id, views.user_id],
            name: "tasks_view_id_fkey",
        }).onDelete("restrict"),
        foreignKey({
            columns: [table.seriesId],
            foreignColumns: [series.id],
            name: "tasks_series_id_fkey",
        }).onDelete("set null"),
    ]
);

export type TaskRecord = InferSelectModel<typeof tasks>;