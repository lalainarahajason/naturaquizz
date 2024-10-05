import NextAuth from "next-auth";

import authConfig from "@/auth.config";

import {
    DEFAULT_LOGIN_REDIRECT,
    publicRoutes,  
    authRoutes,
    apiAuthPrefix,
    apiQuiz,
    apiQuizPrefix
} from "@/routes"
import { getUserByEmail } from "./data/user";

const { auth } = NextAuth(authConfig)

export default auth(async(req) => {

    const isLoggedIn = !!req.auth
    const { nextUrl } = req

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
    const isAuthRoute = authRoutes.includes(nextUrl.pathname)

    const isApiQuiz = nextUrl.pathname.startsWith(apiQuizPrefix)

    if(isApiAuthRoute) {
        return;
    }

    if(isAuthRoute) {
        if(isLoggedIn) {
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
        }
        return;
    }

    if(isLoggedIn) {
        try {
            // Check if the user still exists in the database
            const user = await getUserByEmail(req.auth?.user?.email as string);
            console.log("user exists", req.auth?.user?.email);
            console.log(user);
            if (!user) {
                // User doesn't exist in the database, force logout
                // return Response.redirect(new URL("/api/auth/signout", nextUrl))
            }
        } catch (error) {
            console.error("Error checking user existence:", error);
            // Optionally, you can decide to log out the user on error or allow them to continue
            // For safety, let's log them out
            //return Response.redirect(new URL("/api/auth/signout", nextUrl))
        }
    }

    if(!isLoggedIn && !isPublicRoute && !isApiQuiz) {

        let callbackUrl = nextUrl.pathname;
        if(nextUrl.search) {
            callbackUrl += nextUrl.search;
        }

        const encodedCallbackUrl = encodeURIComponent(callbackUrl);

        return Response.redirect(new URL(
            `/auth/login?callbackUrl=${encodedCallbackUrl}`, 
            nextUrl
        ))
    }

    return;

})

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ]
}