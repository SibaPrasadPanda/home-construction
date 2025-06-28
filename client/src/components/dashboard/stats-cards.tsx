import { DollarSign, IndianRupeeIcon, PiggyBank, StickyNote, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface StatsCardsProps {
  stats: {
    totalExpenses: string;
    budgetRemaining: string;
    budgetUsedPercent: number;
    activeNotes: number;
    progressPercent: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Expenses",
      value: formatCurrency(stats.totalExpenses),
      change: `${stats.budgetUsedPercent}% of budget used`,
      changeType: "positive" as const,
      icon: IndianRupeeIcon,
      bgColor: "bg-construction-100 dark:bg-construction-900/20",
      iconColor: "text-construction-600",
    },
    {
      title: "Budget Remaining",
      value: formatCurrency(stats.budgetRemaining),
      change: `${100 - stats.budgetUsedPercent}% of total`,
      changeType: "neutral" as const,
      icon: PiggyBank,
      bgColor: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      title: "Active Notes",
      value: stats.activeNotes.toString(),
      change: `${stats.activeNotes} active notes`,
      changeType: "positive" as const,
      icon: StickyNote,
      bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
      iconColor: "text-yellow-600",
    },
    {
      title: "Project Progress",
      value: `${stats.progressPercent}%`,
      change: "On schedule",
      changeType: "positive" as const,
      icon: TrendingUp,
      bgColor: "bg-green-100 dark:bg-green-900/20",
      iconColor: "text-green-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                  <p className="text-2xl font-bold text-foreground">{card.value}</p>
                  <p className={`text-sm mt-1 ${
                    card.changeType === 'positive' ? 'text-green-600' : 
                    card.changeType === 'negative' ? 'text-red-600' : 
                    'text-blue-600'
                  }`}>
                    {card.change}
                  </p>
                </div>
                <div className={`w-12 h-12 ${card.bgColor} rounded-xl flex items-center justify-center`}>
                  <Icon className={`${card.iconColor} text-xl`} size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
