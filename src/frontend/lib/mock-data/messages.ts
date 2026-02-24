import { Conversation, Message, InternalNote } from "@/types";

const customerMessages = [
  "Hi, I'm interested in getting my lawn fertilized. Can you give me a quote?",
  "When is the earliest you can come out?",
  "Thanks for the estimate! When can we schedule this?",
  "Do you also handle weed control?",
  "My neighbor recommended you. I have about 8,000 sq ft that needs treatment.",
  "What's included in your spring fertilization package?",
  "Can you come out next Tuesday?",
  "I need to reschedule my appointment for next week.",
];

const aiMessages = [
  "Thanks for reaching out! I'd be happy to help you with a quote. Can you tell me the approximate size of your lawn in square feet?",
  "We have availability this Thursday or Friday. Which works better for you?",
  "Great! I'll get an estimate prepared for you right away.",
  "Yes, we offer comprehensive weed control services. Would you like me to include that in your quote?",
  "Perfect! For an 8,000 sq ft property, our fertilization service typically runs $250-350 depending on your specific needs.",
  "Our spring package includes pre-emergent weed control, balanced fertilization, and a lawn health assessment.",
];

const teamMessages = [
  "I'll handle this one personally.",
  "Can you send me the property details?",
  "Scheduled for next Thursday at 10am.",
  "Customer confirmed - all set!",
];

export function generateConversations(customers: Array<{ id: string; name: string; phone: string }>, count: number): Conversation[] {
  const conversations: Conversation[] = [];
  const selectedCustomers = customers.slice(0, count);

  selectedCustomers.forEach((customer, index) => {
    const messageCount = Math.floor(Math.random() * 8 + 3);
    const messages = generateMessages(`conversation-${index + 1}`, messageCount);
    const lastMessage = messages[messages.length - 1];
    const unreadCount = Math.floor(Math.random() * 3);

    conversations.push({
      id: `conversation-${index + 1}`,
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      messages,
      unreadCount,
      lastMessageAt: lastMessage.timestamp,
      status: Math.random() > 0.8 ? "paused" : "active",
      aiEnabled: Math.random() > 0.2,
      assignedTo: Math.random() > 0.7 ? "Mike Rodriguez" : undefined,
      tags: [],
      priority: ["low", "medium", "high", "urgent"][Math.floor(Math.random() * 4)] as "low" | "medium" | "high" | "urgent",
    });
  });

  return conversations.sort((a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime());
}

function generateMessages(conversationId: string, count: number): Message[] {
  const messages: Message[] = [];
  let timestamp = Date.now() - (count * 2 * 60 * 60 * 1000);

  for (let i = 0; i < count; i++) {
    const sender = i % 2 === 0 ? "customer" : Math.random() > 0.7 ? "team" : "ai";
    const content = sender === "customer"
      ? customerMessages[Math.floor(Math.random() * customerMessages.length)]
      : sender === "ai"
      ? aiMessages[Math.floor(Math.random() * aiMessages.length)]
      : teamMessages[Math.floor(Math.random() * teamMessages.length)];

    timestamp += Math.random() * 3 * 60 * 60 * 1000;

    messages.push({
      id: `message-${conversationId}-${i + 1}`,
      conversationId,
      sender,
      senderName: sender === "customer" ? "Customer" : sender === "ai" ? "AI Assistant" : "Mike Rodriguez",
      content,
      timestamp: new Date(timestamp),
      read: i < count - Math.floor(Math.random() * 3),
      metadata: sender === "ai" ? {
        aiGenerated: true,
        needsApproval: false,
        approved: true,
      } : undefined,
    });
  }

  return messages;
}

export function generateInternalNotes(conversationId: string, count: number): InternalNote[] {
  const noteTemplates = [
    "Customer mentioned they have a dog - use pet-safe products",
    "Prefers morning appointments",
    "Previous service had excellent results",
    "Request follow-up in 2 weeks",
  ];

  const notes: InternalNote[] = [];

  for (let i = 0; i < count; i++) {
    notes.push({
      id: `note-${conversationId}-${i + 1}`,
      conversationId,
      authorId: "user-1",
      authorName: "Mike Rodriguez",
      content: noteTemplates[Math.floor(Math.random() * noteTemplates.length)],
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    });
  }

  return notes;
}
