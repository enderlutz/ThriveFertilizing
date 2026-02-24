export type EstimateStatus =
  | "draft"
  | "pending_approval"
  | "approved"
  | "sent"
  | "accepted"
  | "rejected"
  | "expired";

export interface EstimateLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Estimate {
  id: string;
  customerId: string;
  customerName: string;
  leadId?: string;
  status: EstimateStatus;
  serviceType: string;
  propertyAddress: string;
  propertySize?: number;
  lineItems: EstimateLineItem[];
  subtotal: number;
  tax: number;
  total: number;
  validUntil: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // "ai" or user name
  approvedBy?: string;
  approvedAt?: Date;
  sentAt?: Date;
  respondedAt?: Date;
  notes?: string;
  internalNotes?: string;
}

export interface EstimateTemplate {
  id: string;
  name: string;
  serviceType: string;
  description: string;
  defaultLineItems: Omit<EstimateLineItem, "id">[];
  pricingRules?: {
    minPropertySize?: number;
    maxPropertySize?: number;
    pricePerSquareFoot?: number;
    basePrice?: number;
  };
}
