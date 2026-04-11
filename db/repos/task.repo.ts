import { and, asc, desc, DrizzleQueryError, eq } from "drizzle-orm";
import db from "..";
import { tasks } from "../schemas/task";
import { DatabaseError } from "@neondatabase/serverless";
import { withPagination } from "../utils/pagination";
import { HttpError } from "@/features/shared/errors/http-error";

class TaskRepo {
    async fetchTasks(
        page: number,
        pageSize: number,
        orderBy: string,
        viewId?: string,
        scheduledDate?: string,
    ) {
        const conditions = [
            ...(viewId ? [eq(tasks.viewId, viewId)] : []),
            ...(scheduledDate ? [eq(tasks.scheduledDate, scheduledDate)] : []),
        ];

        const query = db
            .select()
            .from(tasks)
            .where(conditions.length > 0 ? and(...conditions) : undefined)
            .$dynamic();

        if (orderBy.startsWith("-")) {
            query.orderBy(desc(tasks.createdAt));
        } else {
            query.orderBy(asc(tasks.createdAt));
        }

        try {
            return await withPagination(query, page, pageSize);
        } catch {
            throw new HttpError(500, "Failed to fetch tasks.");
        }
    }

    async getTaskById(id: string) {
        try {
            const [task] = await db
                .select()
                .from(tasks)
                .where(eq(tasks.id, id))
                .limit(1);
            return task ?? null;
        } catch {
            throw new HttpError(500, "Failed to fetch task.");
        }
    }

    async createTask(
        title: string,
        scheduledDate: string,
        description?: string,
        weight?: number,
        viewId?: string | null,
    ) {
        try {
            const [newTask] = await db
                .insert(tasks)
                .values({ title, scheduledDate, description, weight, viewId })
                .returning();
            return newTask;
        } catch (error) {
            if (error instanceof DrizzleQueryError) {
                if (error.cause instanceof DatabaseError) {
                    if (error.cause.code === "23503" && error.cause.constraint === "tasks_view_id_fkey") {
                        throw new HttpError(400, "Invalid viewId: referenced view does not exist.");
                    }
                }
            }
            throw new HttpError(500, "Failed to create task.");
        }
    }

    async updateTask(
        id: string,
        title?: string,
        description?: string,
        completed?: boolean,
        weight?: number,
        scheduledDate?: string,
        viewId?: string | null,
    ) {
        try {
            const [updatedTask] = await db
                .update(tasks)
                .set({ title, description, completed, weight, scheduledDate, viewId })
                .where(eq(tasks.id, id))
                .returning();
            return updatedTask ?? null;
        } catch (error) {
            if (error instanceof DrizzleQueryError) {
                if (error.cause instanceof DatabaseError) {
                    if (error.cause.code === "23503" && error.cause.constraint === "tasks_view_id_fkey") {
                        throw new HttpError(400, "Invalid viewId: referenced view does not exist.");
                    }
                }
            }
            throw new HttpError(500, "Failed to update task.");
        }
    }

    async deleteTask(id: string) {
        try {
            const [deleted] = await db
                .delete(tasks)
                .where(eq(tasks.id, id))
                .returning();
            return deleted ?? null;
        } catch {
            throw new HttpError(500, "Failed to delete task.");
        }
    }
}

const taskRepo = new TaskRepo();
export default taskRepo;
