"use server";

import { CurrentUser } from "@/lib/auth";
import QuizzAdminForm from "@/components/quizz/quizz-admin-form";
import { Suspense } from "react";
import Loading from "../loading";



async function Quizz() {

    const user = await CurrentUser();
    const isAdmin = user?.role === 'ADMIN';

    return (
        <Suspense fallback={<Loading />}>
            {isAdmin && <QuizzAdminForm mode="create" />}
        </Suspense>

    )
}

export default Quizz