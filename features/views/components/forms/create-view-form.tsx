"use client";

import { useForm, Controller } from "react-hook-form";
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
import { createViewSchema } from "@/features/views/contracts/view.contract";
import { useCreateViewMutation } from "@/features/views/react-query/create-view";
import { ViewCombobox } from "@/features/views/components/view-combobox";

type CreateViewFormValues = z.infer<typeof createViewSchema>;

type CreateViewFormProps = {
    parentId?: string | null;
    onSuccess?: () => void;
};

export function CreateViewForm({ parentId, onSuccess }: CreateViewFormProps) {
    const createView = useCreateViewMutation();

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<CreateViewFormValues>({
        resolver: zodResolver(createViewSchema),
        defaultValues: {
            parentId: parentId ?? null,
        },
    });

    async function onSubmit(values: CreateViewFormValues) {
        await createView.mutateAsync(values);
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

                <Field data-invalid={!!errors.parentId}>
                    <FieldTitle>Parent view</FieldTitle>
                    <Controller
                        name="parentId"
                        control={control}
                        render={({ field }) => (
                            <ViewCombobox
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />
                    {errors.parentId && (
                        <FieldDescription className="text-destructive">
                            {errors.parentId.message}
                        </FieldDescription>
                    )}
                </Field>
            </FieldGroup>

            <Button type="submit" disabled={createView.isPending} className="w-full">
                {createView.isPending ? "Creating…" : "Create view"}
            </Button>
        </form>
    );
}
