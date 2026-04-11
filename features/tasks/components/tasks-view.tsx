"use client";

import { useState } from "react";
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
        </>
    );
}
