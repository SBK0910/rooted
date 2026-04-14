"use client";

import { useState } from "react";
import { LayoutList, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EditView } from "@/features/views/components/actions/edit-view";
import { useDisableViewMutation } from "@/features/views/react-query/disable-view";
import type { ViewRecord } from "@/features/views/contracts/view.contract";

interface ViewItemProps {
    view: ViewRecord;
}

export function ViewItem({ view }: ViewItemProps) {
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const disableView = useDisableViewMutation();

    return (
        <>
            <div className="group flex items-center gap-2.5 rounded-md px-2 py-1.5 hover:bg-accent transition-colors">
                {/* Icon */}
                <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <LayoutList className="size-3.5" />
                </div>

                {/* Text */}
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium leading-tight">{view.title}</p>
                    {view.description && (
                        <p className="truncate text-xs text-muted-foreground leading-tight mt-0.5">
                            {view.description}
                        </p>
                    )}
                </div>

                {view.isActive && (
                    <span className="size-1.5 shrink-0 rounded-full bg-primary" />
                )}

                <div className="flex items-center gap-0.5">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-6 shrink-0 cursor-pointer"
                        onClick={(e) => { e.stopPropagation(); setEditOpen(true); }}
                        aria-label="Edit view"
                    >
                        <Pencil className="size-4" />
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-6 shrink-0 cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => { e.stopPropagation(); setDeleteOpen(true); }}
                        disabled={disableView.isPending}
                        aria-label="Delete view"
                    >
                        <Trash2 className="size-4" />
                    </Button>
                </div>
            </div>

            <EditView view={view} open={editOpen} onOpenChange={setEditOpen} />

            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete &ldquo;{view.title}&rdquo;?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This view will be removed. Any tasks assigned to it will remain unaffected.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
                            onClick={() => disableView.mutate(view.id)}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}