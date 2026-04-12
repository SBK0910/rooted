"use client";

import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { TaskCalendar } from "./task-calendar";
import { TaskTreeLoader } from "./task-tree-loader";
import { TaskTreeSkeleton } from "./task-tree-skeleton";
import { TaskTreeError } from "./task-tree-error";
import Create from "./actions/create";

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
            <Create scheduledDate={selectedDate} />
        </>
    );
}
