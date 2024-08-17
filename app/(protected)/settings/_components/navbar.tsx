"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserButton } from "@/components/auth/user-button";
import { useSession } from "next-auth/react";

export const NavBar = () => {
  const pathname = usePathname();
  
  const { data: session, status } = useSession();

  const userRole = session?.user?.role || "USER";

  const Menus = [
    {
      label: "Mes informations",
      href: "/server",
      role: "USER",
    },
    {
      label: "Admin",
      href: "/admin",
      role: "ADMIN",
    },
    {
      label: "Mon compte (Premium)",
      href: "/settings",
      role: "PREMIUM"
    },
    {
      label: "Mon compte",
      href: "/settings",
      role: "USER",
    },
  ];

  const filteredMenus = Menus.filter(menu => menu.role === userRole || menu.role === "USER");

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <nav className="bg-secondary flex justify-between items-center p-4 w-full max-w-[1440px] shadow-sm">
      <div className="flex gap-x-2">
        {filteredMenus.map((menu, index) => (
          <Button
            key={index}
            asChild
            variant={pathname === menu.href ? "default" : "outline"}
          >
            <Link href={menu.href}>{menu.label}</Link>
          </Button>
        ))}
      </div>
      <UserButton />
    </nav>
  );
};