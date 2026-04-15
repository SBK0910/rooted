"use client";

import Link from "next/link";
import SignInGoogle from "@/components/sign-in/sign-in-google";
import { useSignIn } from "@clerk/nextjs";
import { toast } from "sonner";


function TreeIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <line x1="12" y1="22" x2="12" y2="11" />
            <path d="M12 16 C10 18 7 18 5 20" />
            <path d="M12 16 C14 18 17 18 19 20" />
            <path d="M12 19 C11 20.5 9.5 21 8 22" />
            <path d="M12 19 C13 20.5 14.5 21 16 22" />
            <path d="M12 11 C12 11 7 9 7 5 A5 5 0 0 1 17 5 C17 9 12 11 12 11Z" />
        </svg>
    );
}

export default function SignInPage() {
    const { signIn } = useSignIn();

    const handleGoogleSignIn = async () => {
        if (!signIn) return;
        try {
            const { error } = await signIn.sso({
                strategy: "oauth_google",
                redirectCallbackUrl: "/sign-in/callback",
                redirectUrl: "/tasks",
            });
            if (error) {
                toast.error(error.longMessage ?? error.message ?? "Failed to sign in with Google");
            }
        } catch {
            toast.error("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Nav */}
            <nav className="sticky top-0 z-10 border-b border-slate-100 bg-white/90 backdrop-blur-sm">
                <div className="mx-auto flex h-14 max-w-5xl items-center px-6 sm:px-10">
                    <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900">
                        <span className="flex size-7 items-center justify-center rounded-lg bg-teal-600 text-white">
                            <TreeIcon className="size-4" />
                        </span>
                        Rooted
                    </Link>
                </div>
            </nav>

            {/* Sign-in area */}
            <main className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4">
                {/* Subtle grid texture */}
                <div className="pointer-events-none absolute inset-x-0 top-14 h-96 overflow-hidden text-slate-900 opacity-[0.03]">
                    <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="signin-grid" width="32" height="32" patternUnits="userSpaceOnUse">
                                <path d="M0 32V.5H32" fill="none" stroke="currentColor" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#signin-grid)" />
                    </svg>
                </div>

                <div className="relative w-full max-w-sm">
                    {/* Card */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                        {/* Brand */}
                        <div className="mb-8 flex flex-col items-center text-center">
                            <span className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-teal-600 text-white">
                                <TreeIcon className="size-7" />
                            </span>
                            <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
                            <p className="mt-1.5 text-sm text-slate-500">Stay focused. Stay grounded.</p>
                        </div>

                        {/* OAuth */}
                        <div className="flex justify-center">
                            <SignInGoogle onClick={handleGoogleSignIn} />
                        </div>

                        {/* Back to home */}
                        <p className="mt-6 text-center text-sm text-slate-500">
                            New here?{" "}
                            <Link
                                href="/"
                                className="font-medium text-teal-600 transition-colors hover:text-teal-700"
                            >
                                Learn about Rooted
                            </Link>
                        </p>
                    </div>

                    {/* Legal */}
                    <p className="mt-5 text-center text-xs leading-relaxed text-slate-400">
                        By continuing you agree to our{" "}
                        <a href="#" className="underline underline-offset-2 transition-colors hover:text-slate-600">
                            Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="underline underline-offset-2 transition-colors hover:text-slate-600">
                            Privacy Policy
                        </a>
                        .
                    </p>
                </div>
            </main>
        </div>
    );
}
