"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  X,
  Send,
  Sparkles,
  TrendingUp,
  Users,
  AlertCircle,
  BarChart3,
  UserCheck,
  FileText,
  Calendar,
  MessageCircle,
  Target,
  DollarSign,
  CheckCircle2,
  Minimize2,
  Maximize2,
} from "lucide-react";
import { generateDashboardStats } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface CommandWidget {
  id: string;
  icon: any;
  label: string;
  prompt: string;
  color: string;
}

const quickCommands: CommandWidget[] = [
  {
    id: "priorities",
    icon: AlertCircle,
    label: "Today's Priorities",
    prompt: "What tasks and items need my immediate attention right now?",
    color: "bg-red-500",
  },
  {
    id: "lead-analysis",
    icon: TrendingUp,
    label: "Lead Analysis",
    prompt: "Summarize today's leads and highlight high-priority opportunities",
    color: "bg-blue-500",
  },
  {
    id: "revenue-report",
    icon: DollarSign,
    label: "Revenue Report",
    prompt: "Give me a detailed revenue and performance report for this month",
    color: "bg-green-500",
  },
  {
    id: "followups",
    icon: UserCheck,
    label: "Follow-ups",
    prompt: "Which customers should I follow up with and why?",
    color: "bg-orange-500",
  },
  {
    id: "approvals",
    icon: CheckCircle2,
    label: "Pending Approvals",
    prompt: "Show me all pending approvals for estimates and AI-generated messages",
    color: "bg-yellow-500",
  },
  {
    id: "conversion-stats",
    icon: Target,
    label: "Conversion Stats",
    prompt: "Show me conversion statistics and pipeline performance",
    color: "bg-purple-500",
  },
];

const generateAIResponse = (userMessage: string): string => {
  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes("lead") && (lowerMessage.includes("today") || lowerMessage.includes("summary"))) {
    return `📊 **Today's Lead Summary**

**New Leads: 5**
- 3 from SMS inquiries
- 2 from website contact form

**High-Priority:**
1. 🔥 **Sarah Martinez** - $850 value
   Very engaged, neighbor referral
   **Action:** Send estimate today

2. 💼 **Robert Chen** - $1,200 value
   Commercial, needs quote EOD
   **Action:** Schedule site visit

Would you like me to generate estimates?`;
  }

  if (lowerMessage.includes("attention") || lowerMessage.includes("priority") || lowerMessage.includes("priorities")) {
    return `⚠️ **Priority Dashboard**

**🔴 URGENT (2)**
1. Approve John Smith estimate ($450)
   Expires in 2 days
2. Resolve Thursday 2pm scheduling conflict

**🟡 HIGH PRIORITY (5)**
1. Review 3 pending estimates ($1,850)
2. Follow up on 5 sent estimates
3. Address Jennifer Wilson pricing question
4. Schedule Robert Chen site visit
5. Send Sarah Martinez estimate

**Recommended Order:**
1. Resolve scheduling conflict (5 min)
2. Approve John Smith estimate (2 min)
3. Send Sarah Martinez estimate (3 min)

Shall I help with any of these?`;
  }

  if (lowerMessage.includes("follow") || lowerMessage.includes("inactive")) {
    return `🎯 **Follow-up Strategy**

**HIGH-VALUE INACTIVE**
1. **Michael Brown** - 75 days, $2,400 LTV
   Draft: "Hi Michael! 🌱 Spring is here - ready to schedule?"

2. **Lisa Garcia** - 90 days, $1,800 LTV
   Draft: "Hi Lisa! 15% off spring package for valued customers"

**PENDING ESTIMATES**
1. David Lee - $380 (7 days)
2. Amy Johnson - $520 (5 days)

**AI Recommendation:**
Launch reactivation campaign Tuesday 10am
Expected: 6-8 customer reactivations

Should I draft these messages?`;
  }

  if (lowerMessage.includes("revenue") || lowerMessage.includes("performance") || lowerMessage.includes("report")) {
    return `📈 **Revenue Report**

**THIS MONTH**
💰 $12,450 (↑18% vs Jan)
👥 8 new customers
✅ 42 jobs completed
💵 $296 avg job value

**PIPELINE**
🎯 42% conversion (Industry: 35%)
⚡ 12 min response time
📊 67% estimate acceptance

**AI IMPACT**
🤖 156 messages sent
⭐ 94% satisfaction
⏱️ 18 hours saved

**FORECAST**
March: $14,200-16,500

Need details on any metric?`;
  }

  if (lowerMessage.includes("approval") || lowerMessage.includes("pending")) {
    return `✋ **Pending Approvals**

**ESTIMATES (3)**
1. Robert Johnson - $650 (2h ago)
2. Maria Santos - $420 (5h ago)
   Flag: Custom pricing
3. Tech Solutions - $1,250 (1d ago)
   Flag: Non-standard area

**MESSAGES (2)**
1. Jennifer Wilson price match
2. Bulk inactive campaign (8 recipients)

**Total Value:** $2,320

What would you like to review first?`;
  }

  if (lowerMessage.includes("conversion") || lowerMessage.includes("stats")) {
    return `🎯 **Conversion Analysis**

**Overall: 42%** (Industry: 35%) 🌟

**By Stage:**
- New → Qualified: 85%
- Qualified → Estimate: 78%
- Estimate → Accepted: 67%
- Accepted → Scheduled: 92%
- Scheduled → Completed: 95%

**AI vs Human:**
🤖 AI: 48% conversion
👤 Human: 38% conversion

**Why AI wins:**
- 3 min response (vs 2.1 hrs)
- 24/7 availability
- Consistent messaging

**Recommendations:**
1. Increase AI automation
2. Day-2 follow-up on estimates
3. Focus on referrals (9.2/10 quality)

Want implementation help?`;
  }

  return `I'm your AI assistant! 🤖

**Quick commands:**
- "What needs attention?"
- "Today's leads"
- "Revenue report"
- "Who to follow up with?"
- "Show pending approvals"

Or click a command above!`;
};

interface AIAgentSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIAgentSidebar({ isOpen, onClose }: AIAgentSidebarProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const stats = generateDashboardStats();

  // Initial greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting: ChatMessage = {
        id: "initial",
        role: "assistant",
        content: `👋 Hi! I'm your AI assistant.

Quick snapshot:
• ${stats.activeLeads} active leads
• ${stats.unreadMessages} unread messages
• ${stats.pendingTasks} pending tasks
• $${stats.revenueThisMonth.toLocaleString()} revenue MTD

How can I help?`,
        timestamp: new Date(),
      };
      setMessages([greeting]);
    }
  }, [isOpen]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: generateAIResponse(content),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 800 + Math.random() * 400);
  };

  const handleCommandClick = (prompt: string) => {
    handleSendMessage(prompt);
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full bg-background border-l shadow-2xl z-50 transition-all duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full",
          isMinimized ? "w-96" : "w-[480px]"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-card">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <div>
                <h2 className="font-semibold text-sm">AI Agent</h2>
                <p className="text-xs text-muted-foreground">Always here to help</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? (
                  <Maximize2 className="h-4 w-4" />
                ) : (
                  <Minimize2 className="h-4 w-4" />
                )}
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Commands */}
          {!isMinimized && (
            <div className="p-4 border-b bg-muted/30">
              <p className="text-xs font-medium text-muted-foreground mb-3">
                Quick Commands
              </p>
              <div className="grid grid-cols-2 gap-2">
                {quickCommands.map((command) => {
                  const Icon = command.icon;
                  return (
                    <button
                      key={command.id}
                      onClick={() => handleCommandClick(command.prompt)}
                      className="flex items-center gap-2 p-2 rounded-lg border bg-background hover:bg-accent transition-colors text-left"
                    >
                      <div className={`${command.color} rounded p-1`}>
                        <Icon className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-xs font-medium truncate">
                        {command.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-lg p-3",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    {message.role === "assistant" && (
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-3 w-3 text-primary" />
                        <span className="text-xs font-medium">AI Assistant</span>
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </p>
                    <p
                      className={cn(
                        "text-xs mt-2",
                        message.role === "user"
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
                      )}
                    >
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-3 w-3 text-primary animate-pulse" />
                      <div className="flex gap-1">
                        <div className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" />
                        <div
                          className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        />
                        <div
                          className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t bg-card">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputValue);
              }}
              className="space-y-2"
            >
              <div className="flex gap-2">
                <Input
                  placeholder={isMinimized ? "Ask..." : "Ask me anything..."}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={isTyping}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!inputValue.trim() || isTyping}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Press Enter to send
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
