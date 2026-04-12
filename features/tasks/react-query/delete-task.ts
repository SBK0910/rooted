import { useMutation, useQueryClient } from "@tanstack/react-query";

async function deleteTask(id: string): Promise<void> {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const response = await fetch(`/api/tasks/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: { "X-Timezone": timezone },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error ?? "Failed to delete task");
    }
}

export function useDeleteTaskMutation(scheduledDate: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteTask,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["taskTree", scheduledDate] });
        },
    });
}
