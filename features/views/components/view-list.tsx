"use client";

import { useState } from "react";
import { LayoutList, Loader2 } from "lucide-react";
import { useListViewsQuery } from "@/features/views/react-query/list-views";
import { EditView } from "@/features/views/components/actions/edit-view";
import type { ViewRecord } from "@/features/views/react-query/create-view";

type ViewListProps = {
    search?: string;
};

export function ViewList({ search = "" }: ViewListProps) {
    const { data, isLoading, isError } = useListViewsQuery({ pageSize: 100 });
    const [editing, setEditing] = useState<ViewRecord | null>(null);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
            </div>
        );
    }

    if (isError) {
        return (
            <p className="py-4 text-center text-sm text-destructive">
                Failed to load views.
            </p>
        );
    }

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
        <>
            <ul className="flex flex-col gap-1">
                {views.map((view) => (
                    <li key={view.id}>
                        <button
                            onClick={() => setEditing(view)}
                            className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                            <span className="truncate font-medium">{view.title}</span>
                            {view.description && (
                                <span className="block truncate text-xs text-muted-foreground">
                                    {view.description}
                                </span>
                            )}
                        </button>
                    </li>
                ))}
            </ul>

            {editing && (
                <EditView
                    view={editing}
                    open={true}
                    onOpenChange={(open) => { if (!open) setEditing(null); }}
                />
            )}
        </>
    );
}
