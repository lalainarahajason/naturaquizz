import { NavBar } from "./settings/_components/navbar";
import AdminSidebar from "@/components/sidebar";
import UserSidebar from "@/components/user-sidebar";
import { CurrentRole } from "@/lib/auth";
import { UserButton } from "@/components/auth/user-button";

async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const role = await CurrentRole();

  if ("ADMIN" === role) {
    return (
      <div className="w-full h-full flex flex-col gap-y-10 items-center ">
        <NavBar />
        <AdminSidebar />
        {children}
      </div>
    );
  } else {
    return (
      <div className="md:grid md:grid-cols-12 gap-8 w-full">
        <div className="block md:hidden bg-indigo-500 w-full p-4">
          <UserButton />
        </div>
        <div className="hidden md:block md:col-span-3">
          <UserSidebar />
        </div>
        <div className="col-span-12 md:col-span-8 pt-10">{children}</div>
      </div>
    );
  }
}

export default ProtectedLayout;
