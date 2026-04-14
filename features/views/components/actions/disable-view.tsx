import { Button } from "@/components/ui/button";
import { useDisableViewMutation } from "../../react-query/disable-view";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "@/components/ui/alert-dialog";
import { ViewRecord } from "../../react-query/create-view";

interface DisableViewProps {
    view: Pick<ViewRecord, "id" | "title">;
}

export default function DisableView({ view }: DisableViewProps) {
    const disableView = useDisableViewMutation();

    const [open, setOpen] = useState(false);

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                className="size-6 shrink-0 cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={(e) => { e.stopPropagation(); setOpen(true); }}
                disabled={disableView.isPending}
                aria-label="Delete view"
            >
                <Trash2 className="size-4" />
            </Button>
            <AlertDialog open={open} onOpenChange={setOpen}>
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
    )

}