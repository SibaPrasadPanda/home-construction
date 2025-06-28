import {
  expenses,
  notes,
  milestones,
  project,
  type Expense,
  type InsertExpense,
  type Note,
  type InsertNote,
  type Milestone,
  type InsertMilestone,
  type Project,
  type InsertProject
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // Expense methods
  getAllExpenses(): Promise<Expense[]>;
  getExpense(id: number): Promise<Expense | undefined>;
  createExpense(expense: InsertExpense): Promise<Expense>;
  updateExpense(id: number, expense: Partial<InsertExpense>): Promise<Expense | undefined>;
  deleteExpense(id: number): Promise<boolean>;
  
  // Note methods
  getAllNotes(): Promise<Note[]>;
  getNote(id: number): Promise<Note | undefined>;
  createNote(note: InsertNote): Promise<Note>;
  updateNote(id: number, note: Partial<InsertNote>): Promise<Note | undefined>;
  deleteNote(id: number): Promise<boolean>;
  
  // Milestone methods
  getAllMilestones(): Promise<Milestone[]>;
  getMilestone(id: number): Promise<Milestone | undefined>;
  createMilestone(milestone: InsertMilestone): Promise<Milestone>;
  updateMilestone(id: number, milestone: Partial<InsertMilestone>): Promise<Milestone | undefined>;
  deleteMilestone(id: number): Promise<boolean>;
  
  // Project methods
  getProject(): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(project: Partial<InsertProject>): Promise<Project | undefined>;
}

export class MemStorage implements IStorage {
  private expenses: Map<number, Expense>;
  private notes: Map<number, Note>;
  private milestones: Map<number, Milestone>;
  private projectData: Project | undefined;
  private currentExpenseId: number = 1;
  private currentNoteId: number = 1;
  private currentMilestoneId: number = 1;
  private currentProjectId: number = 1;

  constructor() {
    this.expenses = new Map();
    this.notes = new Map();
    this.milestones = new Map();
    this.initializeData();
  }

  private initializeData() {
    // Start with empty data - users will create their own content
  }

  // Expense methods
  async getAllExpenses(): Promise<Expense[]> {
    return Array.from(this.expenses.values()).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async getExpense(id: number): Promise<Expense | undefined> {
    return this.expenses.get(id);
  }

  async createExpense(insertExpense: InsertExpense): Promise<Expense> {
    const id = this.currentExpenseId++;
    const expense: Expense = { ...insertExpense, id };
    this.expenses.set(id, expense);
    return expense;
  }

  async updateExpense(id: number, updateData: Partial<InsertExpense>): Promise<Expense | undefined> {
    const expense = this.expenses.get(id);
    if (!expense) return undefined;
    
    const updatedExpense = { ...expense, ...updateData };
    this.expenses.set(id, updatedExpense);
    return updatedExpense;
  }

  async deleteExpense(id: number): Promise<boolean> {
    return this.expenses.delete(id);
  }

  // Note methods
  async getAllNotes(): Promise<Note[]> {
    return Array.from(this.notes.values());
  }

  async getNote(id: number): Promise<Note | undefined> {
    return this.notes.get(id);
  }

  async createNote(insertNote: InsertNote): Promise<Note> {
    const id = this.currentNoteId++;
    const note: Note = { 
      ...insertNote, 
      id,
      tags: insertNote.tags || [],
      type: insertNote.type || "text",
      completed: insertNote.completed ?? false
    };
    this.notes.set(id, note);
    return note;
  }

  async updateNote(id: number, updateData: Partial<InsertNote>): Promise<Note | undefined> {
    const note = this.notes.get(id);
    if (!note) return undefined;
    
    const updatedNote = { ...note, ...updateData };
    this.notes.set(id, updatedNote);
    return updatedNote;
  }

  async deleteNote(id: number): Promise<boolean> {
    return this.notes.delete(id);
  }

  // Milestone methods
  async getAllMilestones(): Promise<Milestone[]> {
    return Array.from(this.milestones.values()).sort((a, b) => a.order - b.order);
  }

  async getMilestone(id: number): Promise<Milestone | undefined> {
    return this.milestones.get(id);
  }

  async createMilestone(insertMilestone: InsertMilestone): Promise<Milestone> {
    const id = this.currentMilestoneId++;
    const milestone: Milestone = { 
      ...insertMilestone, 
      id,
      status: insertMilestone.status || "pending",
      expectedDate: insertMilestone.expectedDate || null,
      completedDate: insertMilestone.completedDate || null,
      order: insertMilestone.order || 0
    };
    this.milestones.set(id, milestone);
    return milestone;
  }

  async updateMilestone(id: number, updateData: Partial<InsertMilestone>): Promise<Milestone | undefined> {
    const milestone = this.milestones.get(id);
    if (!milestone) return undefined;
    
    const updatedMilestone = { ...milestone, ...updateData };
    this.milestones.set(id, updatedMilestone);
    return updatedMilestone;
  }

  async deleteMilestone(id: number): Promise<boolean> {
    return this.milestones.delete(id);
  }

  // Project methods
  async getProject(): Promise<Project | undefined> {
    return this.projectData;
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.currentProjectId++;
    this.projectData = { 
      ...insertProject, 
      id,
      status: insertProject.status || "planning",
      description: insertProject.description || null,
      targetCompletionDate: insertProject.targetCompletionDate || null,
      actualCompletionDate: insertProject.actualCompletionDate || null,
    };
    return this.projectData;
  }

  async updateProject(updateData: Partial<InsertProject>): Promise<Project | undefined> {
    if (!this.projectData) return undefined;
    
    this.projectData = { ...this.projectData, ...updateData };
    return this.projectData;
  }
}

export const storage = new MemStorage();