"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldTitle,
    FieldDescription,
} from "@/components/ui/field";
import { updateViewSchema } from "@/features/views/contracts/view.contract";
import { useUpdateViewMutation } from "@/features/views/react-query/update-view";
import type { ViewTreeNode } from "@/features/tasks/contracts/task.contract";

type EditViewFormValues = z.infer<typeof updateViewSchema>;

type EditViewFormProps = {
    view: ViewTreeNode;
    onSuccess?: () => void;
};

export function EditViewForm({ view, onSuccess }: EditViewFormProps) {
    const updateView = useUpdateViewMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<EditViewFormValues>({
        resolver: zodResolver(updateViewSchema),
        defaultValues: {
            title: view.title,
            description: view.description ?? undefined,
        },
    });

    async function onSubmit(values: EditViewFormValues) {
        await updateView.mutateAsync({ id: view.id, input: values });
        onSuccess?.();
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <FieldGroup>
                <Field data-invalid={!!errors.title}>
                    <FieldLabel>
                        <FieldTitle>
                            Name <span className="text-destructive">*</span>
                        </FieldTitle>
                        <Input
                            {...register("title")}
                            placeholder="e.g. Work, Personal…"
                            autoFocus
                        />
                    </FieldLabel>
                    {errors.title && (
                        <FieldDescription className="text-destructive">
                            {errors.title.message}
                        </FieldDescription>
                    )}
                </Field>

                <Field data-invalid={!!errors.description}>
                    <FieldLabel>
                        <FieldTitle>Description</FieldTitle>
                        <Textarea
                            {...register("description")}
                            placeholder="Optional description…"
                            rows={3}
                        />
                    </FieldLabel>
                    {errors.description && (
                        <FieldDescription className="text-destructive">
                            {errors.description.message}
                        </FieldDescription>
                    )}
                </Field>
            </FieldGroup>

            <Button type="submit" disabled={updateView.isPending} className="w-full">
                {updateView.isPending ? "Saving…" : "Save changes"}
            </Button>
        </form>
    );
}
