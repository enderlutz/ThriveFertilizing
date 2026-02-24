import { Activity, ActivityType } from "@/types";

const activityTemplates: Record<ActivityType, (customerName?: string) => string> = {
  message_sent: (name) => `Sent message to ${name || "customer"}`,
  message_received: (name) => `Received message from ${name || "customer"}`,
  estimate_created: (name) => `Created estimate for ${name || "customer"}`,
  estimate_sent: (name) => `Sent estimate to ${name || "customer"}`,
  estimate_approved: (name) => `Approved estimate for ${name || "customer"}`,
  appointment_scheduled: (name) => `Scheduled appointment with ${name || "customer"}`,
  appointment_completed: (name) => `Completed service for ${name || "customer"}`,
  task_created: () => `Created new task`,
  task_completed: () => `Completed task`,
  lead_created: (name) => `New lead: ${name || "customer"}`,
  lead_stage_changed: (name) => `Updated lead stage for ${name || "customer"}`,
  customer_created: (name) => `New customer: ${name || "customer"}`,
  ai_action: (name) => `AI sent automated response to ${name || "customer"}`,
  system_event: () => `System backup completed`,
};

export function generateActivities(
  customers: Array<{ id: string; name: string }>,
  count: number
): Activity[] {
  const activities: Activity[] = [];
  const activityTypes = Object.keys(activityTemplates) as ActivityType[];
  const performers = ["ai", "system", "Mike Rodriguez", "Sarah Johnson"];

  for (let i = 0; i < count; i++) {
    const type = activityTypes[Math.floor(Math.random() * activityTypes.length)];
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const performedBy = type === "system_event"
      ? "system"
      : type === "ai_action"
      ? "ai"
      : performers[Math.floor(Math.random() * performers.length)];

    const title = activityTemplates[type](customer.name);
    const timestamp = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);

    activities.push({
      id: `activity-${i + 1}`,
      type,
      title,
      description: generateDescription(type, customer.name),
      performedBy,
      timestamp,
      customerId: !["task_created", "task_completed", "system_event"].includes(type) ? customer.id : undefined,
      customerName: !["task_created", "task_completed", "system_event"].includes(type) ? customer.name : undefined,
      leadId: type.includes("lead") ? `lead-${Math.floor(Math.random() * 30 + 1)}` : undefined,
      estimateId: type.includes("estimate") ? `estimate-${Math.floor(Math.random() * 15 + 1)}` : undefined,
      taskId: type.includes("task") ? `task-${Math.floor(Math.random() * 25 + 1)}` : undefined,
      impact: ["high", "medium", "low"][Math.floor(Math.random() * 3)] as "high" | "medium" | "low",
    });
  }

  return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

function generateDescription(type: ActivityType, customerName: string): string {
  const descriptions: Record<ActivityType, string> = {
    message_sent: `Sent follow-up message regarding service inquiry`,
    message_received: `Customer asked about pricing and availability`,
    estimate_created: `AI generated estimate for lawn fertilization service`,
    estimate_sent: `Estimate sent via SMS for $${Math.floor(Math.random() * 400 + 200)}`,
    estimate_approved: `Estimate approved and ready for customer`,
    appointment_scheduled: `Scheduled for ${new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}`,
    appointment_completed: `Lawn fertilization service completed successfully`,
    task_created: `New task created: Follow up on pending estimate`,
    task_completed: `Task completed: Confirm customer availability`,
    lead_created: `Lead created from SMS inquiry about ${["fertilization", "weed control", "pest control"][Math.floor(Math.random() * 3)]}`,
    lead_stage_changed: `Moved from "Estimate Sent" to "Scheduled"`,
    customer_created: `New customer added to CRM with ${Math.floor(Math.random() * 15000 + 5000)} sq ft property`,
    ai_action: `AI automatically responded with service information and pricing`,
    system_event: `Daily system backup completed successfully`,
  };

  return descriptions[type];
}
