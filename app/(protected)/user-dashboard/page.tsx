"use server";

import { CurrentUser } from "@/lib/auth";

async function Quizz() {

    const user = await CurrentUser();

    return (
        <>
            {<div>Quizz component here</div>}
        </>

    )
}

export default Quizz