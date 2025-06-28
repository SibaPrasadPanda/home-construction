import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TopBar } from "@/components/layout/top-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Edit, Trash2, FileText, CheckSquare, Link as LinkIcon } from "lucide-react";
import { AddNoteModal } from "@/components/modals/add-note-modal";
import { useToast } from "@/hooks/use-toast";
import { supabaseStorage } from "@/lib/supabaseStorage";
import type { Note } from "@shared/schema";

export default function Notes() {
  const [addNoteOpen, setAddNoteOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: notes = [], isLoading } = useQuery<Note[]>({
    queryKey: ["notes"],
    queryFn: () => supabaseStorage.getAllNotes(),
  });

  const deleteNoteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await supabaseStorage.deleteNote(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      toast({
        title: "Success",
        description: "Note deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Filter notes
  const filteredNotes = notes.filter(note => {
    const matchesSearch = !searchTerm || 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !tagFilter || note.tags.includes(tagFilter);
    const matchesType = !typeFilter || note.type === typeFilter;
    return matchesSearch && matchesTag && matchesType;
  });

  // Get unique tags
  const allTags = Array.from(new Set(notes.flatMap(note => note.tags)));

  const tagColors = {
    materials: "bg-construction-100 text-construction-600 border-construction-500",
    labor: "bg-blue-100 text-blue-600 border-blue-500",
    ideas: "bg-yellow-100 text-yellow-600 border-yellow-500",
    "to buy": "bg-green-100 text-green-600 border-green-500",
    permits: "bg-purple-100 text-purple-600 border-purple-500",
    design: "bg-pink-100 text-pink-600 border-pink-500",
    timeline: "bg-indigo-100 text-indigo-600 border-indigo-500",
  };

  const typeIcons = {
    text: FileText,
    checklist: CheckSquare,
    link: LinkIcon,
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this note?")) {
      deleteNoteMutation.mutate(id);
    }
  };

  return (
    <div className="flex-1 ml-64">
      <TopBar 
        title="Notes" 
        description="Organize your construction notes and ideas" 
      />
      
      <main className="p-6 space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Total Notes</p>
                <p className="text-2xl font-bold text-foreground">{notes.length}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Unique Tags</p>
                <p className="text-2xl font-bold text-foreground">{allTags.length}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Filtered Results</p>
                <p className="text-2xl font-bold text-foreground">{filteredNotes.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notes Management */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Notes Management</CardTitle>
              <Button onClick={() => setAddNoteOpen(true)}>
                <Plus className="mr-2" size={16} />
                Add Note
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  placeholder="Search notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={tagFilter || "all"} onValueChange={value => setTagFilter(value === "all" ? "" : value)}>
                <SelectTrigger className="sm:max-w-xs">
                  <SelectValue placeholder="Filter by tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tags</SelectItem>
                  {allTags.map(tag => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={typeFilter || "all"} onValueChange={value => setTypeFilter(value === "all" ? "" : value)}>
                <SelectTrigger className="sm:max-w-xs">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="checklist">Checklist</SelectItem>
                  <SelectItem value="link">Link</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Notes Grid */}
            {isLoading ? (
              <div className="text-center py-8">Loading notes...</div>
            ) : filteredNotes.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No notes found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNotes.map((note) => {
                  const TypeIcon = typeIcons[note.type as keyof typeof typeIcons];
                  
                  return (
                    <Card key={note.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center space-x-2">
                            <TypeIcon size={16} className="text-muted-foreground" />
                            <h3 className="font-semibold text-foreground line-clamp-1">{note.title}</h3>
                          </div>
                          <div className="flex space-x-1">
                            <Button size="sm" variant="ghost">
                              <Edit size={14} />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleDelete(note.id)}
                              disabled={deleteNoteMutation.isPending}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                          {note.content}
                        </p>
                        
                        {note.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {note.tags.map(tag => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className={`text-xs ${tagColors[tag as keyof typeof tagColors] || "bg-gray-100 text-gray-600"}`}
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <AddNoteModal 
        open={addNoteOpen} 
        onOpenChange={setAddNoteOpen} 
      />
    </div>
  );
}