"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserButton } from "@/components/auth/user-button";
import { useSession } from "next-auth/react";

export const NavBar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <nav className="bg-secondary flex justify-between items-center p-4 w-full max-w-[1440px] shadow-sm">
      <div className="flex gap-x-2">
        <Button
          asChild
          variant={pathname === "/server" ? "default" : "outline"}
        >
          <Link href="/server">Récapitulatif</Link>
        </Button>
        {session?.user?.role === "ADMIN" && (
          <Button
            asChild
            variant={pathname === "/admin" ? "default" : "outline"}
          >
            <Link href="/admin">Admin</Link>
          </Button>
        )}

        <Button
          asChild
          variant={pathname === "/settings" ? "default" : "outline"}
        >
          <Link href="/settings">Settings</Link>
        </Button>
      </div>
      <UserButton />
    </nav>
  );
};
