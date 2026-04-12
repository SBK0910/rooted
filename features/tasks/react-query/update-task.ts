import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { updateTaskSchema, taskRecordSchema } from "../contracts/task.contract";

type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
type TaskRecord = z.infer<typeof taskRecordSchema>;

async function updateTask({
    id,
    input,
}: {
    id: string;
    input: UpdateTaskInput;
}): Promise<TaskRecord> {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const response = await fetch(`/api/tasks/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "X-Timezone": timezone },
        body: JSON.stringify(input),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error ?? "Failed to update task");
    }

    const payload = await response.json();
    const data = taskRecordSchema.safeParse(payload);
    if (!data.success) {
        throw new Error("Invalid task response data");
    }
    return data.data;
}

export function useUpdateTaskMutation(scheduledDate: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateTask,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["taskTree", scheduledDate] });
        },
    });
}
