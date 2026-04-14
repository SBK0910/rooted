import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ViewRecord } from "@/features/views/contracts/view.contract";

async function disableView(id: string): Promise<ViewRecord> {
    const response = await fetch(`/api/views/${id}/disable`, {
        method: "POST",
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error ?? "Failed to disable view");
    }

    return response.json();
}

export function useDisableViewMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => disableView(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["views"] });
            queryClient.invalidateQueries({ queryKey: ["taskTree"] });
        },
    });
}
