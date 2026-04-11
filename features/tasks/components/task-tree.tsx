"use client";

import { Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";

import type { ViewTreeNode, TaskRecord } from "@/features/tasks/contracts/task.contract";

type TaskTreeProps = {
    tree: ViewTreeNode[];
    unassignedTasks: TaskRecord[];
};

function TaskRow({ task }: { task: TaskRecord }) {
    return (
        <RadioGroup
            value={task.completed ? task.id : undefined}
            className={cn(
                "group flex w-full flex-row items-center gap-3 rounded-lg px-3 py-2 hover:bg-muted/50",
                task.completed && "opacity-50"
            )}
        >
            <RadioGroupItem value={task.id} id={task.id} disabled />
            <label
                htmlFor={task.id}
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
            <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100"
                onClick={(e) => e.stopPropagation()}
            >
                <Pencil className="h-3 w-3" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 hover:text-destructive"
                onClick={(e) => e.stopPropagation()}
            >
                <Trash2 className="h-3 w-3" />
            </Button>
        </RadioGroup>
    );
}

function ViewNode({ node, depth = 0 }: { node: ViewTreeNode; depth?: number }) {
    return (
        <AccordionItem value={node.id} className="group/view relative border-none">
            <AccordionTrigger
                className={cn(
                    "rounded-lg px-3 py-2 pr-14 hover:bg-muted/50 hover:no-underline",
                    depth > 0 && "font-normal"
                )}
            >
                <span className={cn("text-sm", depth === 0 ? "font-medium" : "font-normal")}>
                    {node.title}
                </span>
            </AccordionTrigger>
            <Button
                variant="ghost"
                size="icon"
                className="absolute right-7 top-1 h-6 w-6 opacity-0 group-hover/view:opacity-100"
                onClick={(e) => e.stopPropagation()}
            >
                <Pencil className="h-3 w-3" />
            </Button>
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


