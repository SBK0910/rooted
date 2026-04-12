"use client";

import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskCalendar } from "./task-calendar";
import { TaskTreeLoader } from "./task-tree-loader";
import { TaskTreeSkeleton } from "./task-tree-skeleton";
import { TaskTreeError } from "./task-tree-error";

type TasksViewProps = {
    initialDate: string;
};

export function TasksView({ initialDate }: TasksViewProps) {
    const [selectedDate, setSelectedDate] = useState(initialDate);

    return (
        <>
            <TaskCalendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
            <QueryErrorResetBoundary>
                {({ reset }) => (
                    <ErrorBoundary FallbackComponent={TaskTreeError} onReset={reset}>
                        <Suspense fallback={<TaskTreeSkeleton />}>
                            <TaskTreeLoader selectedDate={selectedDate} />
                        </Suspense>
                    </ErrorBoundary>
                )}
            </QueryErrorResetBoundary>
            <Button
                size="icon"
                className="fixed bottom-6 right-6 size-10 rounded-full shadow-lg"
            >
                <Plus className="size-4" />
            </Button>
        </>
    );
}
