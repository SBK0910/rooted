import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import taskRepo from "@/db/repos/task.repo";
import {
    taskIdParamSchema,
    updateTaskSchema,
} from "@/features/tasks/contracts/task.contract";
import { HttpError } from "@/features/shared/errors/http-error";
import { z } from "zod";
import { getTodayInTimezone } from "@/lib/utils";

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

    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const task = await taskRepo.getTaskById(paramResult.data.id, userId);
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

    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const task = await taskRepo.getTaskById(paramResult.data.id, userId);
        if (!task) {
            return NextResponse.json({ error: "Task not found" }, { status: 404 });
        }

        const tz = request.headers.get("X-Timezone") ?? "UTC";
        const today = getTodayInTimezone(tz);
        if (task.scheduledDate < today) {
            return NextResponse.json(
                { error: "Cannot edit a task scheduled for a past date" },
                { status: 403 }
            );
        }

        const updated = await taskRepo.updateTask(
            paramResult.data.id,
            userId,
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

export async function DELETE(request: NextRequest, context: RouteContext) {
    const params = await context.params;
    const paramResult = taskIdParamSchema.safeParse(params);

    if (!paramResult.success) {
        return NextResponse.json(
            { error: z.prettifyError(paramResult.error) },
            { status: 400 }
        );
    }

    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const task = await taskRepo.getTaskById(paramResult.data.id, userId);
        if (!task) {
            return NextResponse.json({ error: "Task not found" }, { status: 404 });
        }

        const tz = request.headers.get("X-Timezone") ?? "UTC";
        const today = getTodayInTimezone(tz);
        if (task.scheduledDate < today) {
            return NextResponse.json(
                { error: "Cannot delete a task scheduled for a past date" },
                { status: 403 }
            );
        }

        const deleted = await taskRepo.deleteTask(paramResult.data.id, userId);
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
