import { NextRequest, NextResponse } from "next/server";

import taskRepo from "@/db/repos/task.repo";
import { taskTreeQuerySchema } from "@/features/tasks/contracts/task.contract";
import { HttpError } from "@/features/shared/errors/http-error";
import { buildTaskTree } from "@/features/tasks/application/task-tree";
import { z } from "zod";

export async function GET(request: NextRequest) {
    const queryResult = taskTreeQuerySchema.safeParse({
        scheduledDate: request.nextUrl.searchParams.get("scheduledDate") ?? undefined,
    });

    if (!queryResult.success) {
        return NextResponse.json(
            { error: z.prettifyError(queryResult.error) },
            { status: 400 }
        );
    }

    try {
        const data = await taskRepo.fetchTaskTreeContextByDate(queryResult.data.scheduledDate);
        const tree = buildTaskTree(data.tasks, data.views);

        return NextResponse.json(
            {
                scheduledDate: queryResult.data.scheduledDate,
                tree: tree.roots,
                unassignedTasks: tree.unassignedTasks,
            },
            { status: 200 }
        );
    } catch (error) {
        if (error instanceof HttpError) {
            return NextResponse.json({ error: error.message }, { status: error.status });
        }

        return NextResponse.json({ error: "Failed to fetch task tree" }, { status: 500 });
    }
}
