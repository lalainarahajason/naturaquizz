import QuizzAdminForm from "@/components/quizz/quizz-admin-form";
import { RoleGate } from "@/components/auth/role-gate";

async function Quizz() {

    return (
        <RoleGate allowedRole="ADMIN">
            <QuizzAdminForm mode="create" />
        </RoleGate>
        
    )
}

export default Quizz