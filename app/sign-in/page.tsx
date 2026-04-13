"use client";

import SignInGoogle from "@/components/sign-in/sign-in-google";
import { OAuthStrategy } from '@clerk/shared/types'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useSignIn } from "@clerk/nextjs";
import { toast } from "sonner";

export default function SignInPage() {
    const { signIn } = useSignIn();

    const handleGoogleSignIn = async (strategy: OAuthStrategy) => {
        const { error } = await signIn.sso({
            strategy,
            redirectCallbackUrl: '/sign-in/callback',
            redirectUrl: '/tasks',
        })

        if (error) {
            console.error("Google Sign-In error:", error);
            toast.error(error.longMessage || error.message || "Failed to sign in with Google");
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
            <Card className="w-full max-w-sm shadow-md">
                <CardHeader className="border-b">
                    <div className="flex items-center gap-6">
                        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="size-6">
                                <line x1="12" y1="22" x2="12" y2="11" />
                                <path d="M12 16 C10 18 7 18 5 20" />
                                <path d="M12 16 C14 18 17 18 19 20" />
                                <path d="M12 19 C11 20.5 9.5 21 8 22" />
                                <path d="M12 19 C13 20.5 14.5 21 16 22" />
                                <path d="M12 11 C12 11 7 9 7 5 A5 5 0 0 1 17 5 C17 9 12 11 12 11Z" />
                            </svg>
                        </div>
                        <div className="flex h-12 flex-col justify-center">
                            <CardTitle className="text-xl leading-tight">Rooted</CardTitle>
                            <CardDescription className="leading-tight">Stay focused. Stay grounded.</CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="flex flex-col items-center gap-4 py-6">
                    <SignInGoogle onClick={() => handleGoogleSignIn("oauth_google")} />
                </CardContent>

                <CardFooter className="justify-center">
                    <p className="text-xs text-muted-foreground text-center leading-relaxed">
                        By continuing you agree to our{" "}
                        <a href="#" className="underline underline-offset-2 hover:text-foreground transition-colors">
                            Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="underline underline-offset-2 hover:text-foreground transition-colors">
                            Privacy Policy
                        </a>
                        .
                    </p>
                </CardFooter>
            </Card>
        </main>
    );
}
