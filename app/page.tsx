import Link from "next/link";
import { ArrowRight, Calendar, CheckSquare2, Layers3 } from "lucide-react";

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

const features = [
    {
        icon: <Layers3 className="size-5" />,
        title: "Nested task trees",
        description:
            "Break any project into sub-tasks, infinitely deep. See the full picture and drill into the details whenever you need to.",
    },
    {
        icon: <Calendar className="size-5" />,
        title: "Calendar view",
        description:
            "Navigate your week with a responsive date picker that adapts from 3 to 7 days. Schedule and reschedule with ease.",
    },
    {
        icon: <CheckSquare2 className="size-5" />,
        title: "Smart views",
        description:
            "Create saved views to filter, group, and surface exactly the tasks that matter right now — nothing else.",
    },
];

export default function Home() {
    return (
        <div className="min-h-screen bg-white text-slate-900">
            {/* Nav */}
            <nav className="sticky top-0 z-10 border-b border-slate-100 bg-white/90 backdrop-blur-sm">
                <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6 sm:px-10">
                    <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900">
                        <span className="flex size-7 items-center justify-center rounded-lg bg-teal-600 text-white">
                            <TreeIcon className="size-4" />
                        </span>
                        Rooted
                    </Link>
                    <div className="flex items-center gap-2">
                        <Link
                            href="/sign-in"
                            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
                        >
                            Sign in
                        </Link>
                        <Link
							prefetch={false}
                            href="/tasks"
                            className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700"
                        >
                            Open app <ArrowRight className="size-3.5" />
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative overflow-hidden border-b border-slate-100">
                {/* subtle grid texture */}
                <div className="pointer-events-none absolute inset-0 text-slate-900 opacity-[0.035]">
                    <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="hero-grid" width="32" height="32" patternUnits="userSpaceOnUse">
                                <path d="M0 32V.5H32" fill="none" stroke="currentColor" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#hero-grid)" />
                    </svg>
                </div>

                {/* teal radial glow */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(13,148,136,0.12),transparent)]" />

                <div className="relative mx-auto max-w-5xl px-6 py-28 text-center sm:px-10 sm:py-40">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3.5 py-1 text-xs font-medium text-teal-700">
                        Task management, reimagined
                    </div>

                    <h1 className="text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
                        Stay focused.
                        <br className="hidden sm:block" />
                        Stay{" "}
                        <span className="text-teal-600">grounded.</span>
                    </h1>

                    <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-500">
                        Rooted helps you organise tasks the way your mind works — hierarchically,
                        by date, and with views that cut through the noise.
                    </p>

                    <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Link
							prefetch={false}
                            href="/tasks"
                            className="flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-700"
                        >
                            Get started free <ArrowRight className="size-4" />
                        </Link>
                        <Link
                            href="/sign-in"
                            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                        >
                            Sign in
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="mx-auto max-w-5xl px-6 py-24 sm:px-10">
                <div className="mb-14 text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                        Everything you need to stay organised
                    </h2>
                    <p className="mt-3 text-slate-500">
                        A focused set of tools — nothing more, nothing less.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                    {features.map((f) => (
                        <div
                            key={f.title}
                            className="rounded-2xl border border-slate-100 bg-slate-50 p-6 transition-shadow hover:shadow-sm"
                        >
                            <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-teal-600 text-white">
                                {f.icon}
                            </div>
                            <h3 className="mb-2 font-semibold text-slate-900">{f.title}</h3>
                            <p className="text-sm leading-relaxed text-slate-500">{f.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA banner */}
            <section className="border-t border-slate-100 bg-teal-50">
                <div className="mx-auto max-w-5xl px-6 py-20 text-center sm:px-10">
                    <div className="mb-4 flex justify-center">
                        <span className="flex size-12 items-center justify-center rounded-2xl bg-teal-600 text-white">
                            <TreeIcon className="size-6" />
                        </span>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                        Ready to get rooted?
                    </h2>
                    <p className="mt-3 text-slate-600">
                        Start organising your tasks with clarity and focus.
                    </p>
                    <Link
                        href="/tasks"
						prefetch={false}
                        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-teal-700"
                    >
                        Open Rooted <ArrowRight className="size-4" />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-100 bg-white">
                <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6 sm:px-10">
                    <span className="flex items-center gap-2 text-sm font-medium text-slate-500">
                        <span className="flex size-5 items-center justify-center rounded-md bg-teal-600 text-white">
                            <TreeIcon className="size-3" />
                        </span>
                        Rooted
                    </span>
                    <span className="text-xs text-slate-400">Stay focused. Stay grounded.</span>
                </div>
            </footer>
        </div>
    );
}
