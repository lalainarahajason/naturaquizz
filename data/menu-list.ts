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
    id:string;
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
            id: "menu-dashboard",
            href: "/dashboard",
            label: "Tableau de bord",
            active: pathname.includes("/dashboard"),
            icon: AppWindow,
            submenus: []
          },
          {
            id: "menu-quiz",
            href: "/quiz",
            label: "Quiz naturalisation",
            active: pathname.includes("/dashboard"),
            icon: LayoutGrid,
            submenus: []
          },
          {
            id: "menu-informations",
            href: "/informations",
            label: "Mes informations",
            active: pathname.includes("/informations"),
            icon: Settings,
            submenus: []
          },
          {
            id: "menu-settings",
            href: "/settings",
            label: "Mon compte",
            active: pathname.includes("/settings"),
            icon: Edit3Icon,
            submenus: []
          }
        ]
      },
    ];
  }

  export function getAdminMenuList(pathname: string): Group[] {
    return [
      {
        groupLabel: "",
        menus: [
          {
            id: "admin-dashboard",
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
            id: "liste-quiz",
            href: "/admin/quiz/liste",
            label: "Tous les quiz",
            active: pathname.includes("/quiz/liste"),
            icon: LayoutGrid,
            submenus: []
          },
          {
            id: "ajouter-quiz",
            href: "/admin/quiz/add",
            label: "Ajouter",
            active: pathname.includes("/quiz/add"),
            icon: Blocks,
            submenus: []
          },
          {
            id: "liste-questions",
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
            id: "settings-users",
            href: "/users",
            label: "Users",
            active: pathname.includes("/users"),
            icon: Users,
            submenus: []
          },
          {
            id: "settings-informations",
            href: "/informations",
            label: "Informations",
            active: pathname.includes("/informations"),
            icon: Settings,
            submenus: []
          },
          {
            id: "settins-account",
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