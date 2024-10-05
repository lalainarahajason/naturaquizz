"use server";

import Loading from "@/components/loading";
import AdminSidebar from "@/components/sidebar";
import { Suspense } from "react";
import { redirect } from "next/navigation";


import { CurrentRole } from "@/lib/auth";

async function layout({ children }: { children: React.ReactNode }) {
  
  const role = await CurrentRole();

  // If the user is not an admin, return Unauthorized
  if (role === "USER") {
    redirect("/user-dashboard")
  }

  return (
    <div className="bg-white w-full max-w-[1024px] relative">
      <AdminSidebar />
      <Suspense fallback={ <Loading />   }>
        {children}
      </Suspense>
    </div>
  );
}

export default layout;
