import { Task, TaskType, TaskPriority, TaskStatus } from "@/types";

const taskTemplates: Record<TaskType, { title: string; description: string }[]> = {
  approve_estimate: [
    { title: "Review estimate for John Smith", description: "AI-generated estimate needs approval before sending" },
    { title: "Approve large property estimate", description: "High-value estimate for 15,000 sq ft property" },
  ],
  confirm_availability: [
    { title: "Confirm Tuesday availability", description: "Customer requested appointment for next Tuesday 10am" },
    { title: "Check crew schedule", description: "Verify team availability for large job next week" },
  ],
  request_information: [
    { title: "Get property size from customer", description: "Need square footage to provide accurate estimate" },
    { title: "Request property photos", description: "Photos needed to assess lawn condition" },
  ],
  follow_up: [
    { title: "Follow up on pending estimate", description: "Estimate sent 5 days ago, no response yet" },
    { title: "Check on customer satisfaction", description: "Service completed 1 week ago" },
  ],
  customer_reactivation: [
    { title: "Reach out to inactive customer", description: "Last service was 6 months ago" },
    { title: "Spring service reminder", description: "Customer typically schedules spring treatment" },
  ],
  send_reminder: [
    { title: "Send appointment reminder", description: "Appointment scheduled for tomorrow at 2pm" },
    { title: "Estimate expiring soon", description: "Estimate valid for 3 more days" },
  ],
  review_message: [
    { title: "Review AI response", description: "AI drafted response to complex customer question" },
    { title: "Approve bulk message", description: "AI wants to send seasonal promotion to 50 customers" },
  ],
  other: [
    { title: "Update pricing for spring packages", description: "Review and adjust seasonal pricing" },
    { title: "Process customer refund", description: "Customer not satisfied with recent service" },
  ],
};

export function generateTasks(count: number): Task[] {
  const tasks: Task[] = [];
  const taskTypes = Object.keys(taskTemplates) as TaskType[];
  const priorities: TaskPriority[] = ["low", "medium", "high", "urgent"];
  const statuses: TaskStatus[] = ["pending", "in_progress", "completed", "cancelled"];

  for (let i = 0; i < count; i++) {
    const type = taskTypes[Math.floor(Math.random() * taskTypes.length)];
    const templates = taskTemplates[type];
    const template = templates[Math.floor(Math.random() * templates.length)];
    const createdDate = new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000);
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    const dueDate = new Date(createdDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000);
    const isOverdue = status === "pending" && dueDate < new Date();

    tasks.push({
      id: `task-${i + 1}`,
      type,
      title: template.title,
      description: template.description,
      status,
      priority: isOverdue ? "urgent" : priorities[Math.floor(Math.random() * priorities.length)],
      assignedTo: Math.random() > 0.3 ? "Mike Rodriguez" : undefined,
      createdBy: Math.random() > 0.5 ? "ai" : "Mike Rodriguez",
      createdAt: createdDate,
      dueDate,
      completedAt: status === "completed"
        ? new Date(createdDate.getTime() + Math.random() * 5 * 24 * 60 * 60 * 1000)
        : undefined,
      completedBy: status === "completed" ? "Mike Rodriguez" : undefined,
      relatedCustomerId: Math.random() > 0.3 ? `customer-${Math.floor(Math.random() * 20 + 1)}` : undefined,
      relatedLeadId: Math.random() > 0.5 ? `lead-${Math.floor(Math.random() * 30 + 1)}` : undefined,
      relatedEstimateId: type === "approve_estimate" ? `estimate-${Math.floor(Math.random() * 15 + 1)}` : undefined,
    });
  }

  return tasks.sort((a, b) => {
    // Sort by priority (urgent first) then by due date
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    if (a.dueDate && b.dueDate) {
      return a.dueDate.getTime() - b.dueDate.getTime();
    }
    return 0;
  });
}
