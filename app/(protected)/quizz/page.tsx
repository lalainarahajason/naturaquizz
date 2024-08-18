"use server";

import { CurrentUser } from "@/lib/auth";

async function Quizz() {

    const user = await CurrentUser();
    const isPremium = user?.role === 'PREMIUM';

    return (
        <>
            {isPremium && <div>Quizz component here</div>}
        </>

    )
}

export default Quizz