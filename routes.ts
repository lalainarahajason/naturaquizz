/**
 * An array of routes accessible to the public
 * These routes do not require auth authentication
 * @type {string[]}
 */
export const publicRoutes = [
    "/",
    "/auth/new-verification"
]

/**
 * An array of routes for authentication
 * These routes will redirect logged in users to settings
 * @type {string[]}
 */
export const authRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/error",
    "/auth/reset",
    "/auth/new-password"
]

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API
 * authentication purpose
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth"

/**
 * The default redirect path after login in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/settings"