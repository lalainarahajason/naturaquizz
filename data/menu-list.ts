import {
    Tag,
    Users,
    Settings,
    Edit3Icon,
    Bookmark,
    SquarePen,
    LayoutGrid,
    LucideIcon,
    AppWindow,
    Blocks,
    MessageCircleQuestionIcon,
  } from "lucide-react";
  
  type Submenu = {
    href: string;
    label: string;
    active: boolean;
  };
  
  type Menu = {
    href: string;
    label: string;
    active: boolean;
    icon: LucideIcon
    submenus: Submenu[];
  };
  
  type Group = {
    groupLabel: string;
    menus: Menu[];
  };
  
  export function getUserMenuList(pathname: string): Group[] {
    return [
      {
        groupLabel: "",
        menus: [
          {
            href: "/dashboard",
            label: "Dashboard",
            active: pathname.includes("/dashboard"),
            icon: AppWindow,
            submenus: []
          }
        ]
      },
      {
        groupLabel: "Settings",
        menus: [
          {
            href: "/informations",
            label: "Informations",
            active: pathname.includes("/informations"),
            icon: Settings,
            submenus: []
          },
          {
            href: "/settings",
            label: "Account",
            active: pathname.includes("/settings"),
            icon: Edit3Icon,
            submenus: []
          }
        ]
      }
    ];
  }

  export function getAdminMenuList(pathname: string): Group[] {
    return [
      {
        groupLabel: "",
        menus: [
          {
            href: "/admin",
            label: "Dashboard",
            active: pathname.includes("/dashboard"),
            icon: AppWindow,
            submenus: []
          }
        ]
      },
      {
        groupLabel: "Quizz",
        menus: [
          {
            href: "/admin/quiz/liste",
            label: "Tous les quiz",
            active: pathname.includes("/quiz/liste"),
            icon: LayoutGrid,
            submenus: []
          },
          {
            href: "/admin/quiz/add",
            label: "Ajouter",
            active: pathname.includes("/quiz/add"),
            icon: Blocks,
            submenus: []
          },
          {
            href: "/admin/question/liste",
            label: "Questions",
            active: pathname.includes("/quiz/questions"),
            icon: MessageCircleQuestionIcon,
            submenus: []
          }
          
        ]
      },
      {
        groupLabel: "Settings",
        menus: [
          {
            href: "/users",
            label: "Users",
            active: pathname.includes("/users"),
            icon: Users,
            submenus: []
          },
          {
            href: "/informations",
            label: "Informations",
            active: pathname.includes("/informations"),
            icon: Settings,
            submenus: []
          },
          {
            href: "/settings",
            label: "Account",
            active: pathname.includes("/settings"),
            icon: Edit3Icon,
            submenus: []
          }
        ]
      }
    ];
  }