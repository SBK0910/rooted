import { TasksView } from "@/features/tasks/components/tasks-view";

type TasksPageProps = {
    searchParams: Promise<{ date?: string }>;
};

function getTodayDateString(): string {
    return new Date().toISOString().slice(0, 10);
}

function formatDisplayDate(dateStr: string): string {
    return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

export default async function TasksPage({ searchParams }: TasksPageProps) {
    const params = await searchParams;
    const today = getTodayDateString();
    const selectedDate = params.date?.length ? params.date : today;

    return (
        <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 overflow-hidden px-6 py-10 sm:px-10">
            {/* Page heading */}
            <div>
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    Daily View
                </p>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                    {formatDisplayDate(selectedDate)}
                </h1>
            </div>

            <TasksView initialDate={selectedDate} />
        </main>
    );
}
