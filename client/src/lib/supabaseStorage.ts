import { supabase } from "./supabaseClient";
import type {
  Expense,
  InsertExpense,
  Note,
  InsertNote,
  Milestone,
  InsertMilestone,
  Project,
  InsertProject
} from "@shared/schema";

// Direct Supabase storage operations for frontend
export class SupabaseStorage {
  // Project methods
  async getProject(): Promise<Project | null> {
    console.log('🔍 Fetching project from Supabase');
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('❌ Error fetching project:', error);
      throw new Error('Failed to fetch project');
    }

    console.log('✅ Project data from Supabase:', data);
    return data || null;
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    console.log('🔄 Creating project in Supabase:', insertProject);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const projectData = {
      ...insertProject,
      user_id: user.id,
    };

    const { data, error } = await supabase
      .from('projects')
      .insert(projectData)
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating project:', error);
      throw new Error('Failed to create project');
    }

    console.log('✅ Project created in Supabase:', data);
    return data;
  }

  async updateProject(updateData: Partial<InsertProject>): Promise<Project | null> {
    console.log('🔄 Updating project in Supabase:', updateData);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating project:', error);
      throw new Error('Failed to update project');
    }

    console.log('✅ Project updated in Supabase:', data);
    return data || null;
  }

  // Expense methods
  async getAllExpenses(): Promise<Expense[]> {
    console.log('🔍 Fetching expenses from Supabase');
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false });

    if (error) {
      console.error('❌ Error fetching expenses:', error);
      throw new Error('Failed to fetch expenses');
    }

    console.log('✅ Expenses from Supabase:', data?.length || 0, 'records');
    return data || [];
  }

  async createExpense(insertExpense: InsertExpense): Promise<Expense> {
    console.log('🔄 Creating expense in Supabase:', insertExpense);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const expenseData = {
      ...insertExpense,
      user_id: user.id,
    };

    const { data, error } = await supabase
      .from('expenses')
      .insert(expenseData)
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating expense:', error);
      throw new Error('Failed to create expense');
    }

    console.log('✅ Expense created in Supabase:', data);
    return data;
  }

  async deleteExpense(id: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('❌ Error deleting expense:', error);
      throw new Error('Failed to delete expense');
    }

    return true;
  }

  // Note methods
  async getAllNotes(): Promise<Note[]> {
    console.log('🔍 Fetching notes from Supabase');
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching notes:', error);
      throw new Error('Failed to fetch notes');
    }

    console.log('✅ Notes from Supabase:', data?.length || 0, 'records');
    return data || [];
  }

  async createNote(insertNote: InsertNote): Promise<Note> {
    console.log('🔄 Creating note in Supabase:', insertNote);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const noteData = {
      ...insertNote,
      user_id: user.id,
      tags: insertNote.tags || [],
      type: insertNote.type || "text",
      completed: insertNote.completed ?? false
    };

    const { data, error } = await supabase
      .from('notes')
      .insert(noteData)
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating note:', error);
      throw new Error('Failed to create note');
    }

    console.log('✅ Note created in Supabase:', data);
    return data;
  }

  async deleteNote(id: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('❌ Error deleting note:', error);
      throw new Error('Failed to delete note');
    }

    return true;
  }

  // Milestone methods
  async getAllMilestones(): Promise<Milestone[]> {
    console.log('🔍 Fetching milestones from Supabase');
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('milestones')
      .select('*')
      .eq('user_id', user.id)
      .order('order', { ascending: true });

    if (error) {
      console.error('❌ Error fetching milestones:', error);
      throw new Error('Failed to fetch milestones');
    }

    console.log('✅ Milestones from Supabase:', data?.length || 0, 'records');
    return data || [];
  }

  async createMilestone(insertMilestone: InsertMilestone): Promise<Milestone> {
    console.log('🔄 Creating milestone in Supabase:', insertMilestone);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const milestoneData = {
      ...insertMilestone,
      user_id: user.id,
      status: insertMilestone.status || "pending",
      expected_date: insertMilestone.expectedDate || null,
      completed_date: insertMilestone.completedDate || null,
      order: insertMilestone.order || 0
    };

    const { data, error } = await supabase
      .from('milestones')
      .insert(milestoneData)
      .select()
      .single();

    if (error) {
      console.error('❌ Error creating milestone:', error);
      throw new Error('Failed to create milestone');
    }

    console.log('✅ Milestone created in Supabase:', data);
    return data;
  }

  async updateMilestone(id: string, updateData: Partial<InsertMilestone>): Promise<Milestone | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('milestones')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating milestone:', error);
      throw new Error('Failed to update milestone');
    }

    return data || null;
  }

  async deleteMilestone(id: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('milestones')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('❌ Error deleting milestone:', error);
      throw new Error('Failed to delete milestone');
    }

    return true;
  }

  // Dashboard stats
  async getDashboardStats() {
    const [expenses, notes, milestones, project] = await Promise.all([
      this.getAllExpenses(),
      this.getAllNotes(),
      this.getAllMilestones(),
      this.getProject()
    ]);

    const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    const totalBudget = project ? parseFloat(project.budget) : 0;
    const budgetRemaining = totalBudget - totalExpenses;
    const budgetUsedPercent = totalBudget > 0 ? Math.round((totalExpenses / totalBudget) * 100) : 0;
    
    const completedMilestones = milestones.filter(m => m.status === 'completed').length;
    const progressPercent = milestones.length > 0 ? Math.round((completedMilestones / milestones.length) * 100) : 0;

    return {
      totalExpenses: totalExpenses.toFixed(2),
      budgetRemaining: budgetRemaining.toFixed(2),
      budgetUsedPercent,
      activeNotes: notes.length,
      progressPercent,
      totalBudget: totalBudget.toFixed(2)
    };
  }
}

// Export the storage instance
export const supabaseStorage = new SupabaseStorage();