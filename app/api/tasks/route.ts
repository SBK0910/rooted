import { NextRequest, NextResponse } from "next/server";

import { taskRepo } from "@/db/repos/task.repo";
import { graphNodesQuerySchema } from "@/features/tasks/contracts/task.contract";

export async function GET(request: NextRequest) {
    try {
        const queryResult = graphNodesQuerySchema.safeParse({
            scheduledDate: request.nextUrl.searchParams.get("scheduledDate") ?? undefined,
        });

        if (!queryResult.success) {
            return NextResponse.json(
                {
                    error: queryResult.error.issues[0]?.message ?? "Invalid query parameters",
                },
                { status: 400 }
            );
        }

        const nodes = await taskRepo.getGraphNodes(queryResult.data);

        return NextResponse.json(nodes);
    } catch {
        return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
    }
}