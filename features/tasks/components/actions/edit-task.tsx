"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { EditTaskForm } from "../forms/edit-task-form";
import type { TaskRecord } from "@/features/tasks/contracts/task.contract";

type EditTaskProps = {
    task: TaskRecord;
    className?: string;
};

export default function EditTask({ task, className }: EditTaskProps) {
    const [open, setOpen] = useState(false);
    const today = new Date().toLocaleDateString("en-CA");
    const isPastDate = task.scheduledDate < today;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    disabled={isPastDate}
                    className={cn(
                        isPastDate && "pointer-events-none opacity-30",
                        className
                    )}
                    aria-label="Edit task"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Pencil className="h-3 w-3" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit task</DialogTitle>
                </DialogHeader>
                <EditTaskForm task={task} onSuccess={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    );
}
