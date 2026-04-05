import { desc, eq, InferInsertModel, InferSelectModel } from "drizzle-orm";

import db from "../index";
import { tasks } from "../schemas/task";

export type TaskRecord = InferSelectModel<typeof tasks>;
export type NewTaskRecord = InferInsertModel<typeof tasks>;

export type InsertGroupNodeInput = {
	type: "group";
	title: string;
	description?: string | null;
	parentId?: string | null;
};

export type InsertLeafNodeInput = {
	type: "leaf";
	title: string;
	description?: string | null;
	parentId?: string | null;
	completed?: boolean;
	weight?: number;
	scheduledDate: string;
};

export type InsertNodeInput = InsertGroupNodeInput | InsertLeafNodeInput;

export class TaskRepo {
	async insertNode(input: InsertNodeInput): Promise<TaskRecord> {
		if (input.type === "group") {
			const [row] = await db
				.insert(tasks)
				.values({
					title: input.title,
					description: input.description ?? null,
					parentId: input.parentId ?? null,
					type: "group",
					completed: null,
					weight: null,
					scheduledDate: null,
				})
				.returning();

			return row;
		}

		const [row] = await db
			.insert(tasks)
			.values({
				title: input.title,
				description: input.description ?? null,
				parentId: input.parentId ?? null,
				type: "leaf",
				completed: input.completed ?? false,
				weight: input.weight ?? 1,
				scheduledDate: input.scheduledDate,
			})
			.returning();

		return row;
	}

	async getAllGraphNodes(options?: { scheduledDate?: string }): Promise<TaskRecord[]> {
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
