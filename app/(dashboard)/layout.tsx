import Link from "next/link";
import { Button } from "@/components/ui/button";
import Profile from "@/components/profile";
import DarkMode from "@/components/dark-mode";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen flex-col overflow-hidden">
            <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
                <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6 sm:px-10">
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
