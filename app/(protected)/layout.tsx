
import { NavBar } from "./settings/_components/navbar";
import AdminSidebar from "@/components/sidebar";
import { CurrentRole } from "@/lib/auth";

async function ProtectedLayout({children}:{children: React.ReactNode}) {
  
  const role = await CurrentRole();

  if("ADMIN" === role ) {
    return (
      <div className='w-full h-full flex flex-col gap-y-10 items-center '>
          <NavBar />
          <AdminSidebar />
          {children}
      </div>
      )
  } else {
    return (
      <div className='w-full h-full flex flex-col gap-y-10 items-center '>
          <NavBar />
          {children}
      </div>
    )
  }
}

export default ProtectedLayout