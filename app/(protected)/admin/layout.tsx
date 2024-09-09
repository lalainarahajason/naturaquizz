"use server";

import AdminSidebar from "@/components/sidebar";
import Loading from "@/components/loading";
import { Suspense } from "react";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white w-full max-w-[1024px] relative">
      <AdminSidebar />
      {children}
    </div>
  );
}

export default layout;
