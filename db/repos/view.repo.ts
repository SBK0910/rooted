import { asc, desc, DrizzleQueryError, eq } from "drizzle-orm";
import db from "..";
import { views } from "../schemas/view";
import { DatabaseError } from "@neondatabase/serverless";
import { withPagination } from "../utils/pagination";
import { HttpError } from "@/features/shared/errors/http-error";

class ViewRepo {
    async fetchViews(page: number, pageSize: number, orderBy: string) {
        const query = db
            .select()
            .from(views)
            .where(eq(views.isActive, true))
            .$dynamic();

        if (orderBy.startsWith("-")) {
            query.orderBy(desc(views.createdAt));
        } else {
            query.orderBy(asc(views.createdAt));
        }

        try {
            const data = await withPagination(query, page, pageSize);
            return data;
        } catch {
            throw new HttpError(500, "Failed to fetch views.");
        }
    }

    async getViewById(id: string) {
        try {
            const [view] = await db
                .select()
                .from(views)
                .where(eq(views.id, id))
                .limit(1);
            return view ?? null;
        } catch {
            throw new HttpError(500, "Failed to fetch view.");
        }
    }

    async createView(title: string, description?: string, parentId?: string | null) {
        try {
            const [newView] = await db
                .insert(views)
                .values({
                    title,
                    description,
                    parentId,
                })
                .returning();
            return newView;
        } catch (error) {
            if (error instanceof DrizzleQueryError) {
                if (error.cause instanceof DatabaseError) {
                    if (error.cause.code === "23514" && error.cause.constraint === "views_parent_id_check") {
                        throw new HttpError(400, "Invalid parentId: cannot reference itself.");
                    }
                    if (error.cause.code === "23503" && error.cause.constraint === "views_parent_id_fkey") {
                        throw new HttpError(400, "Invalid parentId: referenced view does not exist.");
                    }
                }
            }

            throw new HttpError(500, "Failed to create view.");
        }
    }

    async updateView(id: string, title?: string, description?: string, parentId?: string | null) {
        try {
            const [updatedView] = await db
                .update(views)
                .set({
                    title,
                    description,
                    parentId,
                })
                .where(eq(views.id, id))
                .returning();
            return updatedView ?? null;
        } catch (error) {
            if (error instanceof DrizzleQueryError) {
                if (error.cause instanceof DatabaseError) {
                    if (error.cause.code === "23514" && error.cause.constraint === "views_parent_id_check") {
                        throw new HttpError(400, "Invalid parentId: cannot reference itself.");
                    }
                    if (error.cause.code === "23503" && error.cause.constraint === "views_parent_id_fkey") {
                        throw new HttpError(400, "Invalid parentId: referenced view does not exist.");
                    }
                    if (error.cause.code === "23505" && error.cause.constraint === "views_title_key") {
                        throw new HttpError(409, "A view with the same title already exists.");
                    }
                }
            }

            throw new HttpError(500, "Failed to update view.");
        }
    }

    async disableView(id: string) {
        try {
            const [disabled] = await db
                .update(views)
                .set({ isActive: false })
                .where(eq(views.id, id))
                .returning();
            return disabled ?? null;
        } catch {
            throw new HttpError(500, "Failed to disable view.");
        }
    }
}

const viewRepo = new ViewRepo();
export default viewRepo;