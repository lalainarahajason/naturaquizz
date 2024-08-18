
import { CurrentUser } from "@/lib/auth";

export const createQuiz  = async () => {
    
    const user = await CurrentUser();
    const isAdmin = user?.role === 'ADMIN';

    // if user is not admin abort
    if(!isAdmin) throw new Error('Unauthorized');

    return true;

}