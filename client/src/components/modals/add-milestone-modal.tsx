import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface AddMilestoneModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddMilestoneModal({ open, onOpenChange }: AddMilestoneModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [expectedDate, setExpectedDate] = useState("");
  const queryClient = useQueryClient();

  const addMilestoneMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/milestones", {
        title,
        description,
        expectedDate: expectedDate || null,
        status: "pending",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/milestones"] });
      setTitle("");
      setDescription("");
      setExpectedDate("");
      onOpenChange(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMilestoneMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Milestone</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Milestone Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <Input
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <Input
            type="date"
            placeholder="Expected Date"
            value={expectedDate}
            onChange={e => setExpectedDate(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={addMilestoneMutation.isPending}>Add</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
