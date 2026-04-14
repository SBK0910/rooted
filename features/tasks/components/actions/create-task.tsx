"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { CreateTaskForm } from "@/features/tasks/components/forms/create-task-form";

type CreateProps = {
    scheduledDate: string;
};

export default function CreateTask({ scheduledDate }: CreateProps) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="icon" className="fixed bottom-6 right-6 size-10 rounded-full shadow-lg cursor-pointer">
                    <Plus className="size-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="flex max-h-[90dvh] flex-col sm:max-w-md">
                <DialogHeader className="shrink-0">
                        <DialogTitle>Task</DialogTitle>
                </DialogHeader>
                <div className="min-h-0 overflow-y-auto">
                    <CreateTaskForm
                        scheduledDate={scheduledDate}
                        onSuccess={() => setOpen(false)}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
