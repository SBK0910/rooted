import { NextRequest, NextResponse } from "next/server";

import viewRepo from "@/db/repos/view.repo";
import {
    updateViewSchema,
    viewIdParamSchema,
} from "@/features/views/contracts/view.contract";
import { HttpError } from "@/features/shared/errors/http-error";
import z from "zod";

type RouteContext = {
    params: Promise<{ id: string }>;
};

export async function GET(_: NextRequest, context: RouteContext) {
    const params = await context.params;
    const paramResult = viewIdParamSchema.safeParse(params);

    if (!paramResult.success) {
        return NextResponse.json(
            { error: z.prettifyError(paramResult.error) },
            { status: 400 }
        );
    }

    try {
        const view = await viewRepo.getViewById(paramResult.data.id);
        if (!view || !view.isActive) {
            return NextResponse.json({ error: "View not found" }, { status: 404 });
        }

        return NextResponse.json(view);
    } catch (error) {
        if (error instanceof HttpError) {
            return NextResponse.json({ error: error.message }, { status: error.status });
        }

        return NextResponse.json({ error: "Failed to fetch view" }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
    const params = await context.params;
    const paramResult = viewIdParamSchema.safeParse(params);

    if (!paramResult.success) {
        return NextResponse.json(
            { error: z.prettifyError(paramResult.error) },
            { status: 400 }
        );
    }

    const body: unknown = await request.json();
    const inputResult = updateViewSchema.safeParse(body);

    if (!inputResult.success) {
        return NextResponse.json(
            { error: z.prettifyError(inputResult.error) },
            { status: 400 }
        );
    }

    try {
        const updated = await viewRepo.updateView(
            paramResult.data.id,
            inputResult.data.title,
            inputResult.data.description,
            inputResult.data.parentId
        );

        if (!updated || !updated.isActive) {
            return NextResponse.json({ error: "View not found" }, { status: 404 });
        }

        return NextResponse.json(updated);
    } catch (error) {
        if (error instanceof HttpError) {
            return NextResponse.json({ error: error.message }, { status: error.status });
        }

        return NextResponse.json({ error: "Failed to update view" }, { status: 500 });
    }
}
