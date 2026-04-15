import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import viewRepo from "@/db/repos/view.repo";
import {
    createViewSchema,
    listViewsQuerySchema,
} from "@/features/views/contracts/view.contract";
import { z } from "zod";
import { HttpError } from "@/features/shared/errors/http-error";

export async function GET(request: NextRequest) {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const queryResult = listViewsQuerySchema.safeParse({
        page: request.nextUrl.searchParams.get("page") ?? undefined,
        pageSize: request.nextUrl.searchParams.get("pageSize") ?? undefined,
        orderBy: request.nextUrl.searchParams.get("orderBy") ?? undefined,
        isActive: request.nextUrl.searchParams.get("isActive") ?? undefined,
    });

    if (!queryResult.success) {
        return NextResponse.json(
            { error: z.prettifyError(queryResult.error) },
            { status: 400 }
        );
    }

    try {
        const data = await viewRepo.fetchViews(
            userId,
            queryResult.data.page,
            queryResult.data.pageSize,
            queryResult.data.orderBy,
            queryResult.data.isActive
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
        return NextResponse.json({ error: "Failed to fetch views" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: unknown = await request.json();
    const inputResult = createViewSchema.safeParse(body);

    if (!inputResult.success) {
        return NextResponse.json(
            { error: z.prettifyError(inputResult.error) },
            { status: 400 }
        );
    }

    try {
        const created = await viewRepo.createView(
            userId,
            inputResult.data.title,
            inputResult.data.description,
            inputResult.data.parentId
        );

        return NextResponse.json(created, { status: 201 });
    } catch (error) {
        if (error instanceof HttpError) {
            return NextResponse.json({ error: error.message }, { status: error.status });
        }

        return NextResponse.json({ error: "Failed to create view" }, { status: 500 });
    }
}
