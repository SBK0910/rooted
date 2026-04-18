import { InferSelectModel, sql } from "drizzle-orm";
import { boolean, check, foreignKey, pgTable, text, timestamp, uuid, primaryKey } from "drizzle-orm/pg-core";

export const views = pgTable("views", {
    user_id: text("user_id").notNull(),
    id: uuid("id")
        .defaultRandom()
        .unique()
        .notNull(),
    title: text("title")
        .notNull()
        .unique(),
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
    primaryKey({
        columns: [table.id, table.user_id],
        name: "views_pkey",
    }),
    foreignKey({
        columns: [table.parentId, table.user_id],
        foreignColumns: [table.id, table.user_id],
        name: "views_parent_id_fkey",
    }).onDelete("restrict"),
    check("views_parent_id_check", sql`(parent_id IS NULL) OR (parent_id != id)`),
])

export type ViewRecord = InferSelectModel<typeof views>;