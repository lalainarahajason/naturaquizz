"use server";

import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";
import { User, VerificationToken } from "@prisma/client"; // Assuming you're using Prisma

// Define a type for the function's return value
type VerificationResult = {
    error?: string;
    success?: string;
};

/**
 * Handles the email verification process for a user.
 * 
 * This function verifies a user's email address using a verification token.
 * It checks if the token is valid and not expired, then updates the user's
 * email verification status in the database.
 */
export const newVerification = async (token: string): Promise<VerificationResult | undefined> => {
    // Retrieve the verification token from the database
    const existingToken: VerificationToken | null = await getVerificationTokenByToken(token);
    console.log("token", existingToken)
    // Check if the token exists
    if (!existingToken) {
        return {
            error: "Invalid token or token does not exist!"
        };
    }

    // Check if the token has expired
    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
        return {
            error: "Token has expired!"
        };
    }

    // Retrieve the user associated with the token's email
    const existingUser: User | null = await getUserByEmail(existingToken.email);

    // Check if the user exists
    if (!existingUser) {
        return {
            error: "Email does not exist in our database!"
        };
    }

    // Update the user's email verification status
    await db.user.update({
        where: {
            id: existingUser.id
        },
        data: {
            emailVerified: new Date(),
            email: existingToken.email
        }
    });

    // Delete the used verification token
    await db.verificationToken.delete({
        where: {
            id: existingToken.id
        }
    });

    return {
        success : "Email verified!"
    }
}