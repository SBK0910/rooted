"use client";

import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Loader2, Search } from "lucide-react";
import { TaskCalendar } from "./task-calendar";
import { TaskTreeSkeleton } from "./task-tree-skeleton";
import CreateTask from "./actions/create-task";
import ErrorFallback from "@/components/error-fallback";
import { TaskTree } from "./task-tree";
import ViewDrawer from "@/features/views/components/view-drawer";
import { ViewList } from "@/features/views/components/view-list";
import { CreateView } from "@/features/views/components/actions/create-view";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

function formatDisplayDate(dateStr: string): string {
    return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

type TasksViewProps = {
    initialDate: string;
};

export function TasksView({ initialDate }: TasksViewProps) {
    const [selectedDate, setSelectedDate] = useState(initialDate);
    const [viewSearch, setViewSearch] = useState("");

    return (
        <div className="flex flex-1 min-h-0">
            {/* Inline views sidebar — lg+ only */}
            <aside className="hidden lg:flex w-60 xl:w-72 shrink-0 flex-col border-r">
                <div className="px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Views</p>
                </div>
                <Separator />
                <div className="px-3 py-2">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
                        <Input
                            placeholder="Search views..."
                            value={viewSearch}
                            onChange={(e) => setViewSearch(e.target.value)}
                            className="pl-8 h-8 text-sm"
                        />
                    </div>
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto p-1">
                    <QueryErrorResetBoundary>
                        {({ reset }) => (
                            <ErrorBoundary
                                onReset={reset}
                                fallbackRender={({ error, resetErrorBoundary }) => (
                                    <ErrorFallback error={error} resetErrorBoundary={resetErrorBoundary} message="Failed to load views" />
                                )}
                            >
                                <Suspense fallback={
                                    <div className="flex items-center justify-center py-10">
                                        <Loader2 className="size-5 animate-spin text-muted-foreground" />
                                    </div>
                                }>
                                    <ViewList search={viewSearch} />
                                </Suspense>
                            </ErrorBoundary>
                        )}
                    </QueryErrorResetBoundary>
                </div>
                <Separator />
                <div className="px-4 py-3">
                    <CreateView />
                </div>
            </aside>

            {/* Main tasks column */}
            <div className="flex flex-1 flex-col min-h-0">
                {/* Date header + calendar */}
                <div className="px-6 pt-5 pb-3 sm:px-8">
                    <div className="mb-3 flex items-start justify-between">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Daily View</p>
                            <h1 className="mt-0.5 text-xl font-semibold tracking-tight">
                                {formatDisplayDate(selectedDate)}
                            </h1>
                        </div>
                        {/* Views drawer — tablet/mobile only */}
                        <div className="lg:hidden">
                            <ViewDrawer inline />
                        </div>
                    </div>
                    <TaskCalendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
                </div>

                {/* Task tree — fills remaining height */}
                <div className="flex flex-1 min-h-0 flex-col px-6 pb-6 sm:px-8">
                    <QueryErrorResetBoundary>
                        {({ reset }) => (
                            <ErrorBoundary
                                onReset={reset}
                                fallbackRender={({ error, resetErrorBoundary }) => (
                                    <ErrorFallback error={error} resetErrorBoundary={resetErrorBoundary} message="Failed to load Tasks" />
                                )}
                            >
                                <Suspense fallback={<TaskTreeSkeleton />}>
                                    <TaskTree selectedDate={selectedDate} />
                                </Suspense>
                            </ErrorBoundary>
                        )}
                    </QueryErrorResetBoundary>
                </div>

                <CreateTask scheduledDate={selectedDate} />
            </div>
        </div>
    );
}
