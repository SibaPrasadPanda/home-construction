import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TopBar } from "@/components/layout/top-bar";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentExpenses } from "@/components/dashboard/recent-expenses";
import { RecentNotes } from "@/components/dashboard/recent-notes";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { ProgressTimeline } from "@/components/dashboard/progress-timeline";
import { AddExpenseModal } from "@/components/modals/add-expense-modal";
import { AddNoteModal } from "@/components/modals/add-note-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { exportToCSV } from "@/lib/utils";
import type { Expense, Note, Milestone } from "@shared/schema";

export default function Dashboard() {
  const [addExpenseOpen, setAddExpenseOpen] = useState(false);
  const [addNoteOpen, setAddNoteOpen] = useState(false);
  const { toast } = useToast();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: expenses = [], isLoading: expensesLoading } = useQuery<Expense[]>({
    queryKey: ["/api/expenses"],
  });

  const { data: notes = [], isLoading: notesLoading } = useQuery<Note[]>({
    queryKey: ["/api/notes"],
  });

  const { data: milestones = [], isLoading: milestonesLoading } = useQuery<Milestone[]>({
    queryKey: ["/api/milestones"],
  });

  const handleExportData = () => {
    if (expenses.length === 0) {
      toast({
        title: "No data to export",
        description: "Add some expenses first to export data",
        variant: "destructive",
      });
      return;
    }

    const exportData = expenses.map(expense => ({
      Date: expense.date,
      Description: expense.description,
      Category: expense.category,
      Vendor: expense.vendor,
      Amount: expense.amount,
    }));

    exportToCSV(exportData, `nivasa-expenses-${new Date().toISOString().split('T')[0]}.csv`);
    
    toast({
      title: "Export successful",
      description: "Expense data exported to CSV file",
    });
  };

  return (
    <div className="flex-1 ml-64">
      <TopBar 
        title="Dashboard" 
        description="Track your home construction progress" 
      />
      
      <main className="p-6 space-y-6">
        {/* Stats Cards */}
        {statsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : stats ? (
          <StatsCards stats={stats} />
        ) : null}

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Expenses */}
          {expensesLoading ? (
            <Skeleton className="lg:col-span-2 h-96" />
          ) : (
            <RecentExpenses expenses={expenses} />
          )}

          {/* Recent Notes & Quick Actions */}
          <div className="space-y-6">
            {notesLoading ? (
              <Skeleton className="h-72" />
            ) : (
              <RecentNotes 
                notes={notes} 
                onAddNote={() => setAddNoteOpen(true)} 
              />
            )}

            <QuickActions
              onAddExpense={() => setAddExpenseOpen(true)}
              onAddNote={() => setAddNoteOpen(true)}
              onExportData={handleExportData}
            />
          </div>
        </div>

        {/* Progress Timeline */}
        {milestonesLoading ? (
          <Skeleton className="h-80" />
        ) : (
          <ProgressTimeline milestones={milestones} />
        )}
      </main>

      {/* Modals */}
      <AddExpenseModal 
        open={addExpenseOpen} 
        onOpenChange={setAddExpenseOpen} 
      />
      <AddNoteModal 
        open={addNoteOpen} 
        onOpenChange={setAddNoteOpen} 
      />
    </div>
  );
}
