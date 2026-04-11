import { TaskRecord } from "@/db/schemas/task";
import { ViewRecord } from "@/db/schemas/view";

export type ViewTreeNode = ViewRecord & {
    children: ViewTreeNode[];
    tasks: TaskRecord[];
};

export type TaskTreePayload = {
    roots: ViewTreeNode[];
    unassignedTasks: TaskRecord[];
};

export function buildTaskTree(tasks: TaskRecord[], views: ViewRecord[]): TaskTreePayload {
    const viewById = new Map<string, ViewTreeNode>();

    for (const view of views) {
        viewById.set(view.id, {
            ...view,
            children: [],
            tasks: [],
        });
    }

    const unassignedTasks: TaskRecord[] = [];

    for (const task of tasks) {
        if (!task.viewId) {
            unassignedTasks.push(task);
            continue;
        }

        const view = viewById.get(task.viewId);
        if (!view) {
            unassignedTasks.push(task);
            continue;
        }

        view.tasks.push(task);
    }

    const roots: ViewTreeNode[] = [];

    for (const view of views) {
        const node = viewById.get(view.id)!;

        if (!node.parentId) {
            roots.push(node);
            continue;
        }

        const parent = viewById.get(node.parentId);
        if (!parent) {
            // Keep orphan nodes visible if parent is filtered out.
            roots.push(node);
            continue;
        }

        parent.children.push(node);
    }

    return {
        roots,
        unassignedTasks,
    };
}
