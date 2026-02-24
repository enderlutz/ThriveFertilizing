import { Customer, CustomerProfile, ServiceHistory, Appointment } from "@/types";

const firstNames = ["John", "Sarah", "Michael", "Jennifer", "David", "Emily", "Robert", "Lisa", "James", "Mary"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"];
const streets = ["Oak Ave", "Maple St", "Pine Rd", "Cedar Ln", "Elm Dr", "Birch Way", "Willow Ct", "Ash Blvd"];
const cities = ["Austin", "Dallas", "Houston", "San Antonio", "Fort Worth"];

export function generateCustomers(count: number): Customer[] {
  const customers: Customer[] = [];

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const createdDate = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000);

    customers.push({
      id: `customer-${i + 1}`,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      phone: `(512) ${String(Math.floor(Math.random() * 900 + 100))}-${String(Math.floor(Math.random() * 9000 + 1000))}`,
      address: {
        street: `${Math.floor(Math.random() * 9000 + 1000)} ${streets[Math.floor(Math.random() * streets.length)]}`,
        city: cities[Math.floor(Math.random() * cities.length)],
        state: "TX",
        zip: String(Math.floor(Math.random() * 90000 + 10000)),
      },
      propertySize: Math.floor(Math.random() * 15000 + 5000),
      tags: generateRandomTags(),
      status: Math.random() > 0.3 ? "active" : Math.random() > 0.5 ? "lead" : "inactive",
      createdAt: createdDate,
      updatedAt: new Date(createdDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000),
      lastContactedAt: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : undefined,
      totalJobsCompleted: Math.floor(Math.random() * 10),
      totalRevenue: Math.floor(Math.random() * 5000 + 500),
      notes: Math.random() > 0.7 ? "Important customer - handles payments promptly" : undefined,
      preferredContactMethod: ["sms", "email", "phone"][Math.floor(Math.random() * 3)] as "sms" | "email" | "phone",
    });
  }

  return customers;
}

function generateRandomTags(): string[] {
  const allTags = ["VIP", "Repeat Customer", "Large Property", "Referral", "Spring Service", "Fall Service"];
  const tagCount = Math.floor(Math.random() * 3);
  const tags: string[] = [];

  for (let i = 0; i < tagCount; i++) {
    const tag = allTags[Math.floor(Math.random() * allTags.length)];
    if (!tags.includes(tag)) {
      tags.push(tag);
    }
  }

  return tags;
}

export function generateServiceHistory(customerId: string, count: number): ServiceHistory[] {
  const serviceTypes = ["Lawn Fertilization", "Weed Control", "Pest Control", "Aeration", "Overseeding"];
  const history: ServiceHistory[] = [];

  for (let i = 0; i < count; i++) {
    history.push({
      id: `service-${customerId}-${i + 1}`,
      customerId,
      serviceType: serviceTypes[Math.floor(Math.random() * serviceTypes.length)],
      date: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000),
      cost: Math.floor(Math.random() * 400 + 100),
      notes: Math.random() > 0.7 ? "Extra treatment applied to problem areas" : undefined,
      status: Math.random() > 0.9 ? "cancelled" : "completed",
    });
  }

  return history.sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function generateAppointments(customerId: string, customerName: string, count: number): Appointment[] {
  const serviceTypes = ["Lawn Fertilization", "Weed Control", "Pest Control", "Aeration", "Overseeding"];
  const appointments: Appointment[] = [];

  for (let i = 0; i < count; i++) {
    const scheduledDate = new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000);

    appointments.push({
      id: `appointment-${customerId}-${i + 1}`,
      customerId,
      customerName,
      serviceType: serviceTypes[Math.floor(Math.random() * serviceTypes.length)],
      scheduledDate,
      duration: [60, 90, 120][Math.floor(Math.random() * 3)],
      status: "scheduled",
      assignedTo: Math.random() > 0.5 ? "Mike Rodriguez" : "Sarah Johnson",
      notes: Math.random() > 0.8 ? "Customer requested morning appointment" : undefined,
    });
  }

  return appointments.sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime());
}
