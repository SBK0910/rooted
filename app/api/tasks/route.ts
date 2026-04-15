import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import taskRepo from "@/db/repos/task.repo";
import {
    createTaskSchema,
    listTasksQuerySchema,
} from "@/features/tasks/contracts/task.contract";
import { z } from "zod";
import { HttpError } from "@/features/shared/errors/http-error";
import { getTodayInTimezone } from "@/lib/utils";

export async function GET(request: NextRequest) {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const queryResult = listTasksQuerySchema.safeParse({
        page: request.nextUrl.searchParams.get("page") ?? undefined,
        pageSize: request.nextUrl.searchParams.get("pageSize") ?? undefined,
        orderBy: request.nextUrl.searchParams.get("orderBy") ?? undefined,
        viewId: request.nextUrl.searchParams.get("viewId") ?? undefined,
        scheduledDate: request.nextUrl.searchParams.get("scheduledDate") ?? undefined,
    });

    if (!queryResult.success) {
        return NextResponse.json(
            { error: z.prettifyError(queryResult.error) },
            { status: 400 }
        );
    }

    try {
        const data = await taskRepo.fetchTasks(
            queryResult.data.page,
            queryResult.data.pageSize,
            queryResult.data.orderBy,
            userId,
            queryResult.data.viewId,
            queryResult.data.scheduledDate
        );

        return NextResponse.json(
            {
                data,
                meta: {
                    page: queryResult.data.page,
                    pageSize: queryResult.data.pageSize,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        if (error instanceof HttpError) {
            return NextResponse.json({ error: error.message }, { status: error.status });
        }

        return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: unknown = await request.json();
    const inputResult = createTaskSchema.safeParse(body);

    if (!inputResult.success) {
        return NextResponse.json(
            { error: z.prettifyError(inputResult.error) },
            { status: 400 }
        );
    }

    const tz = request.headers.get("X-Timezone") ?? "UTC";
    const today = getTodayInTimezone(tz);
    if (inputResult.data.scheduledDate < today) {
        return NextResponse.json(
            { error: "Cannot create a task for a past date" },
            { status: 422 }
        );
    }

    try {
        const created = await taskRepo.createTask(
            inputResult.data.title,
            inputResult.data.scheduledDate,
            userId,
            inputResult.data.description,
            inputResult.data.weight,
            inputResult.data.viewId
        );

        return NextResponse.json(created, { status: 201 });
    } catch (error) {
        if (error instanceof HttpError) {
            return NextResponse.json({ error: error.message }, { status: error.status });
        }

        return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
    }
}
