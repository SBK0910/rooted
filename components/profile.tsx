"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Loader2, LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";

function hashUsername(name: string): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
    }
    return hash.toString(16);
}

export default function Profile() {
    const { isLoaded, isSignedIn, user } = useUser();
    const { signOut } = useClerk();
    const router = useRouter();

    // Loading state — spinner inside avatar
    if (!isLoaded) {
        return (
            <Avatar>
                <AvatarFallback className="bg-muted">
                    <Loader2 className="size-4 animate-spin text-muted-foreground" />
                </AvatarFallback>
            </Avatar>
        );
    }

    // Not signed in — nice-looking placeholder
    if (!isSignedIn) {
        return (
            <Avatar>
                <AvatarImage src="https://avatar.vercel.sh/guest" />
                <AvatarFallback>
                    <User className="size-4 text-muted-foreground" />
                </AvatarFallback>
            </Avatar>
        );
    }

    const displayName = user.fullName ?? user.username ?? user.primaryEmailAddress?.emailAddress ?? "User";
    const initials = displayName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
    const userHash = hashUsername(displayName);
    const avatarUrl = `https://avatar.vercel.sh/${userHash}`;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar>
                        <AvatarImage src={user.imageUrl ?? avatarUrl} />
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium leading-tight">{displayName}</span>
                        {user.primaryEmailAddress && (
                            <span className="text-xs text-muted-foreground truncate">
                                {user.primaryEmailAddress.emailAddress}
                            </span>
                        )}
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="text-destructive focus:text-destructive cursor-pointer"
                    onClick={() => signOut(() => router.push("/sign-in"))}
                >
                    <LogOut className="mr-2 size-4" />
                    Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}