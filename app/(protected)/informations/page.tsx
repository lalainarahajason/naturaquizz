import { UserInfos } from "@/components/user-infos";
import { CurrentUser } from "@/lib/auth";
import { RoleGate } from "@/components/auth/role-gate";

async function ServerPage() {
  
  const user = await CurrentUser();

  return (
    <UserInfos 
          user={user} 
          label="Mes informations" 
      />
  )
}

export default ServerPage;
