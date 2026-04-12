import { useQuery } from "@tanstack/react-query";
import type { ViewRecord } from "./create-view";

type ListViewsParams = {
    page?: number;
    pageSize?: number;
    orderBy?: "+createdAt" | "-createdAt";
};

type ListViewsResponse = {
    data: ViewRecord[];
    meta: {
        page: number;
        pageSize: number;
    };
};

async function listViews(params: ListViewsParams = {}): Promise<ListViewsResponse> {
    const searchParams = new URLSearchParams();
    if (params.page !== undefined) searchParams.set("page", String(params.page));
    if (params.pageSize !== undefined) searchParams.set("pageSize", String(params.pageSize));
    if (params.orderBy !== undefined) searchParams.set("orderBy", params.orderBy);

    const response = await fetch(`/api/views?${searchParams.toString()}`);

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error ?? "Failed to fetch views");
    }

    return response.json();
}

export function useListViewsQuery(params: ListViewsParams = {}) {
    return useQuery({
        queryKey: ["views", params],
        queryFn: () => listViews(params),
    });
}
