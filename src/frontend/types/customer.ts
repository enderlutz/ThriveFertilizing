export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  propertySize?: number; // in square feet
  tags: string[];
  status: "active" | "inactive" | "lead";
  createdAt: Date;
  updatedAt: Date;
  lastContactedAt?: Date;
  totalJobsCompleted: number;
  totalRevenue: number;
  notes?: string;
  preferredContactMethod?: "sms" | "email" | "phone";
}

export interface CustomerProfile extends Customer {
  serviceHistory: ServiceHistory[];
  upcomingAppointments: Appointment[];
  estimates: Estimate[];
}

export interface ServiceHistory {
  id: string;
  customerId: string;
  serviceType: string;
  date: Date;
  cost: number;
  notes?: string;
  status: "completed" | "cancelled";
}

export interface Appointment {
  id: string;
  customerId: string;
  customerName: string;
  serviceType: string;
  scheduledDate: Date;
  duration: number; // in minutes
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  assignedTo?: string;
  notes?: string;
}
