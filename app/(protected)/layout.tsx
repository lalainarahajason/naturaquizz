
import { NavBar } from "./settings/_components/navbar";
import AdminSidebar from "@/components/sidebar";
import UserSidebar from "@/components/user-sidebar";
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
      <div className='w-full h-full flex flex-col gap-y-10 items-center'>
          <NavBar />
          <div className="grid grid-cols-12 gap-8 w-full px-8">
            <div className="col-span-3">
              <UserSidebar />
            </div>
            <div className="col-span-8">
              {children}
            </div>
          </div>
      </div>
    )
  }
}

export default ProtectedLayout