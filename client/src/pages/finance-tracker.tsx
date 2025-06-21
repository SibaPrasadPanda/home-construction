import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TopBar } from "@/components/layout/top-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Download } from "lucide-react";
import { AddExpenseModal } from "@/components/modals/add-expense-modal";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatCurrency, formatDate, exportToCSV } from "@/lib/utils";
import type { Expense } from "@shared/schema";

export default function FinanceTracker() {
  const [addExpenseOpen, setAddExpenseOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: expenses = [], isLoading } = useQuery<Expense[]>({
    queryKey: ["/api/expenses"],
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/expenses/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/expenses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Success",
        description: "Expense deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete expense",
        variant: "destructive",
      });
    },
  });

  // Filter expenses
  const filteredExpenses = expenses.filter(expense => {
    const matchesCategory = !categoryFilter || expense.category === categoryFilter;
    const matchesSearch = !searchTerm || 
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Get unique categories
  const categories = Array.from(new Set(expenses.map(e => e.category)));

  // Calculate totals
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);

  const handleExport = () => {
    if (filteredExpenses.length === 0) {
      toast({
        title: "No data to export",
        description: "No expenses match your current filters",
        variant: "destructive",
      });
      return;
    }

    const exportData = filteredExpenses.map(expense => ({
      Date: expense.date,
      Description: expense.description,
      Category: expense.category,
      Vendor: expense.vendor,
      Amount: expense.amount,
    }));

    exportToCSV(exportData, `nivasa-expenses-filtered-${new Date().toISOString().split('T')[0]}.csv`);
    
    toast({
      title: "Export successful",
      description: "Filtered expense data exported to CSV file",
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this expense?")) {
      deleteExpenseMutation.mutate(id);
    }
  };

  return (
    <div className="flex-1 ml-64">
      <TopBar 
        title="Finance Tracker" 
        description="Manage your construction expenses and budget" 
      />
      
      <main className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(totalExpenses)}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Number of Expenses</p>
                <p className="text-2xl font-bold text-foreground">{filteredExpenses.length}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Average Expense</p>
                <p className="text-2xl font-bold text-foreground">
                  {filteredExpenses.length > 0 ? formatCurrency(totalExpenses / filteredExpenses.length) : "$0.00"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Expense Management</CardTitle>
              <div className="flex space-x-2">
                <Button onClick={handleExport} variant="outline">
                  <Download className="mr-2" size={16} />
                  Export CSV
                </Button>
                <Button onClick={() => setAddExpenseOpen(true)}>
                  <Plus className="mr-2" size={16} />
                  Add Expense
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Input
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="sm:max-w-xs"
              />
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="sm:max-w-xs">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Expenses Table */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Loading expenses...
                      </TableCell>
                    </TableRow>
                  ) : filteredExpenses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        No expenses found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredExpenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell>{formatDate(expense.date)}</TableCell>
                        <TableCell className="font-medium">{expense.description}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{expense.category}</Badge>
                        </TableCell>
                        <TableCell>{expense.vendor}</TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatCurrency(expense.amount)}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center space-x-2">
                            <Button size="sm" variant="outline">
                              <Edit size={14} />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleDelete(expense.id)}
                              disabled={deleteExpenseMutation.isPending}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>

      <AddExpenseModal 
        open={addExpenseOpen} 
        onOpenChange={setAddExpenseOpen} 
      />
    </div>
  );
}
