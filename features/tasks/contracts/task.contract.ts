import { z } from "zod";

export const listTasksQuerySchema = z.object({
    page: z.coerce
        .number()
        .int({ message: "Page must be an integer" })
        .min(1, { message: "Page must be at least 1" })
        .default(1),
    pageSize: z.coerce
        .number()
        .int({ message: "PageSize must be an integer" })
        .min(1, { message: "PageSize must be at least 1" })
        .max(100, { message: "PageSize cannot exceed 100" })
        .default(10),
    orderBy: z
        .string()
        .regex(/^[+-]createdAt$/, "orderBy must be +createdAt or -createdAt")
        .default("-createdAt"),
    viewId: z
        .uuid({ message: "ViewId must be a valid UUID" })
        .optional(),
    scheduledDate: z
        .iso.date({ message: "ScheduledDate must be a valid date string" })
        .optional(),
});

export const taskTreeQuerySchema = z.object({
    scheduledDate: z
        .iso.date({ message: "ScheduledDate must be a valid date string" }),
});

export const createTaskSchema = z.object({
    title: z
        .string({ message: "Title must be a string" })
        .trim()
        .min(1, { message: "Title must be at least 1 character" }),
    description: z
        .string({ message: "Description must be a string" })
        .optional(),
    weight: z
        .number({ message: "Weight must be a number" })
        .int({ message: "Weight must be an integer" })
        .min(1, { message: "Weight must be at least 1" })
        .optional(),
    scheduledDate: z
        .iso.date({ message: "ScheduledDate must be a valid date string" }),
    viewId: z
        .uuid({ message: "ViewId must be a valid UUID" })
        .optional()
        .nullable(),
});

export const updateTaskSchema = z
    .object({
        title: z
            .string({ message: "Title must be a string" })
            .trim()
            .min(1, { message: "Title must be at least 1 character" })
            .optional(),
        description: z
            .string({ message: "Description must be a string" })
            .optional(),
        completed: z.boolean().optional(),
        weight: z
            .number({ message: "Weight must be a number" })
            .int({ message: "Weight must be an integer" })
            .min(1, { message: "Weight must be at least 1" })
            .optional(),
        scheduledDate: z
            .iso.date({ message: "ScheduledDate must be a valid date string" })
            .optional(),
        viewId: z
            .uuid({ message: "ViewId must be a valid UUID" })
            .optional()
            .nullable(),
    })
    .refine((payload) => Object.keys(payload).length > 0, {
        message: "At least one field must be provided",
    });

export const taskIdParamSchema = z.object({
    id: z.uuid({ message: "Invalid task ID" }),
});

export const taskRecordSchema = z.object({
    id: z.uuid(),
    title: z.string(),
    description: z.string().nullable(),
    completed: z.boolean(),
    weight: z.number().int(),
    createdAt: z.string(),
    updatedAt: z.string(),
    scheduledDate: z.string(),
    viewId: z.uuid().nullable(),
    seriesId: z.uuid().nullable(),
});

type ViewTreeNodeType = {
    id: string;
    title: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
    parentId: string | null;
    children: ViewTreeNodeType[];
    tasks: z.infer<typeof taskRecordSchema>[];
};

const viewTreeNodeSchema: z.ZodType<ViewTreeNodeType> = z.lazy(() =>
    z.object({
        id: z.uuid(),
        title: z.string(),
        description: z.string().nullable(),
        createdAt: z.string(),
        updatedAt: z.string(),
        isActive: z.boolean(),
        parentId: z.uuid().nullable(),
        children: z.array(viewTreeNodeSchema),
        tasks: z.array(taskRecordSchema),
    })
);

export const taskTreeResponseSchema = z.object({
    scheduledDate: z.iso.date(),
    tree: z.array(viewTreeNodeSchema),
    unassignedTasks: z.array(taskRecordSchema),
});

export type TaskRecord = z.infer<typeof taskRecordSchema>;
export type ViewTreeNode = ViewTreeNodeType;
export type TaskTreeResponse = z.infer<typeof taskTreeResponseSchema>;

export type ListTasksQuery = z.infer<typeof listTasksQuerySchema>;
export type TaskTreeQuery = z.infer<typeof taskTreeQuerySchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskIdParam = z.infer<typeof taskIdParamSchema>;
