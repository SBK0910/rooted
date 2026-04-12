import { queryOptions } from "@tanstack/react-query";
import { taskTreeResponseSchema } from "../contracts/task.contract";

export function getFetchTaskTreeQueryOptions(scheduledDate: string) {
    return queryOptions({
        queryKey: ["taskTree", scheduledDate],
        queryFn: async () => {
            const response = await fetch(`/api/tasks/tree?scheduledDate=${scheduledDate}`);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to fetch task tree context.");
            }

            const payload = await response.json();
            console.log("Fetched task tree context:", payload);

            const data = taskTreeResponseSchema.safeParse(payload);
            if (!data.success) {
                throw new Error("Invalid task tree context data.");
            }
            return data.data;
        },
    })

}