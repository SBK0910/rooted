import { DatabaseError } from "@neondatabase/serverless";
import { DrizzleQueryError } from "drizzle-orm";

type TaskApiError = {
    status: number;
    error: string;
};

function getPgError(error: unknown): DatabaseError | null {
    if (!(error instanceof DrizzleQueryError)) {
        return null;
    }

    if (!(error.cause instanceof DatabaseError)) {
        return null;
    }

    return error.cause;
}

export function mapTaskDbError(error: unknown): TaskApiError | null {
    const pgError = getPgError(error);
    if (!pgError) {
        return null;
    }

    if (pgError.code === "23514") {
        if (pgError.constraint === "tasks_leaf_fields_check") {
            return {
                status: 400,
                error: "Leaf node must include completed, weight, and scheduledDate.",
            };
        }

        if (pgError.constraint === "tasks_group_fields_check") {
            return {
                status: 400,
                error: "Group node cannot include completed, weight, or scheduledDate.",
            };
        }
    }

    if (pgError.code === "23503" && pgError.constraint === "tasks_parent_id_fkey") {
        return {
            status: 400,
            error: "parentId must reference an existing task id.",
        };
    }

    return null;
}