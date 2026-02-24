export type ActivityType =
  | "message_sent"
  | "message_received"
  | "estimate_created"
  | "estimate_sent"
  | "estimate_approved"
  | "appointment_scheduled"
  | "appointment_completed"
  | "task_created"
  | "task_completed"
  | "lead_created"
  | "lead_stage_changed"
  | "customer_created"
  | "ai_action"
  | "system_event";

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  performedBy: string; // "ai", "system", or user name
  timestamp: Date;
  customerId?: string;
  customerName?: string;
  leadId?: string;
  estimateId?: string;
  taskId?: string;
  conversationId?: string;
  metadata?: Record<string, unknown>;
  impact?: "low" | "medium" | "high";
}

export interface ActivityFilter {
  type?: ActivityType[];
  performedBy?: string;
  customerId?: string;
  startDate?: Date;
  endDate?: Date;
}
