import { NextRequest, NextResponse } from "next/server";

import taskRepo from "@/db/repos/task.repo";
import {
    taskIdParamSchema,
    updateTaskSchema,
} from "@/features/tasks/contracts/task.contract";
import { HttpError } from "@/features/shared/errors/http-error";
import { z } from "zod";

type RouteContext = {
    params: Promise<{ id: string }>;
};

export async function GET(_: NextRequest, context: RouteContext) {
    const params = await context.params;
    const paramResult = taskIdParamSchema.safeParse(params);

    if (!paramResult.success) {
        return NextResponse.json(
            { error: z.prettifyError(paramResult.error) },
            { status: 400 }
        );
    }

    try {
        const task = await taskRepo.getTaskById(paramResult.data.id);
        if (!task) {
            return NextResponse.json({ error: "Task not found" }, { status: 404 });
        }

        return NextResponse.json(task);
    } catch (error) {
        if (error instanceof HttpError) {
            return NextResponse.json({ error: error.message }, { status: error.status });
        }

        return NextResponse.json({ error: "Failed to fetch task" }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
    const params = await context.params;
    const paramResult = taskIdParamSchema.safeParse(params);

    if (!paramResult.success) {
        return NextResponse.json(
            { error: z.prettifyError(paramResult.error) },
            { status: 400 }
        );
    }

    const body: unknown = await request.json();
    const inputResult = updateTaskSchema.safeParse(body);

    if (!inputResult.success) {
        return NextResponse.json(
            { error: z.prettifyError(inputResult.error) },
            { status: 400 }
        );
    }

    try {
        const updated = await taskRepo.updateTask(
            paramResult.data.id,
            inputResult.data.title,
            inputResult.data.description,
            inputResult.data.completed,
            inputResult.data.weight,
            inputResult.data.scheduledDate,
            inputResult.data.viewId
        );

        if (!updated) {
            return NextResponse.json({ error: "Task not found" }, { status: 404 });
        }

        return NextResponse.json(updated);
    } catch (error) {
        if (error instanceof HttpError) {
            return NextResponse.json({ error: error.message }, { status: error.status });
        }

        return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
    }
}

export async function DELETE(_: NextRequest, context: RouteContext) {
    const params = await context.params;
    const paramResult = taskIdParamSchema.safeParse(params);

    if (!paramResult.success) {
        return NextResponse.json(
            { error: z.prettifyError(paramResult.error) },
            { status: 400 }
        );
    }

    try {
        const deleted = await taskRepo.deleteTask(paramResult.data.id);
        if (!deleted) {
            return NextResponse.json({ error: "Task not found" }, { status: 404 });
        }

        return NextResponse.json(deleted, { status: 200 });
    } catch (error) {
        if (error instanceof HttpError) {
            return NextResponse.json({ error: error.message }, { status: error.status });
        }

        return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
    }
}
