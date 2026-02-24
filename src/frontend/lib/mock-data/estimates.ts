import { Estimate, EstimateStatus, EstimateLineItem } from "@/types";

const serviceDescriptions = {
  "Lawn Fertilization": [
    { description: "Pre-emergent weed control application", quantity: 1, unitPrice: 80 },
    { description: "Balanced fertilizer treatment (per 1000 sq ft)", quantity: 8, unitPrice: 15 },
    { description: "Lawn health assessment", quantity: 1, unitPrice: 50 },
  ],
  "Weed Control": [
    { description: "Post-emergent herbicide application", quantity: 1, unitPrice: 100 },
    { description: "Spot treatment for problem areas", quantity: 1, unitPrice: 50 },
  ],
  "Pest Control": [
    { description: "Perimeter pest barrier", quantity: 1, unitPrice: 120 },
    { description: "Fire ant treatment", quantity: 1, unitPrice: 75 },
  ],
};

export function generateEstimates(
  customers: Array<{ id: string; name: string }>,
  count: number
): Estimate[] {
  const estimates: Estimate[] = [];
  const statuses: EstimateStatus[] = [
    "draft",
    "pending_approval",
    "approved",
    "sent",
    "accepted",
    "rejected",
  ];

  for (let i = 0; i < count; i++) {
    const customer = customers[i % customers.length];
    const serviceType = Object.keys(serviceDescriptions)[
      Math.floor(Math.random() * Object.keys(serviceDescriptions).length)
    ] as keyof typeof serviceDescriptions;

    const lineItems = generateLineItems(serviceType, i);
    const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.0825; // Texas sales tax
    const total = subtotal + tax;

    const createdDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    estimates.push({
      id: `estimate-${i + 1}`,
      customerId: customer.id,
      customerName: customer.name,
      leadId: `lead-${i + 1}`,
      status,
      serviceType,
      propertyAddress: `${Math.floor(Math.random() * 9000 + 1000)} ${["Oak Ave", "Maple St", "Pine Rd"][Math.floor(Math.random() * 3)]}`,
      propertySize: Math.floor(Math.random() * 15000 + 5000),
      lineItems,
      subtotal,
      tax,
      total,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      createdAt: createdDate,
      updatedAt: createdDate,
      createdBy: Math.random() > 0.6 ? "ai" : "Mike Rodriguez",
      approvedBy: status !== "draft" && status !== "pending_approval" ? "Mike Rodriguez" : undefined,
      approvedAt: status !== "draft" && status !== "pending_approval"
        ? new Date(createdDate.getTime() + Math.random() * 2 * 24 * 60 * 60 * 1000)
        : undefined,
      sentAt: ["sent", "accepted", "rejected"].includes(status)
        ? new Date(createdDate.getTime() + Math.random() * 3 * 24 * 60 * 60 * 1000)
        : undefined,
      respondedAt: ["accepted", "rejected"].includes(status)
        ? new Date(createdDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000)
        : undefined,
      notes: "Includes eco-friendly products as requested",
      internalNotes: Math.random() > 0.7 ? "Customer is price-sensitive - this is our best offer" : undefined,
    });
  }

  return estimates;
}

function generateLineItems(serviceType: keyof typeof serviceDescriptions, seed: number): EstimateLineItem[] {
  const items = serviceDescriptions[serviceType];

  return items.map((item, index) => ({
    id: `line-item-${seed}-${index + 1}`,
    ...item,
    total: item.quantity * item.unitPrice,
  }));
}
