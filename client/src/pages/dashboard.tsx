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
import { CreateProjectModal } from "@/components/modals/create-project-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { exportToCSV } from "@/lib/utils";
import { Home, Plus } from "lucide-react";
import { supabaseStorage } from "@/lib/supabaseStorage";
import type { Expense, Note, Milestone, Project } from "@shared/schema";

export default function Dashboard() {
  const [addExpenseOpen, setAddExpenseOpen] = useState(false);
  const [addNoteOpen, setAddNoteOpen] = useState(false);
  const [createProjectOpen, setCreateProjectOpen] = useState(false);
  const { toast } = useToast();

  const { data: project, isLoading: projectLoading } = useQuery<Project | null>({
    queryKey: ["project"],
    queryFn: () => supabaseStorage.getProject(),
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => supabaseStorage.getDashboardStats(),
    enabled: !!project, // Only fetch stats if project exists
  });

  const { data: expenses = [], isLoading: expensesLoading } = useQuery<Expense[]>({
    queryKey: ["expenses"],
    queryFn: () => supabaseStorage.getAllExpenses(),
    enabled: !!project,
  });

  const { data: notes = [], isLoading: notesLoading } = useQuery<Note[]>({
    queryKey: ["notes"],
    queryFn: () => supabaseStorage.getAllNotes(),
    enabled: !!project,
  });

  const { data: milestones = [], isLoading: milestonesLoading } = useQuery<Milestone[]>({
    queryKey: ["milestones"],
    queryFn: () => supabaseStorage.getAllMilestones(),
    enabled: !!project,
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

  // Show empty state if no project exists
  if (!projectLoading && !project) {
    return (
      <div className="flex-1 ml-64">
        <TopBar 
          title="Welcome to Nivasa" 
          description="Your home construction management system" 
        />
        
        <main className="p-6">
          <div className="flex items-center justify-center min-h-[600px]">
            <Card className="w-full max-w-lg text-center">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                  <Home className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Create Your First Project</CardTitle>
                <CardDescription>
                  Start by setting up your construction project to track expenses, notes, and progress milestones.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => setCreateProjectOpen(true)}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Project
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>

        <CreateProjectModal 
          open={createProjectOpen} 
          onOpenChange={setCreateProjectOpen} 
        />
      </div>
    );
  }

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
      <CreateProjectModal 
        open={createProjectOpen} 
        onOpenChange={setCreateProjectOpen} 
      />
    </div>
  );
}