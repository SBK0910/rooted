import { sql } from "drizzle-orm";
import {
    boolean,
    check,
    date,
    foreignKey,
    integer,
    pgEnum,
    pgTable,
    text,
    timestamp,
    uuid,
} from "drizzle-orm/pg-core";

export const taskNodeTypeEnum = pgEnum("task_node_type", ["group", "leaf"]);

export const tasks = pgTable(
    "tasks",
    {
        id: uuid("id").defaultRandom().primaryKey(),
        parentId: uuid("parent_id"),
        title: text("title").notNull(),
        description: text("description"),
        type: taskNodeTypeEnum("type").notNull(),
        completed: boolean("completed"),
        weight: integer("weight"),
        createdAt: timestamp("created_at", { withTimezone: true })
            .notNull()
            .defaultNow(),
        updatedAt: timestamp("updated_at", { withTimezone: true })
            .notNull()
            .defaultNow(),
        scheduledDate: date("scheduled_date").notNull().default(sql`CURRENT_DATE`),
    },
    (table) => [
        check(
            "tasks_type_fields_check",
            sql`(${table.type} = 'leaf' AND ${table.completed} IS NOT NULL AND ${table.weight} IS NOT NULL) OR (${table.type} = 'group' AND ${table.completed} IS NULL AND ${table.weight} IS NULL)`
        ),
        foreignKey({
            columns: [table.parentId],
            foreignColumns: [table.id],
            name: "tasks_parent_id_fkey",
        }).onDelete("cascade"),
    ]
);