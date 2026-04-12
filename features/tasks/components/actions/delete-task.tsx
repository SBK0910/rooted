"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDeleteTaskMutation } from "@/features/tasks/react-query/delete-task";

type DeleteTaskProps = {
    taskId: string;
    scheduledDate: string;
};

export default function DeleteTask({ taskId, scheduledDate }: DeleteTaskProps) {
    const deleteTask = useDeleteTaskMutation(scheduledDate);
    const today = new Date().toISOString().slice(0, 10);
    const isPastDate = scheduledDate < today;

    return (
        <Button
            variant="destructive"
            size="icon"
            disabled={isPastDate || deleteTask.isPending}
            onClick={() => deleteTask.mutate(taskId)}
            aria-label="Delete task"
        >
            <Trash2 className="size-4" />
        </Button>
    );
}
