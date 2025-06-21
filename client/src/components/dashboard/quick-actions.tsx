import { PlusCircle, StickyNote, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface QuickActionsProps {
  onAddExpense: () => void;
  onAddNote: () => void;
  onExportData: () => void;
}

export function QuickActions({ onAddExpense, onAddNote, onExportData }: QuickActionsProps) {
  return (
    <Card>
      <CardHeader className="border-b border-border">
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-3">
        <Button
          onClick={onAddExpense}
          className="w-full justify-start bg-construction-50 dark:bg-construction-900/20 text-construction-700 dark:text-construction-400 hover:bg-construction-100 dark:hover:bg-construction-900/30"
          variant="outline"
        >
          <PlusCircle className="mr-2" size={16} />
          Add Expense
        </Button>
        
        <Button
          onClick={onAddNote}
          className="w-full justify-start bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30"
          variant="outline"
        >
          <StickyNote className="mr-2" size={16} />
          Add Note
        </Button>
        
        <Button
          onClick={onExportData}
          className="w-full justify-start bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30"
          variant="outline"
        >
          <Download className="mr-2" size={16} />
          Export Data
        </Button>
      </CardContent>
    </Card>
  );
}
