export type BaseNode = {
    id: string;
    parentId: string | null;
    title: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
};

export type TaskNode = BaseNode & {
    type: "leaf";
    completed: boolean;
    weight: number;
};

export type GroupNode = BaseNode & {
    type: "group";
};

export type GraphNode = TaskNode | GroupNode;

export type TreeNode = GraphNode & {
    children: TreeNode[];
};

export class TaskEngine {
    buildTree(nodes: GraphNode[]): TreeNode[] {
        const nodeById = new Map<string, TreeNode>();

        for (const node of nodes) {
            if (nodeById.has(node.id)) {
                throw new Error(`Duplicate node id: ${node.id}`);
            }

            nodeById.set(node.id, {
                ...node,
                children: [],
            });
        }

        const roots: TreeNode[] = [];

        for (const node of nodes) {
            const current = nodeById.get(node.id)!;

            if (!node.parentId) {
                roots.push(current);
                continue;
            }

            const parent = nodeById.get(node.parentId);

            if (!parent) {
                throw new Error(`Parent not found: ${node.parentId}`);
            }

            if (parent.type !== "group") {
                throw new Error(`Parent ${parent.id} is not a group`);
            }

            parent.children.push(current);
        }

        return roots;
    }
}