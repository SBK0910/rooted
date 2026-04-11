import { z } from "zod";

export const listViewsQuerySchema = z.object({
    page: z.coerce
        .number()
        .int({ message: "Page must be an integer", })
        .min(1, { message: "Page must be at least 1" })
        .default(1),
    pageSize: z.coerce
        .number()
        .int({ message: "PageSize must be an integer", })
        .min(1, { message: "PageSize must be at least 1" })
        .max(100, { message: "PageSize cannot exceed 100" })
        .default(10),
    orderBy: z
        .string()
        .regex(/^[+-]createdAt$/, "orderBy must be +createdAt or -createdAt")
        .default("-createdAt"),
});

export const createViewSchema = z.object({
    title: z
        .string({ message: "Title must be a string" })
        .trim()
        .min(1, { message: "Title must be at least 1 character" }),
    description: z
        .string({ message: "Description must be a string" })
        .optional(),
    parentId: z
        .uuid({ message: "ParentId must be a valid UUID" })
        .optional()
        .nullable(),
});

export const updateViewSchema = z
    .object({
        title: z
            .string({ message: "Title must be a string" })
            .trim()
            .min(1, { message: "Title must be at least 1 character" })
            .optional(),
        description: z
            .string({ message: "Description must be a string" })
            .optional(),
        parentId: z
            .uuid({ message: "ParentId must be a valid UUID" })
            .optional()
            .nullable(),
    })
    .refine((payload) => Object.keys(payload).length > 0, {
        message: "At least one field must be provided",
    });

export const viewIdParamSchema = z.object({
    id: z.uuid({ message: "Invalid view ID" }),
});

export type ListViewsQuery = z.infer<typeof listViewsQuerySchema>;
export type CreateViewInput = z.infer<typeof createViewSchema>;
export type UpdateViewInput = z.infer<typeof updateViewSchema>;
export type ViewIdParam = z.infer<typeof viewIdParamSchema>;
