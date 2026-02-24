"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { generateLeads, generateCustomers } from "@/lib/mock-data";
import { Lead, LeadStage } from "@/types";
import { DollarSign, User, Phone, MapPin, Plus } from "lucide-react";

const stages: { stage: LeadStage; label: string; color: string }[] = [
  { stage: "new_lead", label: "New Leads", color: "bg-blue-500" },
  { stage: "qualification", label: "Qualification", color: "bg-purple-500" },
  { stage: "estimate_needed", label: "Estimate Needed", color: "bg-yellow-500" },
  { stage: "estimate_sent", label: "Estimate Sent", color: "bg-orange-500" },
  { stage: "waiting_on_customer", label: "Awaiting Response", color: "bg-amber-500" },
  { stage: "scheduled", label: "Scheduled", color: "bg-green-500" },
  { stage: "in_progress", label: "In Progress", color: "bg-teal-500" },
  { stage: "completed", label: "Completed", color: "bg-emerald-500" },
];

export default function PipelinePage() {
  const [leadsByStage, setLeadsByStage] = useState<Record<LeadStage, Lead[]>>({
    new_lead: [],
    qualification: [],
    estimate_needed: [],
    estimate_sent: [],
    waiting_on_customer: [],
    scheduled: [],
    in_progress: [],
    completed: [],
    follow_up: [],
  });

  useEffect(() => {
    const customers = generateCustomers(40);
    const allLeads = generateLeads(customers, 40);

    // Group leads by stage
    const grouped = stages.reduce((acc, { stage }) => {
      acc[stage] = allLeads.filter((lead) => lead.stage === stage);
      return acc;
    }, {} as Record<LeadStage, Lead[]>);

    setLeadsByStage(grouped);
  }, []);

  return (
    <div className="space-y-6 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lead Pipeline</h1>
          <p className="text-muted-foreground mt-1">
            Track leads from initial contact to completed job
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Lead
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-4 gap-4 h-[calc(100vh-250px)]">
        {stages.slice(0, 8).map(({ stage, label, color }) => {
          const leads = leadsByStage[stage] || [];
          const totalValue = leads.reduce((sum, lead) => sum + (lead.estimatedValue || 0), 0);

          return (
            <div key={stage} className="flex flex-col min-w-0">
              <Card className="mb-2">
                <CardHeader className="p-4">
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${color}`} />
                    <CardTitle className="text-sm font-medium">{label}</CardTitle>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-2xl font-bold">{leads.length}</span>
                    <span className="text-xs text-muted-foreground">
                      ${totalValue.toLocaleString()}
                    </span>
                  </div>
                </CardHeader>
              </Card>

              <ScrollArea className="flex-1">
                <div className="space-y-3 pr-4">
                  {leads.map((lead) => (
                    <Card
                      key={lead.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {/* Header */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm truncate">
                                {lead.customerName}
                              </h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {lead.serviceType}
                              </p>
                            </div>
                            <Badge
                              variant={
                                lead.priority === "urgent"
                                  ? "destructive"
                                  : lead.priority === "high"
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs shrink-0"
                            >
                              {lead.priority}
                            </Badge>
                          </div>

                          {/* Details */}
                          <div className="space-y-1.5">
                            {lead.estimatedValue && (
                              <div className="flex items-center gap-2 text-xs">
                                <DollarSign className="h-3 w-3 text-muted-foreground" />
                                <span className="font-medium">
                                  ${lead.estimatedValue.toLocaleString()}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              <span className="truncate">{lead.customerPhone}</span>
                            </div>
                            {lead.propertyAddress && (
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <MapPin className="h-3 w-3 shrink-0" />
                                <span className="truncate">{lead.propertyAddress}</span>
                              </div>
                            )}
                          </div>

                          {/* Tags */}
                          {lead.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {lead.tags.map((tag, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}

                          {/* Footer */}
                          <div className="flex items-center justify-between pt-2 border-t">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <User className="h-3 w-3" />
                              <span>{lead.assignedTo || "Unassigned"}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formatDate(lead.lastActivityAt)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}
