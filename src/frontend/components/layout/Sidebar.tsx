"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  ListTodo,
  FileText,
  Calendar,
  Activity,
  Settings,
  Leaf,
} from "lucide-react";

const navigationItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Inbox",
    href: "/dashboard/inbox",
    icon: MessageSquare,
    badge: 8,
  },
  {
    title: "Lead Pipeline",
    href: "/dashboard/pipeline",
    icon: Activity,
  },
  {
    title: "Customers",
    href: "/dashboard/customers",
    icon: Users,
  },
  {
    title: "Tasks",
    href: "/dashboard/tasks",
    icon: ListTodo,
    badge: 5,
  },
  {
    title: "Estimates",
    href: "/dashboard/estimates",
    icon: FileText,
  },
  {
    title: "Schedule",
    href: "/dashboard/schedule",
    icon: Calendar,
  },
  {
    title: "Activity Log",
    href: "/dashboard/activity",
    icon: Activity,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <Leaf className="h-6 w-6 text-primary" />
        <div>
          <h1 className="font-bold text-lg">Thrive</h1>
          <p className="text-xs text-muted-foreground">Command Center</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="flex-1">{item.title}</span>
              {item.badge && (
                <span className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-semibold",
                  isActive
                    ? "bg-primary-foreground text-primary"
                    : "bg-primary text-primary-foreground"
                )}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Settings */}
      <div className="border-t p-4">
        <Link
          href="/dashboard/settings"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            pathname === "/dashboard/settings"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </Link>
      </div>
    </div>
  );
}
