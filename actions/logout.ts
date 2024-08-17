"use server";

import { signOut } from "@/auth";

export const logOut = async () => {

    // Some server stuffs
    
    await signOut({
        redirectTo: "/auth/login",
    });
}
