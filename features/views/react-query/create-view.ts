import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { createViewSchema } from "../contracts/view.contract";

type CreateViewInput = z.infer<typeof createViewSchema>;

export type ViewRecord = {
    id: string;
    title: string;
    description: string | null;
    isActive: boolean;
    parentId: string | null;
    createdAt: string;
    updatedAt: string;
};

async function createView(input: CreateViewInput): Promise<ViewRecord> {
    const response = await fetch("/api/views", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error ?? "Failed to create view");
    }

    return response.json();
}

export function useCreateViewMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createView,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["taskTree"] });
        },
    });
}
