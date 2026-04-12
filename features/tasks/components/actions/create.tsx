"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { CreateTaskForm } from "@/features/tasks/components/forms/create-task-form";
import { CreateViewForm } from "@/features/views/components/forms/create-view-form";

type CreateProps = {
    scheduledDate: string;
};

export default function Create({ scheduledDate }: CreateProps) {
    const [open, setOpen] = useState(false);
    const [isView, setIsView] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="icon" className="fixed bottom-6 right-6 size-10 rounded-full shadow-lg">
                    <Plus className="size-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="flex max-h-[90dvh] flex-col sm:max-w-md">
                <DialogHeader className="shrink-0">
                    <div className="flex items-center justify-between pr-8">
                        <DialogTitle>{isView ? "New view" : "New task"}</DialogTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Task</span>
                            <Switch
                                checked={isView}
                                onCheckedChange={setIsView}
                                aria-label="Toggle between task and view"
                            />
                            <span>View</span>
                        </div>
                    </div>
                </DialogHeader>

                {isView ? (
                    <div className="min-h-0 overflow-y-auto">
                        <CreateViewForm onSuccess={() => setOpen(false)} />
                    </div>
                ) : (
                    <div className="min-h-0 overflow-y-auto">
                        <CreateTaskForm
                            scheduledDate={scheduledDate}
                            onSuccess={() => setOpen(false)}
                        />
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
