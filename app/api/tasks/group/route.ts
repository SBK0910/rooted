import { NextRequest, NextResponse } from "next/server";

import { taskRepo } from "@/db/repos/task.repo";
import { insertGroupNodeSchema } from "@/features/tasks/contracts/task.contract";
import { mapTaskDbError } from "@/features/tasks/application/task-api-error-map";

export async function POST(request: NextRequest) {
    try {
        const body: unknown = await request.json();
        const inputResult = insertGroupNodeSchema.safeParse(body);

        if (!inputResult.success) {
            return NextResponse.json(
                {
                    error: inputResult.error.issues[0]?.message ?? "Invalid payload",
                },
                { status: 400 }
            );
        }

        const node = await taskRepo.insertGroupNode(inputResult.data);

        return NextResponse.json(node, { status: 201 });
    } catch (error) {
        const mapped = mapTaskDbError(error);
        if (mapped) {
            return NextResponse.json({ error: mapped.error }, { status: mapped.status });
        }

        return NextResponse.json({ error: "Failed to create group node" }, { status: 500 });
    }
}