"use client";

import { Suspense, useState } from "react";
import { ChevronsUpDownIcon, CheckIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { QueryErrorResetBoundary, useSuspenseQuery } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "@/components/error-fallback";
import { getUseListQueryOptions } from "../react-query/list-views";

type ViewComboboxProps = {
    value: string | null | undefined;
    onChange: (value: string | null) => void;
    disabled?: boolean;
};

type ViewComboboxContentProps = ViewComboboxProps & {
    open: boolean;
    setOpen: (open: boolean) => void;
};

function ViewComboboxContent({ value, onChange, disabled, open, setOpen }: ViewComboboxContentProps) {
    const { data } = useSuspenseQuery({
        ...getUseListQueryOptions({isActive: true, pageSize: 100}),
    })

    const views = data?.data ?? [];
    const selected = views.find((v) => v.id === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    disabled={disabled}
                    className={cn(
                        "w-full justify-between font-normal",
                        !selected && "text-muted-foreground"
                    )}
                >
                    {selected ? selected.title : "Select a view…"}
                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="start">
                <Command>
                    <CommandInput placeholder="Search views…" />
                    <CommandList>
                        <CommandEmpty>No views found.</CommandEmpty>
                        <CommandGroup className="p-1">
                            {value && (
                                <CommandItem
                                    value="__none__"
                                    onSelect={() => {
                                        onChange(null);
                                        setOpen(false);
                                    }}
                                    className="mb-1 text-muted-foreground"
                                >
                                    <CheckIcon className="mr-2 h-4 w-4 opacity-0" />
                                    None
                                </CommandItem>
                            )}
                            {views.map((view) => (
                                <CommandItem
                                    key={view.id}
                                    value={view.title}
                                    onSelect={() => {
                                        onChange(view.id === value ? null : view.id);
                                        setOpen(false);
                                    }}
                                    className="mb-0.5 last:mb-0"
                                >
                                    <CheckIcon
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === view.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {view.title}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

export function ViewCombobox({ value, onChange, disabled }: ViewComboboxProps) {
    const [open, setOpen] = useState(false);

    return (
        <QueryErrorResetBoundary>
            {({ reset }) => (
                <ErrorBoundary
                    onReset={reset}
                    fallbackRender={({ error, resetErrorBoundary }) => (
                        <ErrorFallback
                            error={error}
                            resetErrorBoundary={resetErrorBoundary}
                            message="Failed to load views"
                        />
                    )}
                >
                    <Suspense
                        fallback={
                            <Button
                                variant="outline"
                                disabled
                                className="w-full justify-between font-normal text-muted-foreground"
                            >
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Loading views…
                            </Button>
                        }
                    >
                        <ViewComboboxContent
                            value={value}
                            onChange={onChange}
                            disabled={disabled}
                            open={open}
                            setOpen={setOpen}
                        />
                    </Suspense>
                </ErrorBoundary>
            )}
        </QueryErrorResetBoundary>
    );
}
