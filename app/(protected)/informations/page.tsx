import { UserInfos } from "@/components/user-infos";
import { CurrentUser } from "@/lib/auth";
import { RoleGate } from "@/components/auth/role-gate";

async function ServerPage() {
  const user = await CurrentUser();

  return (
    <RoleGate allowedRole="ADMIN">
      <UserInfos 
          user={user} 
          label="Mes informations" 
      />
    </RoleGate>
  )
}

export default ServerPage;
