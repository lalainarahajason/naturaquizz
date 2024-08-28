"use server";

import { CurrentUser } from "@/lib/auth";
import QuizzAdminForm from "@/components/quizz/quizz-admin-form";
import { Suspense } from "react";
import Loading from "../../../../components/loading";

async function Quizz() {

    const user = await CurrentUser();
    const isAdmin = user?.role === 'ADMIN';

    return (
        <>
            {isAdmin && <QuizzAdminForm mode="create" />}
        </>
        

    )
}

export default Quizz