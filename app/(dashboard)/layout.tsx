import Link from "next/link";
import { Button } from "@/components/ui/button";
import Profile from "@/components/profile";
import DarkMode from "@/components/dark-mode";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative flex h-screen flex-col overflow-hidden">
            <div className="pointer-events-none absolute inset-x-0 top-14 z-0 h-96 overflow-hidden text-foreground opacity-[0.1] dark:opacity-[0.1] mask-[linear-gradient(to_bottom,white,transparent)]">
                <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid-pattern" width="32" height="32" patternUnits="userSpaceOnUse" x="50%" y="0" patternTransform="translate(0 0)">
                            <path d="M0 32V.5H32" fill="none" stroke="currentColor" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid-pattern)" />
                </svg>
            </div>

            <header className="sticky top-0 z-10 border-b bg-transparent">
                <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6 sm:px-10 bg-transparent">
                    <Link href="/" className="font-semibold tracking-tight">
                        Rooted
                    </Link>
                    <div className="flex items-center gap-1">
                        <Button variant="secondary" size="default" asChild>
                            <Link href="/tasks">Tasks</Link>
                        </Button>
                        <DarkMode />
                        <Profile />
                    </div>
                </nav>
            </header>
            {children}
        </div>
    );
}
