export type LeadStage =
  | "new_lead"
  | "qualification"
  | "estimate_needed"
  | "estimate_sent"
  | "waiting_on_customer"
  | "scheduled"
  | "in_progress"
  | "completed"
  | "follow_up";

export interface Lead {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  stage: LeadStage;
  serviceType: string;
  propertyAddress?: string;
  propertySize?: number;
  estimatedValue?: number;
  actualValue?: number;
  priority: "low" | "medium" | "high" | "urgent";
  source: "sms" | "email" | "referral" | "website" | "phone" | "other";
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  lastActivityAt: Date;
  tags: string[];
  notes?: string;
  estimateId?: string;
  appointmentId?: string;
}

export interface LeadActivity {
  id: string;
  leadId: string;
  type: "status_change" | "note_added" | "message_sent" | "estimate_sent" | "appointment_scheduled";
  description: string;
  performedBy: string; // "ai" or user name
  timestamp: Date;
  metadata?: Record<string, unknown>;
}
