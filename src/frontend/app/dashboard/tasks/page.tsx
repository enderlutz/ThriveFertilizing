"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, CheckCircle2, Circle, Clock, AlertCircle } from "lucide-react";
import { generateTasks } from "@/lib/mock-data";
import { Task, TaskStatus } from "@/types";

const statusConfig = {
  pending: { label: "Pending", icon: Circle, color: "text-yellow-500" },
  in_progress: { label: "In Progress", icon: Clock, color: "text-blue-500" },
  completed: { label: "Completed", icon: CheckCircle2, color: "text-green-500" },
  cancelled: { label: "Cancelled", icon: Circle, color: "text-gray-500" },
};

export default function TasksPage() {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | "all">("all");

  useEffect(() => {
    setAllTasks(generateTasks(30));
  }, []);

  const filteredTasks =
    selectedStatus === "all"
      ? allTasks
      : allTasks.filter((task) => task.status === selectedStatus);

  const tasksByStatus = {
    pending: allTasks.filter((t) => t.status === "pending").length,
    in_progress: allTasks.filter((t) => t.status === "in_progress").length,
    completed: allTasks.filter((t) => t.status === "completed").length,
    overdue: allTasks.filter(
      (t) => t.status === "pending" && t.dueDate && t.dueDate < new Date()
    ).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all tasks and action items
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Circle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasksByStatus.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasksByStatus.in_progress}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasksByStatus.completed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasksByStatus.overdue}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Button
          variant={selectedStatus === "all" ? "default" : "outline"}
          onClick={() => setSelectedStatus("all")}
        >
          All Tasks
        </Button>
        <Button
          variant={selectedStatus === "pending" ? "default" : "outline"}
          onClick={() => setSelectedStatus("pending")}
        >
          Pending
        </Button>
        <Button
          variant={selectedStatus === "in_progress" ? "default" : "outline"}
          onClick={() => setSelectedStatus("in_progress")}
        >
          In Progress
        </Button>
        <Button
          variant={selectedStatus === "completed" ? "default" : "outline"}
          onClick={() => setSelectedStatus("completed")}
        >
          Completed
        </Button>
      </div>

      {/* Tasks List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedStatus === "all" ? "All Tasks" : statusConfig[selectedStatus as TaskStatus]?.label}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTasks.map((task, index) => {
              const StatusIcon = statusConfig[task.status].icon;
              const isOverdue =
                task.status === "pending" && task.dueDate && task.dueDate < new Date();

              return (
                <div key={task.id}>
                  {index > 0 && <Separator className="my-4" />}
                  <div className="flex items-start gap-4">
                    <StatusIcon
                      className={`h-5 w-5 mt-0.5 ${statusConfig[task.status].color}`}
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-medium">{task.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {task.description}
                          </p>
                        </div>
                        <Badge
                          variant={
                            task.priority === "urgent"
                              ? "destructive"
                              : task.priority === "high"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {task.priority}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <Badge variant="outline" className="text-xs">
                          {task.type.replace(/_/g, " ")}
                        </Badge>
                        {task.assignedTo && (
                          <span>Assigned to {task.assignedTo}</span>
                        )}
                        {task.dueDate && (
                          <span className={isOverdue ? "text-red-500 font-medium" : ""}>
                            Due {formatDate(task.dueDate)}
                            {isOverdue && " (Overdue)"}
                          </span>
                        )}
                        <span>Created by {task.createdBy}</span>
                      </div>

                      {task.status === "pending" && (
                        <div className="flex gap-2 mt-2">
                          <Button size="sm">Mark In Progress</Button>
                          <Button size="sm" variant="outline">
                            Mark Complete
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function formatDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "today";
  if (days === -1) return "tomorrow";
  if (days === 1) return "yesterday";
  if (days < 0) return `in ${Math.abs(days)}d`;
  return `${days}d ago`;
}
