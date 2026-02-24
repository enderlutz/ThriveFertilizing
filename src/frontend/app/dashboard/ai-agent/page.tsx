"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Send,
  Sparkles,
  TrendingUp,
  Users,
  MessageSquare,
  AlertCircle,
  BarChart3,
  UserCheck,
  FileText,
  Calendar,
  Zap,
  MessageCircle,
  Target,
  DollarSign,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { generateDashboardStats } from "@/lib/mock-data";

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
  description: string;
  prompt: string;
  category: "analytics" | "customer" | "tasks" | "communication";
  color: string;
}

const commandWidgets: CommandWidget[] = [
  // Analytics
  {
    id: "revenue-report",
    icon: DollarSign,
    label: "Revenue Report",
    description: "This month's performance",
    prompt: "Give me a detailed revenue and performance report for this month",
    category: "analytics",
    color: "bg-green-500",
  },
  {
    id: "lead-analysis",
    icon: TrendingUp,
    label: "Lead Analysis",
    description: "Today's lead summary",
    prompt: "Summarize today's leads and highlight high-priority opportunities",
    category: "analytics",
    color: "bg-blue-500",
  },
  {
    id: "conversion-stats",
    icon: Target,
    label: "Conversion Stats",
    description: "Pipeline conversion rates",
    prompt: "Show me conversion statistics and pipeline performance",
    category: "analytics",
    color: "bg-purple-500",
  },

  // Customer Management
  {
    id: "followups",
    icon: UserCheck,
    label: "Follow-ups",
    description: "Who to contact today",
    prompt: "Which customers should I follow up with and why?",
    category: "customer",
    color: "bg-orange-500",
  },
  {
    id: "inactive-customers",
    icon: Users,
    label: "Win-Back Campaign",
    description: "Reactivate inactive customers",
    prompt: "List inactive high-value customers and draft reactivation messages",
    category: "customer",
    color: "bg-pink-500",
  },
  {
    id: "satisfaction",
    icon: MessageCircle,
    label: "Customer Satisfaction",
    description: "Recent feedback check",
    prompt: "Analyze recent customer interactions and satisfaction levels",
    category: "customer",
    color: "bg-teal-500",
  },

  // Task Management
  {
    id: "priorities",
    icon: AlertCircle,
    label: "Today's Priorities",
    description: "What needs attention",
    prompt: "What tasks and items need my immediate attention right now?",
    category: "tasks",
    color: "bg-red-500",
  },
  {
    id: "approvals",
    icon: CheckCircle2,
    label: "Pending Approvals",
    description: "Estimates & messages",
    prompt: "Show me all pending approvals for estimates and AI-generated messages",
    category: "tasks",
    color: "bg-yellow-500",
  },
  {
    id: "schedule-conflicts",
    icon: Calendar,
    label: "Schedule Review",
    description: "Check for conflicts",
    prompt: "Review this week's schedule and identify any conflicts or gaps",
    category: "tasks",
    color: "bg-indigo-500",
  },

  // Communication
  {
    id: "draft-response",
    icon: MessageSquare,
    label: "Draft Response",
    description: "Customer pricing query",
    prompt: "Help me draft a response to a customer asking about pricing for a 10,000 sq ft lawn",
    category: "communication",
    color: "bg-cyan-500",
  },
  {
    id: "estimate-generator",
    icon: FileText,
    label: "Generate Estimate",
    description: "Create new estimate",
    prompt: "Generate an estimate for a standard lawn fertilization service on an 8,000 sq ft property",
    category: "communication",
    color: "bg-emerald-500",
  },
  {
    id: "bulk-message",
    icon: Zap,
    label: "Campaign Draft",
    description: "Seasonal promotion",
    prompt: "Draft a spring fertilization campaign message for my customer list",
    category: "communication",
    color: "bg-violet-500",
  },
];

// Mock AI responses based on prompts
const generateAIResponse = (userMessage: string): string => {
  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes("lead") && (lowerMessage.includes("today") || lowerMessage.includes("summary"))) {
    return `📊 **Today's Lead Summary**

**New Leads: 5**
- 3 from SMS inquiries
- 2 from website contact form

**High-Priority Opportunities:**
1. 🔥 **Sarah Martinez** - 15,000 sq ft property
   - Service: Full service package (~$850 value)
   - Status: Very engaged, responded within 10 minutes
   - Note: Mentioned neighbor's recommendation
   - **Action:** Send estimate today

2. 💼 **Robert Chen** - Commercial property
   - Service: Aeration + fertilization (~$1,200 value)
   - Status: Looking for ongoing monthly service
   - Note: Needs quote by end of day
   - **Action:** Schedule site visit

3. **Jennifer Lopez** - 12,000 sq ft residential
   - Service: Weed control + fertilization (~$450)
   - Status: Comparing quotes
   - Note: Price-sensitive

**Conversion Opportunity: 85%** (Sarah & Robert)

Would you like me to generate estimates for the high-priority leads?`;
  }

  if (lowerMessage.includes("attention") || lowerMessage.includes("priority") || lowerMessage.includes("priorities")) {
    return `⚠️ **Priority Dashboard**

**🔴 URGENT (2 items)**
1. **Approve estimate for John Smith**
   - Amount: $450
   - AI-generated, ready for review
   - Expires in: 2 days

2. **Scheduling conflict - Thursday 2pm**
   - Two appointments overlap
   - Need to reschedule one customer

**🟡 HIGH PRIORITY (5 items)**
1. Review 3 pending estimate approvals (Total: $1,850)
2. Follow up on 5 sent estimates (No response 5+ days)
3. Address AI conversation flag: Jennifer Wilson pricing question
4. Schedule site visit for Robert Chen (Commercial lead)
5. Send estimate to Sarah Martinez (Hot lead)

**📊 Quick Stats**
- 8 unread messages (AI handling 6)
- 5 pending tasks total
- 2 overdue tasks ⏰
- 12 appointments scheduled this week

**Recommended Order:**
1. Resolve scheduling conflict (5 min)
2. Approve John Smith estimate (2 min)
3. Send Sarah Martinez estimate (3 min)
4. Review other approvals (10 min)

Shall I help with any of these?`;
  }

  if (lowerMessage.includes("follow") || lowerMessage.includes("inactive") || lowerMessage.includes("win-back")) {
    return `🎯 **Customer Follow-up Strategy**

**HIGH-VALUE INACTIVE (Last 60+ days)**
1. **Michael Brown**
   - Last service: 75 days ago
   - Lifetime value: $2,400
   - Pattern: Usually schedules spring treatment by now
   - **Suggested message:** "Hi Michael! 🌱 Spring is here - ready to schedule your lawn treatment? We have your usual package ready to go."

2. **Lisa Garcia**
   - Last service: 90 days ago
   - Lifetime value: $1,800
   - Rating: ⭐⭐⭐⭐⭐ (5/5)
   - **Suggested message:** "Hi Lisa! As a valued customer, we're offering 15% off our spring fertilization package. Your lawn is ready for its seasonal treatment!"

3. **David Martinez**
   - Last service: 120 days ago
   - Lifetime value: $1,500
   - Note: Had excellent results last year

**PENDING ESTIMATES (No Response)**
1. David Lee - $380 estimate sent 7 days ago
2. Amy Johnson - $520 estimate sent 5 days ago
3. Tom Wilson - $295 estimate sent 4 days ago

**AI RECOMMENDATION:**
Launch automated reactivation campaign:
- Segment 1: VIP customers (15% discount)
- Segment 2: Standard follow-up
- Timing: Tuesday 10am (best response rate)
- Expected reactivation: 6-8 customers

Should I draft these messages and schedule the campaign?`;
  }

  if (lowerMessage.includes("draft") || lowerMessage.includes("response") || lowerMessage.includes("pricing") || lowerMessage.includes("10,000") || lowerMessage.includes("10000")) {
    return `✍️ **Draft Customer Response**

---
**To:** [Customer Name]
**Re:** Lawn Fertilization Pricing
**Tone:** Professional, Friendly
**Estimated Conversion:** 68%

---

Hi [Customer Name]! 👋

Thanks for reaching out about fertilizing your lawn!

**For your 10,000 sq ft property, here's what we recommend:**

🌱 **Spring Fertilization Package**
- Pre-emergent weed control application
- Balanced fertilizer treatment
- Complete lawn health assessment
- Pet and kid-safe products

💰 **Investment: $295**

**What's Included:**
✓ Professional-grade products
✓ Certified technicians
✓ Satisfaction guarantee
✓ Free follow-up visit if needed
✓ Same-day service available

📅 **Availability:**
We have openings this Thursday or Friday. Which works better for you?

🎁 **Special:** Book this week and get a FREE lawn aeration assessment ($50 value)!

Looking forward to helping your lawn thrive!

Best,
[Your Name]
Thrive Fertilizing
📱 (555) 123-4567

---

**Analysis:**
- **Tone:** Balanced - professional yet approachable
- **Price anchor:** Mid-range competitive
- **CTA:** Clear (choose Thursday/Friday)
- **Value add:** Free assessment creates urgency

**Options:**
1. ✅ Send as-is
2. 📝 Adjust pricing
3. 🎨 Change tone (more formal/casual)
4. 📋 Generate formal estimate instead

What would you like to do?`;
  }

  if (lowerMessage.includes("revenue") || lowerMessage.includes("performance") || lowerMessage.includes("report")) {
    return `📈 **Revenue & Performance Report**

**THIS MONTH (Feb 2026)**
💰 Revenue: **$12,450** (↑ 18% vs Jan)
👥 New Customers: **8** (↑ 2)
✅ Jobs Completed: **42** (↑ 6)
💵 Avg Job Value: **$296**

**PIPELINE PERFORMANCE**
🎯 Lead-to-Customer: **42%** ⬆️ (Industry avg: 35%)
⚡ Avg Response Time: **12 minutes** ⬇️
📊 Estimate Acceptance: **67%** ⬆️
🔄 Repeat Bookings: **58%**

**AI AUTOMATION IMPACT**
🤖 Messages Processed: **156**
✋ Required Human Review: **12** (8%)
⭐ Customer Satisfaction: **94%**
⏱️ Time Saved: **~18 hours**
💡 Revenue Influenced: **$4,200**

**TOP SERVICES**
1. Lawn Fertilization - $5,200 (42%)
2. Weed Control - $3,100 (25%)
3. Pest Control - $2,400 (19%)
4. Aeration - $1,750 (14%)

**TRENDS & INSIGHTS**
📈 Spring demand peaking (next 2 weeks critical)
🌟 Referral traffic up 25%
💪 Strong repeat customer base
⚠️ Slight drop in estimate acceptance for large properties

**RECOMMENDATIONS**
1. 🚀 Increase crew capacity for peak demand
2. 🎁 Launch referral incentive program
3. 📞 Follow up with 8 high-value inactive customers
4. 💰 Consider tiered pricing for large properties

**FORECAST**
Expected March revenue: **$14,200-16,500** (based on current pipeline)

Need a deeper dive into any metric?`;
  }

  if (lowerMessage.includes("estimate") && lowerMessage.includes("generate")) {
    return `📋 **AI-Generated Estimate**

**ESTIMATE #EST-2026-047**
For: [Customer Name]
Property: 8,000 sq ft residential lawn
Service: Standard Lawn Fertilization
Valid Until: [30 days from today]

---

**SERVICE BREAKDOWN**

1. **Pre-Emergent Weed Control**
   - Prevents crabgrass and annual weeds
   - Quantity: 1 application
   - Price: $80.00

2. **Balanced Fertilizer Treatment**
   - Premium slow-release formula
   - Coverage: 8,000 sq ft
   - Quantity: 8 units @ $15/unit
   - Price: $120.00

3. **Lawn Health Assessment**
   - pH testing
   - Soil condition analysis
   - Treatment recommendations
   - Price: $50.00

**SUBTOTAL:** $250.00
**Tax (8.25%):** $20.63
**TOTAL:** **$270.63**

---

**TERMS & GUARANTEES**
✓ Pet & kid-safe products
✓ Licensed & insured technicians
✓ Satisfaction guarantee
✓ Follow-up visit included if needed
✓ Payment due upon completion

**NEXT STEPS**
Reply "APPROVED" to accept this estimate, or let me know if you'd like any adjustments!

---

**AI Confidence:** 95% (Standard service template)

**Actions:**
1. ✅ Send to customer for approval
2. 📝 Adjust pricing or services
3. 👤 Assign to team member for review

What would you like me to do?`;
  }

  if (lowerMessage.includes("campaign") || lowerMessage.includes("bulk") || lowerMessage.includes("spring") || lowerMessage.includes("seasonal")) {
    return `📢 **Spring Campaign Draft**

**CAMPAIGN:** Spring Fertilization 2026
**Target Audience:** All active customers (42) + warm leads (18)
**Timing:** Tuesday, 10:00 AM (optimal open rate)
**Channel:** SMS + Email combo

---

**SMS VERSION (160 chars):**

"🌱 Spring is here! Get your lawn ready with our fertilization package. Book this week: 15% OFF + FREE weed control. Reply YES for details! -Thrive Fertilizing"

---

**EMAIL VERSION:**

**Subject:** 🌱 Your Lawn's Spring Awakening Starts Here

Hi [First Name],

Spring has sprung, and your lawn is ready for its seasonal boost! 🌿

This is the perfect time to fertilize and prepare for a lush, green summer.

**SPECIAL SPRING OFFER**
✨ 15% OFF fertilization packages
🎁 FREE pre-emergent weed control ($80 value)
📅 Priority scheduling for existing customers

**WHY SPRING FERTILIZATION?**
- Promotes strong root growth
- Prevents weed invasion
- Prepares lawn for summer heat
- Boosts overall lawn health

**LIMITED TIME:** Book by [Date] to claim your discount!

[BOOK NOW BUTTON]

Questions? Just reply to this email or call us at (555) 123-4567.

Let's make your lawn the envy of the neighborhood! 🏡

Green regards,
[Your Name]
Thrive Fertilizing

---

**CAMPAIGN ANALYTICS**
📊 Expected Open Rate: 45-55%
🎯 Expected Conversion: 18-22%
💰 Projected Revenue: $3,200-4,500
⏱️ ROI: 12x

**SEGMENTATION**
- VIP Customers (15+ lifetime jobs): 20% discount
- Active Customers (5+ jobs): 15% discount
- Leads/1-4 jobs: 10% discount

**A/B TEST OPTIONS**
Version A: Focus on discount (above)
Version B: Focus on lawn health benefits
Version C: Urgency-based (limited slots)

Should I:
1. ✅ Schedule campaign as-is
2. 🧪 Set up A/B test
3. 📝 Adjust messaging
4. 👥 Modify audience segmentation`;
  }

  if (lowerMessage.includes("approval") || lowerMessage.includes("pending")) {
    return `✋ **Pending Approvals Queue**

**ESTIMATES PENDING REVIEW (3)**

1. **EST-2026-045** - Robert Johnson
   - Service: Full service package
   - Amount: $650
   - Created: 2 hours ago
   - AI Confidence: 92%
   - **Action needed:** Review & approve

2. **EST-2026-046** - Maria Santos
   - Service: Aeration + fertilization
   - Amount: $420
   - Created: 5 hours ago
   - AI Confidence: 88%
   - Flag: Custom pricing adjustment
   - **Action needed:** Review pricing

3. **EST-2026-044** - Tech Solutions Inc.
   - Service: Commercial property (large)
   - Amount: $1,250
   - Created: 1 day ago
   - AI Confidence: 75%
   - Flag: Non-standard service area
   - **Action needed:** Review terms

**AI MESSAGES PENDING (2)**

1. **Conversation with Jennifer Wilson**
   - Topic: Price match request
   - AI Draft: Prepared counter-offer
   - Sensitivity: Medium
   - **Action needed:** Review response before sending

2. **Bulk message to inactive customers (8 recipients)**
   - Campaign: Reactivation offer
   - Discount: 15% off next service
   - **Action needed:** Approve campaign

**TOTAL VALUE PENDING:** $2,320

**QUICK ACTIONS:**
🟢 Approve All (if confident)
🔍 Review Individual Items
❌ Decline with Feedback

What would you like to review first?`;
  }

  if (lowerMessage.includes("schedule") || lowerMessage.includes("calendar") || lowerMessage.includes("conflict")) {
    return `📅 **Schedule Analysis - This Week**

**OVERVIEW**
- Total Appointments: **12**
- Team Utilization: **78%**
- Available Slots: **8**

**⚠️ CONFLICTS DETECTED (1)**

**Thursday, Feb 27 - 2:00 PM**
- **Appointment A:** David Lee - 123 Oak St (1.5 hrs)
- **Appointment B:** Sarah Martinez - 456 Pine Ave (1.5 hrs)
- **Assigned:** Both to Mike Rodriguez
- **Issue:** Overlap - both scheduled same time

**Suggested Resolution:**
1. Move Sarah Martinez to 10:00 AM Thursday (available)
2. Or reschedule David Lee to Friday 2:00 PM (available)
3. Or assign one to Sarah Johnson (team member, available both times)

**CAPACITY ANALYSIS**

**Monday (Feb 24)**
- 🟢 3 appointments | 2 slots available
- Peak: 10am-2pm

**Tuesday (Feb 25)**
- 🟢 2 appointments | 4 slots available
- Light day - good for emergency bookings

**Wednesday (Feb 26)**
- 🟡 4 appointments | 1 slot available
- Near capacity

**Thursday (Feb 27)**
- 🔴 3 appointments + CONFLICT | 0 slots available
- Over capacity - need resolution

**Friday (Feb 28)**
- 🟢 2 appointments | 3 slots available
- Good catch-up day

**RECOMMENDATIONS**
1. 🔧 Resolve Thursday conflict immediately
2. 📞 Utilize Tuesday's light schedule for follow-ups
3. 🎯 Fill Friday slots with pending leads
4. ⚠️ Block time for emergency same-day requests

Would you like me to:
- Send reschedule options to customers?
- Optimize the week's schedule?
- Show next week's forecast?`;
  }

  if (lowerMessage.includes("satisfaction") || lowerMessage.includes("feedback") || lowerMessage.includes("customer interaction")) {
    return `⭐ **Customer Satisfaction Analysis**

**OVERALL SCORE: 4.7/5** ⬆️ (up from 4.5 last month)

**RECENT INTERACTIONS (Last 7 days)**

**😊 POSITIVE (15 interactions)**
- "Excellent service, very professional!"
- "Lawn looks amazing, thank you!"
- "Quick response time, appreciated"
- "Fair pricing for quality work"

**😐 NEUTRAL (4 interactions)**
- Questions about service timing
- Price comparisons with competitors
- Scheduling preferences

**😟 NEEDS ATTENTION (1 interaction)**
- **Customer:** James Peterson
- **Issue:** Expected results not visible yet (treated 3 days ago)
- **Status:** AI explained typical 7-10 day timeline
- **Follow-up:** Scheduled check-in call for day 8
- **Risk Level:** LOW (normal expectation management)

**AI PERFORMANCE METRICS**
- Response Satisfaction: **94%** ⬆️
- Issue Resolution: **89%** ⬆️
- Escalation Rate: **8%** ⬇️ (within target)
- Avg Response Quality: **4.6/5**

**COMMON PRAISE THEMES**
1. Fast response time (mentioned 12x)
2. Professional service (mentioned 10x)
3. Clear communication (mentioned 8x)
4. Fair pricing (mentioned 6x)

**IMPROVEMENT OPPORTUNITIES**
1. Service timeline expectations (3 mentions)
2. Pricing transparency for add-ons (2 mentions)
3. Online booking system request (4 mentions)

**TRENDING UP**
✅ Response speed recognition
✅ Referral mentions (+40%)
✅ Service quality ratings

**RECOMMENDED ACTIONS**
1. 📋 Create service timeline FAQ
2. 💰 Publish transparent pricing add-on sheet
3. 🌐 Consider implementing online booking
4. 📞 Follow up with James Peterson on day 8

Overall: **Customers are very happy!** Keep up the great work! 🎉`;
  }

  if (lowerMessage.includes("conversion") || lowerMessage.includes("pipeline") || lowerMessage.includes("stats")) {
    return `🎯 **Pipeline Conversion Analysis**

**OVERALL CONVERSION RATE: 42%** (Industry: 35%)
Performance: **Above Average** 🌟

**STAGE-BY-STAGE BREAKDOWN**

1. **New Lead → Qualification**
   - Rate: 85% (17/20)
   - Avg Time: 2.3 hours
   - Drop-off: Unresponsive leads (15%)

2. **Qualification → Estimate Needed**
   - Rate: 78% (13/17)
   - Avg Time: 4.1 hours
   - Drop-off: Service out of area (12%), Too expensive (10%)

3. **Estimate Sent → Accepted**
   - Rate: 67% (8/12) ⬆️
   - Avg Time: 2.8 days
   - Drop-off: Price shopping (20%), No response (13%)

4. **Accepted → Scheduled**
   - Rate: 92% (7/8)
   - Avg Time: 1.2 days
   - Drop-off: Scheduling conflicts (8%)

5. **Scheduled → Completed**
   - Rate: 95% (18/19)
   - Avg Time: Service delivery
   - Drop-off: Weather cancellations (5%)

**KEY METRICS**

📊 **Lead Quality Score:** 8.2/10
- SMS leads: 8.9/10
- Website leads: 7.8/10
- Referrals: 9.2/10 (highest converting!)

⏱️ **Speed to Estimate:** 6.4 hours avg
- Target: <8 hours ✅
- Best: 45 minutes (AI-generated)
- Slowest: 2.1 days (custom commercial)

💰 **Average Deal Value**
- Estimate sent: $385
- Accepted: $412 (upsells working!)
- Completed: $408

**BOTTLENECKS IDENTIFIED**

⚠️ **Estimate Response Time**
- 33% of estimates go unanswered
- Optimal follow-up: Day 3 (+22% recovery)
- Best practice: Send reminder on day 2

⚠️ **Price Resistance**
- 20% lost to competitors
- Avg competitor price: -12% lower
- Your value-add: Service quality, guarantee

**AI IMPACT ON CONVERSION**

🤖 AI-Handled Leads: **48% conversion** ⬆️
👤 Human-Handled Leads: **38% conversion**

**Why AI performs better:**
- Response time: 3 min vs 2.1 hours
- Consistency in messaging
- No leads forgotten
- 24/7 availability

**RECOMMENDATIONS**

1. 🚀 **Increase AI automation** for initial contact
2. 📞 **Implement day-2 follow-up** on estimates
3. 💎 **Focus on referral program** (highest conversion)
4. 📝 **Create value justification** document for pricing
5. ⚡ **Reduce estimate-to-send time** to <4 hours

**FORECAST**
With these improvements:
- Expected conversion: **48-52%**
- Revenue impact: +$2,400/month

Want me to help implement any of these recommendations?`;
  }

  // Default response
  return `I'm your AI business assistant! 🤖

I can help you with:

**📊 Analytics & Reports**
- Revenue and performance analysis
- Lead conversion statistics
- Customer satisfaction tracking

**👥 Customer Management**
- Follow-up recommendations
- Win-back campaigns
- Satisfaction analysis

**✅ Task Management**
- Priority identification
- Approval queue
- Schedule optimization

**💬 Communication**
- Draft customer responses
- Generate estimates
- Create marketing campaigns

**Quick Commands:**
Try asking:
- "What are today's priorities?"
- "Show me pending approvals"
- "Which customers need follow-up?"
- "Give me a revenue report"
- "Draft a spring campaign"

Or click any command widget above to get started! What would you like to know?`;
};

export default function AIAgentPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const scrollRef = useRef<HTMLDivElement>(null);
  const stats = generateDashboardStats();

  // Initial greeting
  useEffect(() => {
    const greeting: ChatMessage = {
      id: "initial",
      role: "assistant",
      content: `Hello! 👋 I'm your AI business assistant.

I've been monitoring your business and here's a quick snapshot:
- **${stats.activeLeads}** active leads in the pipeline
- **${stats.unreadMessages}** unread customer messages
- **${stats.pendingTasks}** pending tasks (${stats.overdueTasks} overdue)
- **$${stats.revenueThisMonth.toLocaleString()}** revenue this month

Click any command widget above or ask me anything!`,
      timestamp: new Date(),
    };
    setMessages([greeting]);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI thinking and response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: generateAIResponse(content),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleCommandClick = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const categories = [
    { id: "all", label: "All Commands", icon: Sparkles },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "customer", label: "Customers", icon: Users },
    { id: "tasks", label: "Tasks", icon: AlertCircle },
    { id: "communication", label: "Communication", icon: MessageCircle },
  ];

  const filteredCommands =
    selectedCategory === "all"
      ? commandWidgets
      : commandWidgets.filter((cmd) => cmd.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">AI Agent</h1>
            <p className="text-muted-foreground mt-1">
              Your intelligent business command center
            </p>
          </div>
        </div>
      </div>

      {/* AI Performance Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Automation</CardTitle>
            <Zap className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">Tasks handled automatically</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18hrs</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages Sent</CardTitle>
            <MessageCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">12 needed approval (8%)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.7/5</div>
            <p className="text-xs text-muted-foreground">Customer rating</p>
          </CardContent>
        </Card>
      </div>

      {/* Command Widgets */}
      <Card>
        <CardHeader>
          <CardTitle>Command Widgets</CardTitle>
          <CardDescription>Quick access to common AI tasks and insights</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Category Filter */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="shrink-0"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {category.label}
                </Button>
              );
            })}
          </div>

          {/* Command Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCommands.map((command) => {
              const Icon = command.icon;
              return (
                <Card
                  key={command.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary"
                  onClick={() => handleCommandClick(command.prompt)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`${command.color} rounded-lg p-2`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm">{command.label}</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {command.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card className="flex flex-col h-[600px]">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <CardTitle className="text-base">AI Assistant Active</CardTitle>
            </div>
            <Badge variant="secondary" className="text-xs">
              Powered by Claude
            </Badge>
          </div>
        </CardHeader>

        {/* Messages */}
        <ScrollArea className="flex-1 p-6" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-lg p-4 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <div className="flex items-start gap-2 mb-1">
                    {message.role === "assistant" && (
                      <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p
                        className={`text-xs mt-2 ${
                          message.role === "user"
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary animate-pulse" />
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
        <Separator />
        <div className="p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="flex gap-2"
          >
            <Input
              placeholder="Ask me anything or click a command widget above..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isTyping}
              className="flex-1"
            />
            <Button type="submit" disabled={!inputValue.trim() || isTyping}>
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-2">
            Press Enter to send • Responses are simulated for demo purposes
          </p>
        </div>
      </Card>
    </div>
  );
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
