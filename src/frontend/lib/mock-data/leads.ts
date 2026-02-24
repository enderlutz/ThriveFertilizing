import { Lead, LeadStage, LeadActivity } from "@/types";

const serviceTypes = [
  "Lawn Fertilization",
  "Weed Control",
  "Pest Control",
  "Aeration",
  "Overseeding",
  "Full Service Package",
];

export function generateLeads(customers: Array<{ id: string; name: string; phone: string; email?: string }>, count: number): Lead[] {
  const leads: Lead[] = [];
  const stages: LeadStage[] = [
    "new_lead",
    "qualification",
    "estimate_needed",
    "estimate_sent",
    "waiting_on_customer",
    "scheduled",
    "in_progress",
    "completed",
    "follow_up",
  ];

  for (let i = 0; i < count; i++) {
    const customer = customers[i % customers.length];
    const createdDate = new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000);
    const lastActivityDate = new Date(createdDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000);

    leads.push({
      id: `lead-${i + 1}`,
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerEmail: customer.email,
      stage: stages[Math.floor(Math.random() * stages.length)],
      serviceType: serviceTypes[Math.floor(Math.random() * serviceTypes.length)],
      propertyAddress: `${Math.floor(Math.random() * 9000 + 1000)} ${["Oak Ave", "Maple St", "Pine Rd"][Math.floor(Math.random() * 3)]}`,
      propertySize: Math.floor(Math.random() * 15000 + 5000),
      estimatedValue: Math.floor(Math.random() * 500 + 200),
      actualValue: Math.random() > 0.5 ? Math.floor(Math.random() * 500 + 200) : undefined,
      priority: ["low", "medium", "high", "urgent"][Math.floor(Math.random() * 4)] as "low" | "medium" | "high" | "urgent",
      source: ["sms", "email", "referral", "website", "phone"][Math.floor(Math.random() * 5)] as "sms" | "email" | "referral" | "website" | "phone",
      assignedTo: Math.random() > 0.5 ? "Mike Rodriguez" : undefined,
      createdAt: createdDate,
      updatedAt: lastActivityDate,
      lastActivityAt: lastActivityDate,
      tags: generateLeadTags(),
      notes: Math.random() > 0.7 ? "Customer requested eco-friendly products" : undefined,
      estimateId: Math.random() > 0.6 ? `estimate-${i + 1}` : undefined,
      appointmentId: Math.random() > 0.7 ? `appointment-${i + 1}` : undefined,
    });
  }

  return leads;
}

function generateLeadTags(): string[] {
  const allTags = ["Hot Lead", "Referral", "Large Property", "Repeat Customer", "Price Sensitive"];
  const tagCount = Math.floor(Math.random() * 2);
  const tags: string[] = [];

  for (let i = 0; i < tagCount; i++) {
    const tag = allTags[Math.floor(Math.random() * allTags.length)];
    if (!tags.includes(tag)) {
      tags.push(tag);
    }
  }

  return tags;
}

export function generateLeadActivities(leadId: string, count: number): LeadActivity[] {
  const activities: LeadActivity[] = [];
  const activityTypes = [
    { type: "status_change" as const, description: "Lead moved to Estimate Sent" },
    { type: "note_added" as const, description: "Added note: Customer prefers morning appointments" },
    { type: "message_sent" as const, description: "Sent follow-up message" },
    { type: "estimate_sent" as const, description: "Estimate sent to customer" },
    { type: "appointment_scheduled" as const, description: "Appointment scheduled for next Tuesday" },
  ];

  for (let i = 0; i < count; i++) {
    const activity = activityTypes[Math.floor(Math.random() * activityTypes.length)];

    activities.push({
      id: `activity-${leadId}-${i + 1}`,
      leadId,
      type: activity.type,
      description: activity.description,
      performedBy: Math.random() > 0.5 ? "ai" : "Mike Rodriguez",
      timestamp: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000),
    });
  }

  return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}
