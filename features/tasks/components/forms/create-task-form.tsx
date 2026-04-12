"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldTitle,
    FieldDescription,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { createTaskSchema } from "@/features/tasks/contracts/task.contract";

type CreateTaskFormValues = z.infer<typeof createTaskSchema>;

type CreateTaskFormProps = {
    scheduledDate: string;
    onSuccess?: () => void;
};

export function CreateTaskForm({ scheduledDate, onSuccess }: CreateTaskFormProps) {
    const [calendarOpen, setCalendarOpen] = useState(false);

    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<CreateTaskFormValues>({
        resolver: zodResolver(createTaskSchema),
        defaultValues: {
            scheduledDate,
            weight: 1,
        },
    });

    async function onSubmit(values: CreateTaskFormValues) {
        const response = await fetch("/api/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error ?? "Failed to create task");
        }

        onSuccess?.();
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <FieldGroup>
                <Field data-invalid={!!errors.title}>
                    <FieldLabel>
                        <FieldTitle>
                            Title <span className="text-destructive">*</span>
                        </FieldTitle>
                        <Input
                            {...register("title")}
                            placeholder="What needs to be done?"
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
                            placeholder="Optional details…"
                            rows={3}
                        />
                    </FieldLabel>
                    {errors.description && (
                        <FieldDescription className="text-destructive">
                            {errors.description.message}
                        </FieldDescription>
                    )}
                </Field>

                <Field data-invalid={!!errors.weight}>
                    <FieldLabel>
                        <FieldTitle>Weight</FieldTitle>
                        <Input
                            {...register("weight", { valueAsNumber: true })}
                            type="number"
                            min={1}
                            placeholder="1"
                        />
                    </FieldLabel>
                    <FieldDescription>
                        How much effort this task takes relative to others.
                    </FieldDescription>
                    {errors.weight && (
                        <FieldDescription className="text-destructive">
                            {errors.weight.message}
                        </FieldDescription>
                    )}
                </Field>

                <Field data-invalid={!!errors.scheduledDate}>
                    <FieldTitle>
                        Date <span className="text-destructive">*</span>
                    </FieldTitle>
                    <Controller
                        control={control}
                        name="scheduledDate"
                        render={({ field }) => (
                            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {field.value
                                            ? format(parseISO(field.value), "PPP")
                                            : "Pick a date"}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value ? parseISO(field.value) : undefined}
                                        onSelect={(date) => {
                                            field.onChange(date ? format(date, "yyyy-MM-dd") : "");
                                            setCalendarOpen(false);
                                        }}
                                        disabled={(date) =>
                                            date < new Date(new Date().setHours(0, 0, 0, 0))
                                        }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        )}
                    />
                    {errors.scheduledDate && (
                        <FieldDescription className="text-destructive">
                            {errors.scheduledDate.message}
                        </FieldDescription>
                    )}
                </Field>
            </FieldGroup>

            <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Creating…" : "Create task"}
            </Button>
        </form>
    );
}



