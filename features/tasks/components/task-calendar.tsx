"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

type TaskCalendarProps = {
    selectedDate: string;
    setSelectedDate: (date: string) => void;
};

function toISODateString(date: Date): string {
    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
    ].join("-");
}

function getTodayDateString(): string {
    return toISODateString(new Date());
}

export function TaskCalendar({ selectedDate, setSelectedDate }: TaskCalendarProps) {
    const today = getTodayDateString();

    // Week strip offset — only changes via arrows
    const [weekOffset, setWeekOffset] = useState(0);

    // Build the 7-day window aligned to Monday of the current offset week
    const stripStart = new Date();
    stripStart.setDate(stripStart.getDate() + weekOffset * 7);
    const dow = stripStart.getDay();
    stripStart.setDate(stripStart.getDate() + (dow === 0 ? -6 : 1 - dow));

    const weekDays = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(stripStart);
        d.setDate(d.getDate() + i);
        return d;
    });

    return (
        <div className="flex items-end gap-1">
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setWeekOffset((o) => o - 1)}
                className="size-7 shrink-0 self-center"
                aria-label="Previous week"
            >
                <ChevronLeftIcon className="size-4" />
            </Button>

            {weekDays.map((day) => {
                const dateStr = toISODateString(day);
                const isSelected = dateStr === selectedDate;
                const isToday = dateStr === today;

                return (
                    <Button
                        key={dateStr}
                        variant={isSelected ? "default" : "ghost"}
                        onClick={() => setSelectedDate(dateStr)}
                        className={cn(
                            "h-auto min-w-10 flex-1 flex-col items-center gap-1 rounded-lg px-0 py-2 text-center",
                            !isSelected && "hover:bg-muted"
                        )}
                    >
                        <span className="text-[0.65rem] font-medium uppercase tracking-wide opacity-70">
                            {day.toLocaleDateString("en-US", { weekday: "short" })}
                        </span>
                        <span
                            className={cn(
                                "flex size-7 items-center justify-center rounded-full text-sm font-semibold",
                                isToday && !isSelected && "ring-1 ring-primary"
                            )}
                        >
                            {day.getDate()}
                        </span>
                    </Button>
                );
            })}

            <Button
                variant="ghost"
                size="icon"
                onClick={() => setWeekOffset((o) => o + 1)}
                className="size-7 shrink-0 self-center"
                aria-label="Next week"
            >
                <ChevronRightIcon className="size-4" />
            </Button>
        </div>
    );
}
