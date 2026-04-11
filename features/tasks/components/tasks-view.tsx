"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskCalendar } from "./task-calendar";
import { TaskTree } from "./task-tree";
import { dummyTaskTree } from "../fixtures/task-tree.fixture";

type TasksViewProps = {
    initialDate: string;
};

export function TasksView({ initialDate }: TasksViewProps) {
    const [selectedDate, setSelectedDate] = useState(initialDate);

    return (
        <>
            <TaskCalendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
            <TaskTree tree={dummyTaskTree.tree} unassignedTasks={dummyTaskTree.unassignedTasks} />
            <Button
                size="icon"
                className="fixed bottom-6 right-6 size-10 rounded-full shadow-lg"
            >
                <Plus className="size-4" />
            </Button>
        </>
    );
}
