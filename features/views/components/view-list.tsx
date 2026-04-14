"use client";

import { LayoutList } from "lucide-react";
import { ViewItem } from "@/features/views/components/view-item";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getUseListQueryOptions } from "../react-query/list-views";

type ViewListProps = {
    search?: string;
};

export function ViewList({ search = "" }: ViewListProps) {
    const { data } = useSuspenseQuery({
        ...getUseListQueryOptions({ pageSize: 100 }),
    })

    const query = search.trim().toLowerCase();
    const views = (data?.data ?? []).filter(
        (v) =>
            !query ||
            v.title.toLowerCase().includes(query) ||
            v.description?.toLowerCase().includes(query)
    );

    if (views.length === 0) {
        return (
            <div className="flex flex-col items-center gap-2 py-8 text-muted-foreground">
                <LayoutList className="size-6 opacity-40" />
                <p className="text-sm">{query ? "No matching views." : "No views yet."}</p>
            </div>
        );
    }

    return (
        <ul className="flex flex-col gap-0.5">
            {views.map((view) => (
                <li key={view.id}>
                    <ViewItem view={view} />
                </li>
            ))}
        </ul>
    );
}
