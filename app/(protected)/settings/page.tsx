import { auth, signOut } from "@/auth"
import SettingsCard from "./_components/card"


async function SettingsPage() {

  const session = await auth();

  return (
    <SettingsCard />
  )
}

export default SettingsPage