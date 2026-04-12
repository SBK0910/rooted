import { useMutation, useQueryClient } from "@tanstack/react-query";
import { taskRecordSchema } from "../contracts/task.contract";
import type { TaskRecord } from "../contracts/task.contract";

async function toggleTask({
    id,
    completed,
}: {
    id: string;
    completed: boolean;
}): Promise<TaskRecord> {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const response = await fetch(`/api/tasks/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "X-Timezone": timezone },
        body: JSON.stringify({ completed }),
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

export function useToggleTaskMutation(scheduledDate: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: toggleTask,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["taskTree", scheduledDate] });
        },
    });
}
