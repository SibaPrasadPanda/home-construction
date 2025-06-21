import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TopBar } from "@/components/layout/top-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Check, Clock, Circle, Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatDate, calculateProgress } from "@/lib/utils";
import type { Milestone } from "@shared/schema";

export default function ProgressTracker() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: milestones = [], isLoading } = useQuery<Milestone[]>({
    queryKey: ["/api/milestones"],
  });

  const updateMilestoneMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const updateData: any = { status };
      if (status === "completed") {
        updateData.completedDate = new Date().toISOString().split('T')[0];
      }
      const response = await apiRequest("PUT", `/api/milestones/${id}`, updateData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/milestones"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Success",
        description: "Milestone updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update milestone",
        variant: "destructive",
      });
    },
  });

  const deleteMilestoneMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/milestones/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/milestones"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Success",
        description: "Milestone deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete milestone",
        variant: "destructive",
      });
    },
  });

  const statusConfig = {
    completed: {
      icon: Check,
      color: "bg-green-100 dark:bg-green-900/20 text-green-600",
      badge: "bg-green-100 text-green-800",
      nextStatus: null,
    },
    "in-progress": {
      icon: Clock,
      color: "bg-blue-100 dark:bg-blue-900/20 text-blue-600",
      badge: "bg-blue-100 text-blue-800",
      nextStatus: "completed",
    },
    pending: {
      icon: Circle,
      color: "bg-gray-200 dark:bg-gray-700 text-gray-400",
      badge: "bg-gray-100 text-gray-800",
      nextStatus: "in-progress",
    },
  };

  // Calculate overall progress
  const completedMilestones = milestones.filter(m => m.status === 'completed').length;
  const overallProgress = calculateProgress(completedMilestones, milestones.length);

  const handleStatusChange = (id: number, newStatus: string) => {
    updateMilestoneMutation.mutate({ id, status: newStatus });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this milestone?")) {
      deleteMilestoneMutation.mutate(id);
    }
  };

  return (
    <div className="flex-1 ml-64">
      <TopBar 
        title="Progress Tracker" 
        description="Monitor your construction milestones and timeline" 
      />
      
      <main className="p-6 space-y-6">
        {/* Progress Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Overall Progress</p>
                <p className="text-3xl font-bold text-foreground">{overallProgress}%</p>
                <Progress value={overallProgress} className="mt-2" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {milestones.filter(m => m.status === 'completed').length}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">
                  {milestones.filter(m => m.status === 'in-progress').length}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-gray-600">
                  {milestones.filter(m => m.status === 'pending').length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Milestones */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Construction Milestones</CardTitle>
              <Button>
                <Plus className="mr-2" size={16} />
                Add Milestone
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading milestones...</div>
            ) : milestones.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No milestones found</p>
              </div>
            ) : (
              <div className="space-y-6">
                {milestones.map((milestone) => {
                  const config = statusConfig[milestone.status as keyof typeof statusConfig];
                  const Icon = config.icon;
                  
                  return (
                    <div key={milestone.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <div className={`flex-shrink-0 w-12 h-12 ${config.color} rounded-full flex items-center justify-center`}>
                        <Icon size={20} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-foreground text-lg">{milestone.title}</h3>
                          <div className="flex items-center space-x-2">
                            <Badge className={config.badge}>
                              {milestone.status === "in-progress" ? "In Progress" : 
                               milestone.status.charAt(0).toUpperCase() + milestone.status.slice(1)}
                            </Badge>
                            <div className="flex space-x-1">
                              {config.nextStatus && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleStatusChange(milestone.id, config.nextStatus!)}
                                  disabled={updateMilestoneMutation.isPending}
                                >
                                  {config.nextStatus === "completed" ? "Complete" : "Start"}
                                </Button>
                              )}
                              <Button size="sm" variant="outline">
                                <Edit size={14} />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleDelete(milestone.id)}
                                disabled={deleteMilestoneMutation.isPending}
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground mb-3">{milestone.description}</p>
                        
                        {milestone.status === "in-progress" && (
                          <div className="mb-3">
                            <Progress value={75} className="h-2" />
                            <p className="text-xs text-muted-foreground mt-1">75% complete</p>
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">
                            {milestone.completedDate 
                              ? `Completed: ${formatDate(milestone.completedDate)}`
                              : milestone.expectedDate
                              ? `Expected: ${formatDate(milestone.expectedDate)}`
                              : "No date set"
                            }
                          </span>
                          <span className="text-muted-foreground">
                            Order: {milestone.order}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
