import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getTodayInTimezone(tz: string): string {
    try {
        return new Intl.DateTimeFormat("en-CA", { timeZone: tz }).format(new Date());
    } catch {
        return new Intl.DateTimeFormat("en-CA", { timeZone: "UTC" }).format(new Date());
    }
}
