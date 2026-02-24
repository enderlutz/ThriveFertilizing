// Central export file for all types
export * from "./customer";
export * from "./message";
export * from "./lead";
export * from "./estimate";
export * from "./task";
export * from "./activity";
export * from "./notification";

// Dashboard statistics
export interface DashboardStats {
  totalLeads: number;
  activeLeads: number;
  leadConversionRate: number;
  totalRevenue: number;
  revenueThisMonth: number;
  pendingEstimates: number;
  scheduledAppointments: number;
  unreadMessages: number;
  pendingTasks: number;
  overdueTasks: number;
}

// User/Team member
export interface User {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "team_member";
  avatar?: string;
  phone?: string;
  active: boolean;
  permissions: string[];
}
