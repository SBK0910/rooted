import { FallbackProps } from "react-error-boundary";
import { Card } from "./ui/card";
import { AlertCircle } from "lucide-react";
import { Button } from "./ui/button";

interface ErrorFallbackProps extends FallbackProps {
    message: string;
}

export default function ErrorFallback({ error, resetErrorBoundary, message }: ErrorFallbackProps) {
    return (
        <Card className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 py-16 text-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <div className="space-y-1">
                <p className="text-sm font-medium">{message}</p>
                <p className="text-xs text-muted-foreground">
                    {error instanceof Error ? error.message : "An unexpected error occurred."}
                </p>
            </div>
            <Button variant="outline" size="sm" onClick={resetErrorBoundary}>
                Try again
            </Button>
        </Card>
    )
}