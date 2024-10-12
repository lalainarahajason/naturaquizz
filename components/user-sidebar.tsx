"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { getUserMenuList } from "@/data/menu-list";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { UserButton } from "./auth/user-button";

function UserSidebar() {
  const pathname = usePathname();
  const menuList = getUserMenuList(pathname);

  return (
    <div className="flex flex-col bg-indigo-500 px-6 py-8 lg:fixed">
      <ScrollArea className="[&>div>div[style]]:!block">
        <div className=" flex justify-center mb-6">
            <UserButton />
        </div>
        <ul className="flex flex-col min-h-[calc(100vh-48px-36px-16px-32px)] lg:min-h-[calc(100vh-32px-40px-32px)] items-start space-y-3 px-2">
          {menuList.map(({ groupLabel, menus }, index) => (
            <li key={index} className="list-none flex flex-col gap-4">
              {groupLabel && <p className="text-white">{groupLabel}</p>}
              {menus.map(
                ({ id, href, label, icon: Icon, active, submenus }, index) =>
                  submenus.length === 0 ? (
                    <Link 
                        key={id}
                      href={href}
                      className="flex items-center text-white"
                    >
                      <span className="mr-4">
                        <Icon size={24} />
                      </span>
                      <p>{label}</p>
                    </Link>
                  ) : (
                    <li key={id}>{label}</li>
                  )
              )}
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
}

export default UserSidebar;
