import { asc, desc, DrizzleQueryError, eq } from "drizzle-orm";
import db from "..";
import { views } from "../schemas/view";
import { DatabaseError } from "@neondatabase/serverless";
import { withPagination } from "../utils/pagination";

class ViewRepo {
    async fetchViews(page: number, pageSize: number, orderBy: string) {
        if (page < 1 || pageSize < 1) {
            throw new Error("Page and pageSize must be greater than 0.");
        }

        if (!(orderBy.startsWith("-") || orderBy.startsWith("+"))) {
            throw new Error("Invalid orderBy format. Must start with '+' or '-'.");
        }

        const orderColumn = orderBy.slice(1);

        if (orderColumn !== "createdAt") {
            throw new Error("Invalid orderBy column. Only 'createdAt' is allowed.");
        }

        const query = db
            .select()
            .from(views)
            .$dynamic()

        if (orderBy.startsWith("-")) {
            query.orderBy(desc(views.createdAt));
        } else {
            query.orderBy(asc(views.createdAt));
        }


        try {
            const data = await withPagination(query, page, pageSize);
            return data;
        } catch {
            throw new Error("Failed to fetch views.");
        }

    }
    async createView(title: string, description?: string, parentId?: string) {
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
                        throw new Error("Invalid parentId: cannot reference itself or create circular reference.");
                    }
                    if (error.cause.code === "23503" && error.cause.constraint === "views_parent_id_fkey") {
                        throw new Error("Invalid parentId: referenced view does not exist.");
                    }
                }
            }
        }
    }
    async updateView(id: string, title?: string, description?: string, parentId?: string) {
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
            return updatedView;
        } catch (error) {
            if (error instanceof DrizzleQueryError) {
                if (error.cause instanceof DatabaseError) {
                    if (error.cause.code === "23514" && error.cause.constraint === "views_parent_id_check") {
                        throw new Error("Invalid parentId: cannot reference itself or create circular reference.");
                    }
                    if (error.cause.code === "23503" && error.cause.constraint === "views_parent_id_fkey") {
                        throw new Error("Invalid parentId: referenced view does not exist.");
                    }
                }
            }
        }
    }
    async deleteView(id: string) {
        try {
            await db
                .update(views)
                .set({ isActive: false })
                .where(eq(views.id, id));
        } catch {
            throw new Error("Failed to delete view.");
        }
    }
}

const viewRepo = new ViewRepo();
export default viewRepo;