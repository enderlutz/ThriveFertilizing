"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Plus, FileText, DollarSign, Clock, CheckCircle, XCircle } from "lucide-react";
import { generateEstimates, generateCustomers } from "@/lib/mock-data";
import { EstimateStatus, Estimate } from "@/types";

const statusConfig: Record<EstimateStatus, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  draft: { label: "Draft", variant: "outline" },
  pending_approval: { label: "Pending Approval", variant: "secondary" },
  approved: { label: "Approved", variant: "default" },
  sent: { label: "Sent", variant: "default" },
  accepted: { label: "Accepted", variant: "default" },
  rejected: { label: "Rejected", variant: "destructive" },
  expired: { label: "Expired", variant: "outline" },
};

export default function EstimatesPage() {
  const [allEstimates, setAllEstimates] = useState<Estimate[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<EstimateStatus | "all">("all");

  useEffect(() => {
    const customers = generateCustomers(30);
    setAllEstimates(generateEstimates(customers, 25));
  }, []);

  const filteredEstimates = allEstimates.filter((estimate) => {
    const matchesSearch =
      estimate.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      estimate.serviceType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || estimate.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const stats = {
    total: allEstimates.length,
    pending: allEstimates.filter((e) =>
      ["pending_approval", "sent"].includes(e.status)
    ).length,
    accepted: allEstimates.filter((e) => e.status === "accepted").length,
    totalValue: allEstimates
      .filter((e) => e.status === "accepted")
      .reduce((sum, e) => sum + e.total, 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Estimates</h1>
          <p className="text-muted-foreground mt-1">
            Create, manage, and track customer estimates
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Estimate
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Estimates</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting response</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accepted</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.accepted}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accepted Value</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalValue.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedStatus === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus("all")}
              >
                All
              </Button>
              <Button
                variant={selectedStatus === "pending_approval" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus("pending_approval")}
              >
                Pending Approval
              </Button>
              <Button
                variant={selectedStatus === "sent" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus("sent")}
              >
                Sent
              </Button>
              <Button
                variant={selectedStatus === "accepted" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus("accepted")}
              >
                Accepted
              </Button>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search estimates..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Valid Until</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEstimates.map((estimate) => (
                <TableRow key={estimate.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">{estimate.customerName}</TableCell>
                  <TableCell>{estimate.serviceType}</TableCell>
                  <TableCell className="font-medium">
                    ${estimate.total.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusConfig[estimate.status].variant}>
                      {statusConfig[estimate.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {estimate.createdBy === "ai" && (
                        <Badge variant="outline" className="text-xs">
                          AI
                        </Badge>
                      )}
                      <span className="text-sm">{estimate.createdBy}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(estimate.createdAt)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(estimate.validUntil)}
                  </TableCell>
                  <TableCell className="text-right">
                    {estimate.status === "pending_approval" && (
                      <Button size="sm" variant="outline">
                        Review
                      </Button>
                    )}
                    {estimate.status === "approved" && (
                      <Button size="sm">Send</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
