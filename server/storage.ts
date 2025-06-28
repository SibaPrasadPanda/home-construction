import { supabase } from "../client/src/lib/supabaseClient";
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

// Interface for storage operations
export interface IStorage {
  // Expense methods
  getAllExpenses(userId: string): Promise<Expense[]>;
  getExpense(id: string, userId: string): Promise<Expense | undefined>;
  createExpense(expense: InsertExpense, userId: string): Promise<Expense>;
  updateExpense(id: string, expense: Partial<InsertExpense>, userId: string): Promise<Expense | undefined>;
  deleteExpense(id: string, userId: string): Promise<boolean>;
  
  // Note methods
  getAllNotes(userId: string): Promise<Note[]>;
  getNote(id: string, userId: string): Promise<Note | undefined>;
  createNote(note: InsertNote, userId: string): Promise<Note>;
  updateNote(id: string, note: Partial<InsertNote>, userId: string): Promise<Note | undefined>;
  deleteNote(id: string, userId: string): Promise<boolean>;
  
  // Milestone methods
  getAllMilestones(userId: string): Promise<Milestone[]>;
  getMilestone(id: string, userId: string): Promise<Milestone | undefined>;
  createMilestone(milestone: InsertMilestone, userId: string): Promise<Milestone>;
  updateMilestone(id: string, milestone: Partial<InsertMilestone>, userId: string): Promise<Milestone | undefined>;
  deleteMilestone(id: string, userId: string): Promise<boolean>;
  
  // Project methods
  getProject(userId: string): Promise<Project | undefined>;
  createProject(project: InsertProject, userId: string): Promise<Project>;
  updateProject(project: Partial<InsertProject>, userId: string): Promise<Project | undefined>;
}

export class SupabaseStorage implements IStorage {
  // Project methods
  async getProject(userId: string): Promise<Project | undefined> {
    console.log('🔍 Fetching project from Supabase for user:', userId);
    
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('❌ Error fetching project:', error);
      throw new Error('Failed to fetch project');
    }

    console.log('✅ Project data from Supabase:', data);
    return data || undefined;
  }

  async createProject(insertProject: InsertProject, userId: string): Promise<Project> {
    console.log('🔄 Creating project in Supabase:', { insertProject, userId });
    
    const projectData = {
      ...insertProject,
      user_id: userId,
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

  async updateProject(updateData: Partial<InsertProject>, userId: string): Promise<Project | undefined> {
    console.log('🔄 Updating project in Supabase:', { updateData, userId });
    
    const { data, error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating project:', error);
      throw new Error('Failed to update project');
    }

    console.log('✅ Project updated in Supabase:', data);
    return data || undefined;
  }

  // Expense methods
  async getAllExpenses(userId: string): Promise<Expense[]> {
    console.log('🔍 Fetching expenses from Supabase for user:', userId);
    
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) {
      console.error('❌ Error fetching expenses:', error);
      throw new Error('Failed to fetch expenses');
    }

    console.log('✅ Expenses from Supabase:', data?.length || 0, 'records');
    return data || [];
  }

  async getExpense(id: string, userId: string): Promise<Expense | undefined> {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('❌ Error fetching expense:', error);
      throw new Error('Failed to fetch expense');
    }

    return data || undefined;
  }

  async createExpense(insertExpense: InsertExpense, userId: string): Promise<Expense> {
    console.log('🔄 Creating expense in Supabase:', { insertExpense, userId });
    
    const expenseData = {
      ...insertExpense,
      user_id: userId,
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

  async updateExpense(id: string, updateData: Partial<InsertExpense>, userId: string): Promise<Expense | undefined> {
    const { data, error } = await supabase
      .from('expenses')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating expense:', error);
      throw new Error('Failed to update expense');
    }

    return data || undefined;
  }

  async deleteExpense(id: string, userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('❌ Error deleting expense:', error);
      throw new Error('Failed to delete expense');
    }

    return true;
  }

  // Note methods
  async getAllNotes(userId: string): Promise<Note[]> {
    console.log('🔍 Fetching notes from Supabase for user:', userId);
    
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching notes:', error);
      throw new Error('Failed to fetch notes');
    }

    console.log('✅ Notes from Supabase:', data?.length || 0, 'records');
    return data || [];
  }

  async getNote(id: string, userId: string): Promise<Note | undefined> {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('❌ Error fetching note:', error);
      throw new Error('Failed to fetch note');
    }

    return data || undefined;
  }

  async createNote(insertNote: InsertNote, userId: string): Promise<Note> {
    console.log('🔄 Creating note in Supabase:', { insertNote, userId });
    
    const noteData = {
      ...insertNote,
      user_id: userId,
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

  async updateNote(id: string, updateData: Partial<InsertNote>, userId: string): Promise<Note | undefined> {
    const { data, error } = await supabase
      .from('notes')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating note:', error);
      throw new Error('Failed to update note');
    }

    return data || undefined;
  }

  async deleteNote(id: string, userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('❌ Error deleting note:', error);
      throw new Error('Failed to delete note');
    }

    return true;
  }

  // Milestone methods
  async getAllMilestones(userId: string): Promise<Milestone[]> {
    console.log('🔍 Fetching milestones from Supabase for user:', userId);
    
    const { data, error } = await supabase
      .from('milestones')
      .select('*')
      .eq('user_id', userId)
      .order('order', { ascending: true });

    if (error) {
      console.error('❌ Error fetching milestones:', error);
      throw new Error('Failed to fetch milestones');
    }

    console.log('✅ Milestones from Supabase:', data?.length || 0, 'records');
    return data || [];
  }

  async getMilestone(id: string, userId: string): Promise<Milestone | undefined> {
    const { data, error } = await supabase
      .from('milestones')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('❌ Error fetching milestone:', error);
      throw new Error('Failed to fetch milestone');
    }

    return data || undefined;
  }

  async createMilestone(insertMilestone: InsertMilestone, userId: string): Promise<Milestone> {
    console.log('🔄 Creating milestone in Supabase:', { insertMilestone, userId });
    
    const milestoneData = {
      ...insertMilestone,
      user_id: userId,
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

  async updateMilestone(id: string, updateData: Partial<InsertMilestone>, userId: string): Promise<Milestone | undefined> {
    const { data, error } = await supabase
      .from('milestones')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('❌ Error updating milestone:', error);
      throw new Error('Failed to update milestone');
    }

    return data || undefined;
  }

  async deleteMilestone(id: string, userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('milestones')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('❌ Error deleting milestone:', error);
      throw new Error('Failed to delete milestone');
    }

    return true;
  }
}

// Export the Supabase storage instance
export const storage = new SupabaseStorage();