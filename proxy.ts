import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
    '/sign-in(.*)?',
    '/'
]);

export default clerkMiddleware((async (auth, req) => {
    console.log(`Middleware: ${req.method} ${req.url}`);
    if (!isPublicRoute(req)) {
        await auth.protect({
            unauthorizedUrl: new URL('/sign-in', req.url).toString(),
            unauthenticatedUrl: new URL('/sign-in', req.url).toString(),
        });
    }

    const { userId } = await auth();
    if (userId && isPublicRoute(req)) {
        return NextResponse.redirect(new URL('/tasks', req.url).toString());
    }

    return NextResponse.next();
}));

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};