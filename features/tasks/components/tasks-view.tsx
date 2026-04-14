"use client";

import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { TaskCalendar } from "./task-calendar";
import { TaskTreeSkeleton } from "./task-tree-skeleton";
import CreateTask from "./actions/create-task";
import ErrorFallback from "@/components/error-fallback";
import { TaskTree } from "./task-tree";

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
                    <ErrorBoundary onReset={reset} fallbackRender={({ error, resetErrorBoundary }) => <ErrorFallback error={error} resetErrorBoundary={resetErrorBoundary} message="Failed to load Tasks" />}>
                        <Suspense fallback={<TaskTreeSkeleton />}>
                            <TaskTree selectedDate={selectedDate}/>
                        </Suspense>
                    </ErrorBoundary>
                )}
            </QueryErrorResetBoundary>
            <CreateTask scheduledDate={selectedDate} />
        </>
    );
}
