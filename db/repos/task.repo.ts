import { and, asc, desc, DrizzleQueryError, eq, sql } from "drizzle-orm";
import db from "..";
import { TaskRecord, tasks } from "../schemas/task";
import { DatabaseError } from "@neondatabase/serverless";
import { withPagination } from "../utils/pagination";
import { HttpError } from "@/features/shared/errors/http-error";
import { ViewRecord } from "../schemas/view";

class TaskRepo {
    async fetchTaskTreeContextByDate(scheduledDate: string) {
        try {
            const result = await db.execute<{ payload: { tasks: TaskRecord[]; views: ViewRecord[] } }>(sql`
                WITH RECURSIVE
                day_tasks AS (
                    SELECT t.*
                    FROM tasks t
                    WHERE t.scheduled_date = CAST(${scheduledDate} AS date)
                ),
                ancestor_views AS (
                    SELECT v.*, ARRAY[v.id] AS path
                    FROM views v
                    WHERE v.id IN (
                        SELECT DISTINCT t.view_id
                        FROM day_tasks t
                        WHERE t.view_id IS NOT NULL
                    )

                    UNION ALL

                    SELECT p.*, av.path || p.id
                    FROM views p
                                        JOIN ancestor_views av ON av.parent_id = p.id
                    WHERE NOT (p.id = ANY(av.path))
                ),
                distinct_views AS (
                    SELECT DISTINCT ON (v.id)
                      v.id, v.title, v.description, v.parent_id, v.created_at, v.updated_at, v.is_active
                    FROM ancestor_views v
                    ORDER BY v.id
                )
                SELECT jsonb_build_object(
                    'tasks', COALESCE((SELECT jsonb_agg(to_jsonb(dt)) FROM day_tasks dt), '[]'::jsonb),
                    'views', COALESCE((SELECT jsonb_agg(to_jsonb(vw)) FROM distinct_views vw), '[]'::jsonb)
                ) AS payload;
            `);

            const payload = result.rows[0]?.payload;
            if (!payload) {
                return { tasks: [], views: [] };
            }

            return payload;
        } catch {
            throw new HttpError(500, "Failed to fetch task tree context.");
        }
    }

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
