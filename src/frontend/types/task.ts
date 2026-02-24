export type TaskPriority = "low" | "medium" | "high" | "urgent";
export type TaskStatus = "pending" | "in_progress" | "completed" | "cancelled";
export type TaskType =
  | "approve_estimate"
  | "confirm_availability"
  | "request_information"
  | "follow_up"
  | "customer_reactivation"
  | "send_reminder"
  | "review_message"
  | "other";

export interface Task {
  id: string;
  type: TaskType;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo?: string;
  createdBy: string; // "ai" or user name
  createdAt: Date;
  dueDate?: Date;
  completedAt?: Date;
  completedBy?: string;
  relatedCustomerId?: string;
  relatedLeadId?: string;
  relatedEstimateId?: string;
  relatedConversationId?: string;
  metadata?: Record<string, unknown>;
}

export interface TaskFilter {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  assignedTo?: string;
  type?: TaskType[];
  overdue?: boolean;
}
