"use server";

import { CurrentUser } from "@/lib/auth";
import QuizzAdminForm from "@/components/quizz/quizz-admin-form";

async function Quizz() {

    const user = await CurrentUser();
    const isPremium = user?.role === 'PREMIUM';

    return (
        <>
            {isPremium && <QuizzAdminForm />}
        </>

    )
}

export default Quizz