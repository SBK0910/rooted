import { NextRequest, NextResponse } from "next/server";

import viewRepo from "@/db/repos/view.repo";
import { viewIdParamSchema } from "@/features/views/contracts/view.contract";
import { HttpError } from "@/features/shared/errors/http-error";
import z from "zod";

type RouteContext = {
    params: Promise<{ id: string }>;
};

export async function POST(_: NextRequest, context: RouteContext) {
    const params = await context.params;
    const paramResult = viewIdParamSchema.safeParse(params);

    if (!paramResult.success) {
        return NextResponse.json(
            { error: z.prettifyError(paramResult.error)},
            { status: 400 }
        );
    }

    try {
        const disabled = await viewRepo.disableView(paramResult.data.id);
        if (!disabled) {
            return NextResponse.json({ error: "View not found" }, { status: 404 });
        }

        return NextResponse.json(disabled, { status: 200 });
    } catch (error) {
        if (error instanceof HttpError) {
            return NextResponse.json({ error: error.message }, { status: error.status });
        }

        return NextResponse.json({ error: "Failed to disable view" }, { status: 500 });
    }
}
