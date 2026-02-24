export type MessageSender = "customer" | "ai" | "team" | "system";

export interface Message {
  id: string;
  conversationId: string;
  sender: MessageSender;
  senderName: string;
  content: string;
  timestamp: Date;
  read: boolean;
  attachments?: MessageAttachment[];
  metadata?: {
    aiGenerated?: boolean;
    needsApproval?: boolean;
    approved?: boolean;
    approvedBy?: string;
  };
}

export interface MessageAttachment {
  id: string;
  type: "image" | "document" | "video";
  url: string;
  filename: string;
  size: number;
}

export interface Conversation {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  messages: Message[];
  unreadCount: number;
  lastMessageAt: Date;
  status: "active" | "paused" | "archived";
  aiEnabled: boolean;
  assignedTo?: string;
  tags: string[];
  priority: "low" | "medium" | "high" | "urgent";
}

export interface InternalNote {
  id: string;
  conversationId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
}
