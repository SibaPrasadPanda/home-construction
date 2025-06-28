import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Note } from "@shared/schema";

interface RecentNotesProps {
  notes: Note[];
  onAddNote: () => void;
}

const tagColors = {
  materials: "bg-construction-100 text-construction-600 border-construction-500",
  labor: "bg-blue-100 text-blue-600 border-blue-500",
  ideas: "bg-yellow-100 text-yellow-600 border-yellow-500",
  "to buy": "bg-green-100 text-green-600 border-green-500",
};

export function RecentNotes({ notes, onAddNote }: RecentNotesProps) {
  const recentNotes = notes.slice(0, 3);

  return (
    <Card>
      <CardHeader className="border-b border-border">
        <div className="flex justify-between items-center">
          <CardTitle>Recent Notes</CardTitle>
          <Button variant="outline" size="icon" onClick={onAddNote}>
            <Plus size={16} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {recentNotes.map((note) => (
          <div key={note.id} className="border-l-4 border-construction-500 pl-4">
            <div className="flex items-center space-x-2 mb-2">
              {note.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className={tagColors[tag as keyof typeof tagColors] || "bg-gray-100 text-gray-600"}
                >
                  {tag}
                </Badge>
              ))}
            </div>
            <p className="text-sm font-medium text-foreground">{note.title}</p>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{note.content}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
