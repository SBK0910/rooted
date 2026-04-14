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
    // EditViewForm only reads id, title, description — spread missing tree fields
    const viewNode = { ...view, children: [], tasks: [] };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit view</DialogTitle>
                </DialogHeader>
                <EditViewForm
                    view={viewNode}
                    onSuccess={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
}
