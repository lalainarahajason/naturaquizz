/**
 * @api {post} /api/quizs/signin
 */
import { getUserByEmail } from "@/data/user";
import { NextResponse } from "next/server";

export async function POST (req: Request) {
    const { email, password } = await req.json();

    if (!email || !password) {
        return NextResponse.json({ error : "Email ou mot de passe obligatoire"}, { status: 401});
    }
    const user = await getUserByEmail(email);

    if (!user) {
        return NextResponse.json({ error: "Email ou mot de passe invalide" }, { status: 401 });
    }

    return Response.json({ success:true }, {status: 200});
}