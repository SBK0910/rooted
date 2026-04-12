import { Card, CardContent } from "@/components/ui/card";

export function TaskTreeSkeleton() {
    return (
        <Card className="flex min-h-0 flex-1 flex-col">
            <CardContent className="space-y-3 p-4">
                {[40, 60, 52, 44, 68].map((w, i) => (
                    <div
                        key={i}
                        className="h-4 animate-pulse rounded-md bg-muted"
                        style={{ width: `${w}%` }}
                    />
                ))}
            </CardContent>
        </Card>
    );
}
