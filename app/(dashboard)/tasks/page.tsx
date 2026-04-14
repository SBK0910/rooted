import { TasksView } from "@/features/tasks/components/tasks-view";

type TasksPageProps = {
    searchParams: Promise<{ date?: string }>;
};

function getTodayDateString(): string {
    return new Date().toISOString().slice(0, 10);
}

export default async function TasksPage({ searchParams }: TasksPageProps) {
    const params = await searchParams;
    const today = getTodayDateString();
    const selectedDate = params.date?.length ? params.date : today;

    return (
        <main className="mx-auto flex w-full max-w-5xl flex-1 overflow-hidden">
            <TasksView initialDate={selectedDate} />
        </main>
    );
}
