import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { updateViewSchema } from "../contracts/view.contract";
import type { ViewRecord } from "./create-view";

type UpdateViewInput = z.infer<typeof updateViewSchema>;

async function updateView(id: string, input: UpdateViewInput): Promise<ViewRecord> {
    const response = await fetch(`/api/views/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error ?? "Failed to update view");
    }

    return response.json();
}

export function useUpdateViewMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, input }: { id: string; input: UpdateViewInput }) =>
            updateView(id, input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["taskTree"] });
        },
    });
}
