"use server";

import { CurrentUser } from "@/lib/auth";

async function Quizz() {

    const user = await CurrentUser();
    const isPremium = user?.role === 'PREMIUM';
  return (

    <>
    {isPremium && <div>page</div>}
    </>

  )
}

export default Quizz