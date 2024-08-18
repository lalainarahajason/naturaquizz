import { UserInfos } from "@/components/user-infos";
import { CurrentUser } from "@/lib/auth";

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
