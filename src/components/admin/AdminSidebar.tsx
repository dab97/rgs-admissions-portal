
import React from 'react';
import {
  BarChart3,
  Users,
  GraduationCap,
  Settings,
  Home,
  FileText,
  TrendingUp,
  UserCheck,
  Calendar,
  Search,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const menuItems = [
  {
    title: "Главная",
    url: "/admin",
    icon: Home,
  },
  {
    title: "Поступающие",
    url: "/admin/applicants",
    icon: Users,
  },
  {
    title: "Статистика",
    url: "/admin/statistics",
    icon: BarChart3,
  },
  {
    title: "Аналитика",
    url: "/admin/analytics",
    icon: TrendingUp,
  },
  {
    title: "Отчеты",
    url: "/admin/reports",
    icon: FileText,
  },
];

const analyticsItems = [
  {
    title: "По направлениям",
    url: "/admin/analytics/specializations",
    icon: GraduationCap,
  },
  {
    title: "По бюджету",
    url: "/admin/analytics/budget",
    icon: TrendingUp,
  },
  {
    title: "По форме обучения",
    url: "/admin/analytics/study-form",
    icon: Calendar,
  },
  {
    title: "По полу",
    url: "/admin/analytics/gender",
    icon: UserCheck,
  },
];

const settingsItems = [
  {
    title: "Пользователи",
    url: "/admin/users",
    icon: UserCheck,
  },
  {
    title: "Настройки",
    url: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  return (
    <Sidebar variant="inset" className="border-r-2">
      <SidebarHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold text-blue-900">РГСУ Минск</span>
            <span className="truncate text-xs text-blue-600">Админ панель</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-blue-800 font-semibold">
            Навигация
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="hover:bg-blue-50 hover:text-blue-700">
                    <a href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-blue-800 font-semibold">
            Аналитика
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {analyticsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="hover:bg-blue-50 hover:text-blue-700">
                    <a href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-blue-800 font-semibold">
            Управление
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="hover:bg-blue-50 hover:text-blue-700">
                    <a href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t bg-gradient-to-r from-blue-50 to-indigo-50">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="hover:bg-blue-100">
              <Avatar className="h-8 w-8 rounded-lg border-2 border-blue-200">
                <AvatarImage src="/placeholder.svg" alt="Администратор" />
                <AvatarFallback className="rounded-lg bg-blue-600 text-white">АД</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-blue-900">Администратор</span>
                <span className="truncate text-xs text-blue-600">admin@rgsu.by</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
