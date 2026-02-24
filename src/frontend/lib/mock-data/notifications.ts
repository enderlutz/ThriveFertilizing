import { Notification, NotificationType } from "@/types";

export function generateNotifications(count: number): Notification[] {
  const notifications: Notification[] = [];

  const templates: Record<NotificationType, { title: string; message: string; actionLabel?: string }> = {
    high_value_lead: {
      title: "High-Value Lead Detected",
      message: "New lead with estimated value of $850 for large property",
      actionLabel: "View Lead",
    },
    no_response: {
      title: "No Response from Customer",
      message: "John Smith hasn't responded to estimate sent 5 days ago",
      actionLabel: "Send Follow-up",
    },
    approval_needed: {
      title: "Estimate Approval Needed",
      message: "AI-generated estimate for Sarah Johnson requires your review",
      actionLabel: "Review Estimate",
    },
    scheduling_conflict: {
      title: "Scheduling Conflict",
      message: "Two appointments scheduled for the same time slot on Thursday",
      actionLabel: "Resolve Conflict",
    },
    task_overdue: {
      title: "Task Overdue",
      message: "2 tasks are past their due date",
      actionLabel: "View Tasks",
    },
    estimate_expiring: {
      title: "Estimate Expiring Soon",
      message: "Estimate for Michael Brown expires in 3 days",
      actionLabel: "View Estimate",
    },
    new_message: {
      title: "New Message",
      message: "You have 3 unread messages from customers",
      actionLabel: "View Inbox",
    },
    system_alert: {
      title: "System Update Available",
      message: "A new version is available with improved AI features",
      actionLabel: "Learn More",
    },
  };

  const types = Object.keys(templates) as NotificationType[];
  const priorities = ["low", "medium", "high", "urgent"] as const;

  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const template = templates[type];
    const createdDate = new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000);
    const isRead = Math.random() > 0.4;

    notifications.push({
      id: `notification-${i + 1}`,
      type,
      title: template.title,
      message: template.message,
      read: isRead,
      actionUrl: `/dashboard/${type.replace("_", "-")}`,
      actionLabel: template.actionLabel,
      priority: type === "scheduling_conflict" || type === "task_overdue"
        ? "urgent"
        : priorities[Math.floor(Math.random() * priorities.length)],
      createdAt: createdDate,
      readAt: isRead ? new Date(createdDate.getTime() + Math.random() * 12 * 60 * 60 * 1000) : undefined,
      relatedCustomerId: !["system_alert", "task_overdue", "new_message"].includes(type)
        ? `customer-${Math.floor(Math.random() * 20 + 1)}`
        : undefined,
      relatedLeadId: type === "high_value_lead" ? `lead-${Math.floor(Math.random() * 30 + 1)}` : undefined,
      relatedTaskId: type === "task_overdue" ? `task-${Math.floor(Math.random() * 25 + 1)}` : undefined,
      relatedEstimateId: ["approval_needed", "estimate_expiring"].includes(type)
        ? `estimate-${Math.floor(Math.random() * 15 + 1)}`
        : undefined,
    });
  }

  return notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}
