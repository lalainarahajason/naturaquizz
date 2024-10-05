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

    if(!isLoggedIn && !isPublicRoute) {

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