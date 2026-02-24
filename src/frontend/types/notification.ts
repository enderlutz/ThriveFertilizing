export type NotificationType =
  | "high_value_lead"
  | "no_response"
  | "approval_needed"
  | "scheduling_conflict"
  | "task_overdue"
  | "estimate_expiring"
  | "new_message"
  | "system_alert";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  priority: "low" | "medium" | "high" | "urgent";
  createdAt: Date;
  readAt?: Date;
  relatedCustomerId?: string;
  relatedLeadId?: string;
  relatedTaskId?: string;
  relatedEstimateId?: string;
  metadata?: Record<string, unknown>;
}
