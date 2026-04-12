import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { createTaskSchema, taskRecordSchema } from "../contracts/task.contract";

type CreateTaskInput = z.infer<typeof createTaskSchema>;
type TaskRecord = z.infer<typeof taskRecordSchema>;

async function createTask(input: CreateTaskInput): Promise<TaskRecord> {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Timezone": timezone },
        body: JSON.stringify(input),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error ?? "Failed to create task");
    }

    const payload = await response.json();
    const data = taskRecordSchema.safeParse(payload);
    if (!data.success) {
        throw new Error("Invalid task response data");
    }
    return data.data;
}

export function useCreateTaskMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createTask,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["taskTree", variables.scheduledDate] });
        },
    });
}
