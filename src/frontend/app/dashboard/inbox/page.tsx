"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Search, Send, Pause, Play, MoreVertical } from "lucide-react";
import { generateConversations, generateCustomers } from "@/lib/mock-data";
import { Conversation } from "@/types";
import { cn } from "@/lib/utils";

export default function InboxPage() {
  const [allConversations, setAllConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const customers = generateCustomers(30);
    const conversations = generateConversations(customers, 20);
    setAllConversations(conversations);
    setSelectedConversation(conversations[0]);
  }, []);

  const filteredConversations = allConversations.filter((conv) =>
    conv.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Inbox</h1>
        <p className="text-muted-foreground mt-1">
          Manage all customer conversations in one place
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Conversation List */}
        <Card className="col-span-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                className={cn(
                  "p-4 border-b cursor-pointer hover:bg-accent transition-colors",
                  selectedConversation?.id === conversation.id && "bg-accent"
                )}
              >
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {conversation.customerName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-sm truncate">
                        {conversation.customerName}
                      </p>
                      {conversation.unreadCount > 0 && (
                        <Badge className="shrink-0">{conversation.unreadCount}</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-1">
                      {conversation.messages[conversation.messages.length - 1]?.content}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={conversation.aiEnabled ? "default" : "secondary"} className="text-xs">
                        {conversation.aiEnabled ? "AI Active" : "AI Paused"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(conversation.lastMessageAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Messages */}
        <Card className="col-span-2 flex flex-col overflow-hidden">
          {selectedConversation ? (
            <>
              {/* Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {selectedConversation.customerName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedConversation.customerName}</p>
                    <p className="text-xs text-muted-foreground">
                      {selectedConversation.customerPhone}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    {selectedConversation.aiEnabled ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Pause AI
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Resume AI
                      </>
                    )}
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedConversation.messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-3",
                      message.sender === "customer" ? "justify-start" : "justify-end"
                    )}
                  >
                    {message.sender === "customer" && (
                      <Avatar className="shrink-0">
                        <AvatarFallback>
                          {selectedConversation.customerName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        "max-w-[70%] rounded-lg p-3",
                        message.sender === "customer"
                          ? "bg-muted"
                          : message.sender === "ai"
                          ? "bg-primary/10 border border-primary"
                          : "bg-primary text-primary-foreground"
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-xs font-medium">{message.senderName}</p>
                        {message.metadata?.aiGenerated && (
                          <Badge variant="outline" className="text-xs">
                            AI
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                    {message.sender !== "customer" && (
                      <Avatar className="shrink-0">
                        <AvatarFallback>
                          {message.sender === "ai" ? "AI" : "MR"}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
              </div>

              {/* Input */}
              <Separator />
              <div className="p-4">
                <div className="flex gap-2">
                  <Input placeholder="Type your message..." />
                  <Button>
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Select a conversation to view messages
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function formatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return date.toLocaleDateString();
  } else if (hours > 0) {
    return `${hours}h ago`;
  } else if (minutes > 0) {
    return `${minutes}m ago`;
  } else {
    return "just now";
  }
}
