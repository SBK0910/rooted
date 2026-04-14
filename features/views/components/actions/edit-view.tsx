"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { EditViewForm } from "@/features/views/components/forms/edit-view-form";
import type { ViewRecord } from "@/features/views/react-query/create-view";

type EditViewProps = {
    view: ViewRecord;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function EditView({ view, open, onOpenChange }: EditViewProps) {

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
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
                    onSuccess={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
}
