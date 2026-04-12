"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { EditViewForm } from "@/features/views/components/forms/edit-view-form";

import type { ViewTreeNode, TaskRecord } from "@/features/tasks/contracts/task.contract";
import DeleteTask from "./actions/delete-task";
import EditTask from "./actions/edit-task";
import { useToggleTaskMutation } from "@/features/tasks/react-query/toggle-task";

type TaskTreeProps = {
    tree: ViewTreeNode[];
    unassignedTasks: TaskRecord[];
};

function TaskRow({ task }: { task: TaskRecord }) {
    const toggleTask = useToggleTaskMutation(task.scheduledDate);
    const isPastDate = task.scheduledDate < new Date().toLocaleDateString("en-CA");

    return (
        <div
            className={cn(
                "group flex w-full flex-row items-center gap-3 rounded-lg px-3 py-2 hover:bg-muted/50",
                task.completed && "opacity-50"
            )}
        >
            <Checkbox
                checked={task.completed}
                disabled={isPastDate || toggleTask.isPending}
                onCheckedChange={(checked) =>
                    toggleTask.mutate({ id: task.id, completed: checked === true })
                }
            />
            <label
                className={cn(
                    "flex-1 cursor-default text-sm",
                    task.completed && "line-through text-muted-foreground"
                )}
            >
                {task.title}
            </label>
            {task.weight > 1 && (
                <span className="shrink-0 rounded-full bg-muted px-1.5 py-0.5 text-[0.65rem] font-medium text-muted-foreground">
                    ×{task.weight}
                </span>
            )}
            <EditTask task={task} className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100" />
            <DeleteTask taskId={task.id} scheduledDate={task.scheduledDate} className="opacity-0 group-hover:opacity-100" />
        </div>
    );
}

function ViewNode({ node, depth = 0 }: { node: ViewTreeNode; depth?: number }) {
    const [editOpen, setEditOpen] = useState(false);

    return (
        <>
            <AccordionItem value={node.id} className="border-none">
                <AccordionPrimitive.Header className="flex">
                    <button
                        type="button"
                        onClick={() => setEditOpen(true)}
                        className={cn(
                            "flex-1 rounded-l-lg px-3 py-2 text-left text-sm hover:bg-muted/50",
                            depth === 0 ? "font-medium" : "font-normal"
                        )}
                    >
                        {node.title}
                    </button>
                    <AccordionPrimitive.Trigger className="group/chevron flex items-center rounded-r-lg px-3 py-2 hover:bg-muted/50 outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        <ChevronDownIcon className="h-4 w-4 text-muted-foreground group-aria-expanded/chevron:hidden" />
                        <ChevronUpIcon className="hidden h-4 w-4 text-muted-foreground group-aria-expanded/chevron:inline" />
                    </AccordionPrimitive.Trigger>
                </AccordionPrimitive.Header>
                <AccordionContent className="pb-0">
                    <div className="ml-5 space-y-0.5 border-l pl-4 pb-1">
                        {node.tasks.map((task) => (
                            <TaskRow key={task.id} task={task} />
                        ))}
                        {node.children.length > 0 && (
                            <Accordion type="multiple" defaultValue={node.children.map((c) => c.id)}>
                                {node.children.map((child) => (
                                    <ViewNode key={child.id} node={child} depth={depth + 1} />
                                ))}
                            </Accordion>
                        )}
                    </div>
                </AccordionContent>
            </AccordionItem>

            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit view</DialogTitle>
                    </DialogHeader>
                    <EditViewForm view={node} onSuccess={() => setEditOpen(false)} />
                </DialogContent>
            </Dialog>
        </>
    );
}

export function TaskTree({ tree, unassignedTasks }: TaskTreeProps) {
    if (tree.length === 0 && unassignedTasks.length === 0) {
        return (
            <Card className="flex flex-1 flex-col items-center justify-center py-20 text-center">
                <p className="text-sm font-medium text-muted-foreground">No tasks for this day</p>
            </Card>
        );
    }

    return (
        <Card className="flex min-h-0 flex-1 flex-col">
            <CardContent className="min-h-0 flex-1 overflow-y-auto p-3">
                <Accordion type="multiple" defaultValue={tree.map((n) => n.id)}>
                    {tree.map((node) => (
                        <ViewNode key={node.id} node={node} />
                    ))}
                </Accordion>

                {unassignedTasks.length > 0 && (
                    <div className="pt-1">
                        <p className="px-3 pb-1 pt-2 text-[0.65rem] font-medium uppercase tracking-wider text-muted-foreground">
                            Unassigned
                        </p>
                        {unassignedTasks.map((task) => (
                            <TaskRow key={task.id} task={task} />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}


