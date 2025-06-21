import { Check, Clock, Circle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/utils";
import type { Milestone } from "@shared/schema";

interface ProgressTimelineProps {
  milestones: Milestone[];
}

const statusConfig = {
  completed: {
    icon: Check,
    color: "bg-green-100 dark:bg-green-900/20 text-green-600",
    badge: "bg-green-100 text-green-800",
  },
  "in-progress": {
    icon: Clock,
    color: "bg-blue-100 dark:bg-blue-900/20 text-blue-600",
    badge: "bg-blue-100 text-blue-800",
  },
  pending: {
    icon: Circle,
    color: "bg-gray-200 dark:bg-gray-700 text-gray-400",
    badge: "bg-gray-100 text-gray-800",
  },
};

export function ProgressTimeline({ milestones }: ProgressTimelineProps) {
  return (
    <Card>
      <CardHeader className="border-b border-border">
        <CardTitle>Construction Milestones</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {milestones.map((milestone) => {
            const config = statusConfig[milestone.status as keyof typeof statusConfig];
            const Icon = config.icon;
            
            return (
              <div key={milestone.id} className="flex items-start space-x-4">
                <div className={`flex-shrink-0 w-10 h-10 ${config.color} rounded-full flex items-center justify-center`}>
                  <Icon size={16} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-foreground">{milestone.title}</h4>
                    <Badge className={config.badge}>
                      {milestone.status === "in-progress" ? "In Progress" : 
                       milestone.status.charAt(0).toUpperCase() + milestone.status.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
                  
                  {milestone.status === "in-progress" && (
                    <div className="mt-2">
                      <Progress value={75} className="h-2" />
                    </div>
                  )}
                  
                  <p className="text-xs text-muted-foreground mt-2">
                    {milestone.completedDate 
                      ? `Completed: ${formatDate(milestone.completedDate)}`
                      : `Expected: ${formatDate(milestone.expectedDate || "")}`
                    }
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
