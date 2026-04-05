import { desc, eq } from "drizzle-orm";

import db from "../index";
import {
    TaskRecord,
    tasks,
} from "../schemas/task";
import {
    InsertGroupNodeInput,
    InsertLeafNodeInput,
    GraphNodesQuery,
} from "@/features/tasks/contracts/task.contract";

export class TaskRepo {
    async insertLeafNode(input: InsertLeafNodeInput): Promise<TaskRecord> {
        const [row] = await db
            .insert(tasks)
            .values({
                type: "leaf",
                title: input.title,
                description: input.description,
                parentId: input.parentId,
                scheduledDate: input.scheduledDate,
                weight: input.weight ?? 1,
                completed: false,
            })
            .returning();

        return row;
    }

    async insertGroupNode(input: InsertGroupNodeInput): Promise<TaskRecord> {
        const [row] = await db
            .insert(tasks)
            .values({
                type: "group",
                title: input.title,
                description: input.description,
                parentId: input.parentId,
            })
            .returning();

        return row;
    }

    async getGraphNodes(options?: GraphNodesQuery): Promise<TaskRecord[]> {
        if (options?.scheduledDate) {
            return db
                .select()
                .from(tasks)
                .where(eq(tasks.scheduledDate, options.scheduledDate))
                .orderBy(desc(tasks.createdAt));
        }

        return db.select().from(tasks).orderBy(desc(tasks.createdAt));
    }
}

export const taskRepo = new TaskRepo();