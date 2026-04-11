import { InferSelectModel, sql } from "drizzle-orm";
import { boolean, check, foreignKey, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const views = pgTable("views", {
    id: uuid("id")
        .defaultRandom()
        .primaryKey(),
    title: text("title")
        .notNull(),
    description: text("description"),
    createdAt: timestamp("created_at", {
        withTimezone: true,
        mode: "string"
    })
        .notNull()
        .defaultNow(),
    updatedAt: timestamp("updated_at", {
        withTimezone: true,
        mode: "string"
    })
        .notNull()
        .defaultNow(),
    isActive: boolean("is_active")
        .notNull()
        .default(true),
    parentId: uuid("parent_id"),
}, (table) => [
    foreignKey({
        columns: [table.parentId],
        foreignColumns: [table.id],
        name: "views_parent_id_fkey",
    }).onDelete("restrict"),
    check("views_parent_id_check", sql`(parent_id IS NULL) OR (parent_id != id)`)
])

export type ViewRecord = InferSelectModel<typeof views>;