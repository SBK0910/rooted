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

export type ListTasksQuery = z.infer<typeof listTasksQuerySchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskIdParam = z.infer<typeof taskIdParamSchema>;
