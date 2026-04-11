"use client";

import { useState } from "react";
import { TaskCalendar } from "./task-calendar";

type TasksViewProps = {
    initialDate: string;
};

export function TasksView({ initialDate }: TasksViewProps) {
    const [selectedDate, setSelectedDate] = useState(initialDate);

    return (
        <>
            <TaskCalendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

            {/* Task tree placeholder */}
            <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-xl border border-dashed py-20 text-center">
                <div className="flex size-14 items-center justify-center rounded-full bg-muted">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-muted-foreground"
                    >
                        <rect x="16" y="16" width="6" height="6" rx="1" />
                        <rect x="2" y="16" width="6" height="6" rx="1" />
                        <rect x="9" y="2" width="6" height="6" rx="1" />
                        <path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" />
                        <path d="M12 12V8" />
                    </svg>
                </div>
                <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">Task tree coming next</p>
                    <p className="max-w-xs text-sm text-muted-foreground">
                        Tree rendering components will be wired up in the next step.
                    </p>
                </div>
            </div>
        </>
    );
}
