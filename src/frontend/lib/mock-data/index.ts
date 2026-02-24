import { generateCustomers } from "./customers";
import { generateConversations } from "./messages";
import { generateLeads } from "./leads";
import { generateEstimates } from "./estimates";
import { generateTasks } from "./tasks";
import { generateActivities } from "./activities";
import { generateNotifications } from "./notifications";
import { DashboardStats } from "@/types";

// Generate all mock data
export function generateAllMockData() {
  const customers = generateCustomers(50);
  const conversations = generateConversations(customers, 25);
  const leads = generateLeads(customers, 35);
  const estimates = generateEstimates(customers, 20);
  const tasks = generateTasks(30);
  const activities = generateActivities(customers, 100);
  const notifications = generateNotifications(15);

  return {
    customers,
    conversations,
    leads,
    estimates,
    tasks,
    activities,
    notifications,
  };
}

// Generate dashboard statistics
export function generateDashboardStats(): DashboardStats {
  const mockData = generateAllMockData();

  const activeLeads = mockData.leads.filter(l =>
    !["completed", "follow_up"].includes(l.stage)
  ).length;

  const pendingEstimates = mockData.estimates.filter(e =>
    ["pending_approval", "sent"].includes(e.status)
  ).length;

  const unreadMessages = mockData.conversations.reduce((sum, conv) =>
    sum + conv.unreadCount, 0
  );

  const pendingTasks = mockData.tasks.filter(t => t.status === "pending").length;
  const overdueTasks = mockData.tasks.filter(t =>
    t.status === "pending" && t.dueDate && t.dueDate < new Date()
  ).length;

  const revenueThisMonth = mockData.leads
    .filter(l => {
      const leadDate = new Date(l.createdAt);
      const now = new Date();
      return leadDate.getMonth() === now.getMonth() &&
             leadDate.getFullYear() === now.getFullYear() &&
             l.actualValue;
    })
    .reduce((sum, l) => sum + (l.actualValue || 0), 0);

  return {
    totalLeads: mockData.leads.length,
    activeLeads,
    leadConversionRate: 0.42, // 42%
    totalRevenue: 125000,
    revenueThisMonth,
    pendingEstimates,
    scheduledAppointments: 12,
    unreadMessages,
    pendingTasks,
    overdueTasks,
  };
}

// Export individual generators
export * from "./customers";
export * from "./messages";
export * from "./leads";
export * from "./estimates";
export * from "./tasks";
export * from "./activities";
export * from "./notifications";
