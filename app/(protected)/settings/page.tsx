import { auth, signOut } from "@/auth"
import SettingsCard from "./_components/card"
import { RoleGate } from "@/components/auth/role-gate";

async function SettingsPage() {

  const session = await auth();

  return (
    <RoleGate allowedRole="ADMIN">
      <SettingsCard />
    </RoleGate>
  )
}

export default SettingsPage