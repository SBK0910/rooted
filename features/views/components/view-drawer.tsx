"use client";

import { PanelRight, Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { CreateView } from "@/features/views/components/actions/create-view";
import { ViewList } from "@/features/views/components/view-list";

export default function ViewDrawer() {
    const [search, setSearch] = useState("");

    return (
        <Sheet onOpenChange={(open) => { if (!open) setSearch(""); }}>
            <SheetTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="fixed right-4 top-17 z-20 shadow-sm"
                    aria-label="Open views"
                >
                    <PanelRight className="size-4" />
                </Button>
            </SheetTrigger>

            <SheetContent side="right" className="flex w-72 flex-col gap-0 p-0 sm:w-80">
                <SheetHeader className="px-4 py-4">
                    <SheetTitle>Views</SheetTitle>
                </SheetHeader>

                <Separator />

                <div className="px-3 py-2">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
                        <Input
                            placeholder="Search views..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-8 h-8 text-sm"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-3 py-2">
                    <ViewList search={search} />
                </div>

                <Separator />

                <div className="px-4 py-3">
                    <CreateView />
                </div>
            </SheetContent>
        </Sheet>
    );
}
