import {
  users,
  expenses,
  notes,
  milestones,
  project,
  type User,
  type UpsertUser,
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
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
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
  private users: Map<string, User>;
  private expenses: Map<number, Expense>;
  private notes: Map<number, Note>;
  private milestones: Map<number, Milestone>;
  private projectData: Project | undefined;
  private currentExpenseId: number = 1;
  private currentNoteId: number = 1;
  private currentMilestoneId: number = 1;
  private currentProjectId: number = 1;

  constructor() {
    this.users = new Map();
    this.expenses = new Map();
    this.notes = new Map();
    this.milestones = new Map();
    this.initializeData();
  }

  private initializeData() {
    // Initialize with sample project
    this.projectData = {
      id: 1,
      name: "Oakwood Residence",
      location: "123 Maple Street",
      totalBudget: "210000.00"
    };

    // Initialize with sample expenses
    const sampleExpenses: Expense[] = [
      {
        id: 1,
        amount: "8500.00",
        category: "Foundation",
        vendor: "ABC Construction Co.",
        description: "Concrete Foundation Work",
        date: "2024-10-15"
      },
      {
        id: 2,
        amount: "2340.00",
        category: "Plumbing",
        vendor: "Home Depot",
        description: "Plumbing Materials",
        date: "2024-10-14"
      },
      {
        id: 3,
        amount: "4200.00",
        category: "Electrical",
        vendor: "Spark Electric",
        description: "Electrical Installation",
        date: "2024-10-13"
      }
    ];

    sampleExpenses.forEach(expense => {
      this.expenses.set(expense.id, expense);
      this.currentExpenseId = Math.max(this.currentExpenseId, expense.id + 1);
    });

    // Initialize with sample notes
    const sampleNotes: Note[] = [
      {
        id: 1,
        title: "Order bathroom tiles",
        content: "Need to order 120 sq ft of ceramic tiles for master bathroom",
        tags: ["materials"],
        type: "text",
        completed: false
      },
      {
        id: 2,
        title: "Electrician follow-up",
        content: "Check on outlet installation in kitchen island",
        tags: ["labor"],
        type: "text",
        completed: false
      },
      {
        id: 3,
        title: "Kitchen backsplash design",
        content: "Consider subway tiles vs natural stone",
        tags: ["ideas"],
        type: "text",
        completed: false
      }
    ];

    sampleNotes.forEach(note => {
      this.notes.set(note.id, note);
      this.currentNoteId = Math.max(this.currentNoteId, note.id + 1);
    });

    // Initialize with sample milestones
    const sampleMilestones: Milestone[] = [
      {
        id: 1,
        title: "Foundation & Framing",
        description: "Foundation poured and basic framing completed",
        status: "completed",
        expectedDate: "2024-09-30",
        completedDate: "2024-09-30",
        order: 1
      },
      {
        id: 2,
        title: "Plumbing & Electrical",
        description: "Rough-in plumbing and electrical work",
        status: "in-progress",
        expectedDate: "2024-10-25",
        completedDate: null,
        order: 2
      },
      {
        id: 3,
        title: "Insulation & Drywall",
        description: "Wall insulation and drywall installation",
        status: "pending",
        expectedDate: "2024-11-01",
        completedDate: null,
        order: 3
      }
    ];

    sampleMilestones.forEach(milestone => {
      this.milestones.set(milestone.id, milestone);
      this.currentMilestoneId = Math.max(this.currentMilestoneId, milestone.id + 1);
    });
  }

  // User methods
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingUser = this.users.get(userData.id);
    const user: User = {
      id: userData.id,
      email: userData.email ?? null,
      firstName: userData.firstName ?? null,
      lastName: userData.lastName ?? null,
      profileImageUrl: userData.profileImageUrl ?? null,
      createdAt: existingUser?.createdAt || new Date(),
      updatedAt: new Date(),
    };
    this.users.set(userData.id, user);
    return user;
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
    this.projectData = { ...insertProject, id };
    return this.projectData;
  }

  async updateProject(updateData: Partial<InsertProject>): Promise<Project | undefined> {
    if (!this.projectData) return undefined;
    
    this.projectData = { ...this.projectData, ...updateData };
    return this.projectData;
  }
}

export const storage = new MemStorage();
