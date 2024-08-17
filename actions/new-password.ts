"use server";

import { db } from "@/lib/db";
import bcryptjs from "bcryptjs"
import * as z from "zod";
import { NewPasswordSchema } from "@/schemas";
import { getPasswordResetTokenByToken } from "@/data/password-reset";
import { getUserByEmail } from "@/data/user";

export const newPassword = async (
    values: z.infer<typeof NewPasswordSchema>,
    token: string | null
) => {

    if(!token) {
        return {
            error: "Invalid token"
        }
    }

    const validateFields = NewPasswordSchema.safeParse(values);

    if(!validateFields.success) {
        return {
            error: "Invalid password field"
        }
    }

    const { password } = validateFields.data;

    const existingToken  = await getPasswordResetTokenByToken(token)

    if(!existingToken) {
        return {
            error: "Invalid token"
        }
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if(hasExpired) {
        return {
            error: "Token expired"
        }
    }

    const existingUser = await getUserByEmail(existingToken.email)

    if(!existingUser) {
        return {
            error: "User email does not exists!"
        }
    }

    const hashedPassword = await bcryptjs.hash(password, 10)

    await db.user.update({
        where:{ id: existingUser.id },
        data:{
            password: hashedPassword
        }
    })

    await db.passwordResetToken.delete({
        where:{ id: existingToken.id }
    })

    return {
        success: "Password updated successfully!"
    }

}