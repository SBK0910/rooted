"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { EditViewForm } from "@/features/views/components/forms/edit-view-form";
import { Pencil } from "lucide-react";
import type { ViewRecord } from "@/features/views/react-query/create-view";
import { useState } from "react";

type EditViewProps = {
    view: ViewRecord;
};

export function EditView({ view }: EditViewProps) {

    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-6 shrink-0 cursor-pointer"
                    aria-label="Edit view"
                >
                    <Pencil className="size-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit view</DialogTitle>
                </DialogHeader>
                <EditViewForm
                    view={{
                        id: view.id,
                        title: view.title,
                        description: view.description,
                        parentId: view.parentId,
                    }}
                    onSuccess={() => { setOpen(false) }}
                />
            </DialogContent>
        </Dialog>
    );
}
