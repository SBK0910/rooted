import { z } from "zod";

export const insertGroupNodeSchema = z.object({
    title: z.string().trim().min(1),
    description: z.string().optional(),
    parentId: z.string().uuid().optional(),
});

export const insertLeafNodeSchema = insertGroupNodeSchema.extend({
    weight: z.number().int().positive().optional(),
    scheduledDate: z.string().date(),
})

export const graphNodesQuerySchema = z.object({
    scheduledDate: z.string().date().optional(),
});

export type InsertGroupNodeInput = z.infer<typeof insertGroupNodeSchema>;
export type InsertLeafNodeInput = z.infer<typeof insertLeafNodeSchema>;
export type GraphNodesQuery= z.infer<typeof graphNodesQuerySchema>;