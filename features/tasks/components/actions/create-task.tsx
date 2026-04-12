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
import { CreateTaskForm } from "../forms/create-task-form";

type CreateTaskProps = {
    scheduledDate: string;
};

export default function CreateTask({ scheduledDate }: CreateTaskProps) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="icon" className="fixed bottom-6 right-6 size-10 rounded-full shadow-lg">
                    <Plus className="size-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>New task</DialogTitle>
                </DialogHeader>
                <CreateTaskForm
                    scheduledDate={scheduledDate}
                    onSuccess={() => setOpen(false)}
                />
            </DialogContent>
        </Dialog>
    );
}
