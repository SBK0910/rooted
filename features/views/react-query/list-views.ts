import { listViewsResponseSchema, type ListViewsResponse } from "../contracts/view.contract";

type ListViewsParams = {
    page?: number;
    pageSize?: number;
    orderBy?: "+createdAt" | "-createdAt";
    isActive?: boolean;
};

async function listViews(params: ListViewsParams = {}): Promise<ListViewsResponse> {
    const searchParams = new URLSearchParams();
    if (params.page !== undefined) searchParams.set("page", String(params.page));
    if (params.pageSize !== undefined) searchParams.set("pageSize", String(params.pageSize));
    if (params.orderBy !== undefined) searchParams.set("orderBy", params.orderBy);
    if (params.isActive !== undefined) searchParams.set("isActive", String(params.isActive));
    const response = await fetch(`/api/views?${searchParams.toString()}`);

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error ?? "Failed to fetch views");
    }

    const parsedResponse = listViewsResponseSchema.safeParse(await response.json());
    if (!parsedResponse.success) {
        throw new Error("Failed to parse views response");
    }

    return parsedResponse.data;
}

export function getUseListQueryOptions(params: ListViewsParams = {}) {
    return {
        queryKey: ["views", params],
        queryFn: () => listViews(params),
    };
}
