import { Hammer, Wrench, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Expense } from "@shared/schema";
import { Link } from "wouter";

interface RecentExpensesProps {
  expenses: Expense[];
}

const categoryIcons = {
  Foundation: Hammer,
  Plumbing: Wrench,
  Electrical: Zap,
  Materials: Hammer,
  Labor: Hammer,
};

const categoryColors = {
  Foundation: "bg-construction-100 dark:bg-construction-900/20 text-construction-600",
  Plumbing: "bg-blue-100 dark:bg-blue-900/20 text-blue-600",
  Electrical: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600",
  Materials: "bg-green-100 dark:bg-green-900/20 text-green-600",
  Labor: "bg-purple-100 dark:bg-purple-900/20 text-purple-600",
};

export function RecentExpenses({ expenses }: RecentExpensesProps) {
  const recentExpenses = expenses.slice(0, 3);

  return (
    <Card className="lg:col-span-2">
      <CardHeader className="border-b border-border">
        <div className="flex justify-between items-center">
          <CardTitle>Recent Expenses</CardTitle>
          <Link href="/finance">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {recentExpenses.map((expense) => {
            const Icon = categoryIcons[expense.category as keyof typeof categoryIcons] || Hammer;
            const colorClass = categoryColors[expense.category as keyof typeof categoryColors] || categoryColors.Materials;
            
            return (
              <div key={expense.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 ${colorClass} rounded-lg flex items-center justify-center`}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{expense.description}</p>
                    <p className="text-sm text-muted-foreground">{expense.vendor}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">{formatCurrency(expense.amount)}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(expense.date)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
