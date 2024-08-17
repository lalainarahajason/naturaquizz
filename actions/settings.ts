"use server";

import * as z from "zod";
import { SettingsSchema } from "@/schemas";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs"

import { getUserByEmail, getUserById } from "@/data/user";
import { CurrentUser } from "@/lib/auth";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const settings = async (
    values : z.infer<typeof SettingsSchema>
) => {
    const user = await CurrentUser();

    if(!user) {
        return {
            error: "Unauthorized"
        }
    }

    const dbUser = await getUserById(user.id);

    if(!dbUser) {
        return {
            error: "Unauthorized"
        }
    }

    // if account is social login, disable those fields
    if(user.isOAuth) {

        values.email = undefined;
        values.password = undefined;
        values.newPassword = undefined;
        values.isTwoFactorEnabled = undefined;
    }

    // if email is updated, check if it is already in use
    if(values.email && values.email !== user.email) {
        const existingUser = await getUserByEmail(values.email);
        if(existingUser && existingUser.id !== user.id) {
            return {
                error: "Email already in use"
            }
        }
        const verificationToken = await generateVerificationToken(values.email);
        await sendVerificationEmail(verificationToken.email, verificationToken.token);

        return {
            success : "Verification email sent!"
        }
        
    }

    // Manage password update
    if(values.password && values.newPassword && dbUser.password) {
        const passwordMatch = await bcrypt.compare(
            values.password, dbUser.password
        );

        if(!passwordMatch) {
            return {
                error : "Incorrect password!"
            }
        }

        const hashedPassword = await bcrypt.hash(values.newPassword, 10);
        values.password = hashedPassword;
        values.newPassword = undefined;
    }

    await db.user.update({
        where: {
            id: dbUser.id
        },
        data: {
            ...values
        }
    });

    return { success : "settings updated" }
}