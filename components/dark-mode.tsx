"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DarkMode() {
    const { resolvedTheme, setTheme } = useTheme();

    // resolvedTheme is undefined before hydration — render disabled placeholder
    if (!resolvedTheme) {
        return <Button variant="ghost" size="icon" disabled aria-label="Toggle theme" />;
    }

    const isDark = resolvedTheme === "dark";

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label="Toggle theme"
        >
            {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>
    );
}
