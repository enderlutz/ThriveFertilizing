"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { AIAgentSidebar } from "@/components/layout/AIAgentSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAIOpen, setIsAIOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <Header onOpenAI={() => setIsAIOpen(true)} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-muted/40 p-6">
          {children}
        </main>
      </div>

      {/* AI Agent Sidebar */}
      <AIAgentSidebar isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </div>
  );
}
