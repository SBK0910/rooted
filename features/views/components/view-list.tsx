"use client";

import { LayoutList } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getUseListQueryOptions } from "../react-query/list-views";
import DisableView from "./actions/disable-view";
import { EditView } from "./actions/edit-view";

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
                    <>
                        <div className="group flex items-center gap-2.5 rounded-md px-2 py-1.5 hover:bg-accent transition-colors">
                            {/* Icon */}
                            <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                                <LayoutList className="size-3.5" />
                            </div>

                            {/* Text */}
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium leading-tight">{view.title}</p>
                                {view.description && (
                                    <p className="truncate text-xs text-muted-foreground leading-tight mt-0.5">
                                        {view.description}
                                    </p>
                                )}
                            </div>

                            {view.isActive && (
                                <span className="size-1.5 shrink-0 rounded-full bg-primary" />
                            )}

                            <div className="flex items-center gap-0.5">
                                <EditView view={{id: view.id, title: view.title, description: view.description, parentId: view.parentId}} />
                                <DisableView view={{ id: view.id, title: view.title }} />
                            </div>
                        </div>
                    </>
                </li>
            ))}
        </ul>
    );
}
