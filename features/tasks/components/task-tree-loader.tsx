"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { getFetchTaskTreeQueryOptions } from "../react-query/fetch-tree";
import { TaskTree } from "./task-tree";

export function TaskTreeLoader({ selectedDate }: { selectedDate: string }) {
    const { data } = useSuspenseQuery(getFetchTaskTreeQueryOptions(selectedDate));

    return <TaskTree tree={data.tree} unassignedTasks={data.unassignedTasks} />;
}
