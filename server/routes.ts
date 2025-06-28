import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertExpenseSchema, insertNoteSchema, insertMilestoneSchema, insertProjectSchema } from "@shared/schema";
import { z } from "zod";
import { supabase } from "../client/src/lib/supabaseClient";

// Authentication middleware to get user from Supabase
const getAuthenticatedUser = async (req: any, res: any, next: any) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ message: "Unauthorized" });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Expense routes
  app.get("/api/expenses", getAuthenticatedUser, async (req: any, res) => {
    try {
      const expenses = await storage.getAllExpenses(req.user.id);
      res.json(expenses);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      res.status(500).json({ message: "Failed to fetch expenses" });
    }
  });

  app.get("/api/expenses/:id", getAuthenticatedUser, async (req: any, res) => {
    try {
      const id = req.params.id;
      const expense = await storage.getExpense(id, req.user.id);
      if (!expense) {
        return res.status(404).json({ message: "Expense not found" });
      }
      res.json(expense);
    } catch (error) {
      console.error("Error fetching expense:", error);
      res.status(500).json({ message: "Failed to fetch expense" });
    }
  });

  app.post("/api/expenses", getAuthenticatedUser, async (req: any, res) => {
    try {
      const validatedData = insertExpenseSchema.parse(req.body);
      const expense = await storage.createExpense(validatedData, req.user.id);
      res.status(201).json(expense);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid expense data", errors: error.errors });
      }
      console.error("Error creating expense:", error);
      res.status(500).json({ message: "Failed to create expense" });
    }
  });

  app.put("/api/expenses/:id", getAuthenticatedUser, async (req: any, res) => {
    try {
      const id = req.params.id;
      const validatedData = insertExpenseSchema.partial().parse(req.body);
      const expense = await storage.updateExpense(id, validatedData, req.user.id);
      if (!expense) {
        return res.status(404).json({ message: "Expense not found" });
      }
      res.json(expense);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid expense data", errors: error.errors });
      }
      console.error("Error updating expense:", error);
      res.status(500).json({ message: "Failed to update expense" });
    }
  });

  app.delete("/api/expenses/:id", getAuthenticatedUser, async (req: any, res) => {
    try {
      const id = req.params.id;
      const deleted = await storage.deleteExpense(id, req.user.id);
      if (!deleted) {
        return res.status(404).json({ message: "Expense not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting expense:", error);
      res.status(500).json({ message: "Failed to delete expense" });
    }
  });

  // Note routes
  app.get("/api/notes", getAuthenticatedUser, async (req: any, res) => {
    try {
      const notes = await storage.getAllNotes(req.user.id);
      res.json(notes);
    } catch (error) {
      console.error("Error fetching notes:", error);
      res.status(500).json({ message: "Failed to fetch notes" });
    }
  });

  app.post("/api/notes", getAuthenticatedUser, async (req: any, res) => {
    try {
      const validatedData = insertNoteSchema.parse(req.body);
      const note = await storage.createNote(validatedData, req.user.id);
      res.status(201).json(note);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid note data", errors: error.errors });
      }
      console.error("Error creating note:", error);
      res.status(500).json({ message: "Failed to create note" });
    }
  });

  app.put("/api/notes/:id", getAuthenticatedUser, async (req: any, res) => {
    try {
      const id = req.params.id;
      const validatedData = insertNoteSchema.partial().parse(req.body);
      const note = await storage.updateNote(id, validatedData, req.user.id);
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
      res.json(note);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid note data", errors: error.errors });
      }
      console.error("Error updating note:", error);
      res.status(500).json({ message: "Failed to update note" });
    }
  });

  app.delete("/api/notes/:id", getAuthenticatedUser, async (req: any, res) => {
    try {
      const id = req.params.id;
      const deleted = await storage.deleteNote(id, req.user.id);
      if (!deleted) {
        return res.status(404).json({ message: "Note not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting note:", error);
      res.status(500).json({ message: "Failed to delete note" });
    }
  });

  // Milestone routes
  app.get("/api/milestones", getAuthenticatedUser, async (req: any, res) => {
    try {
      const milestones = await storage.getAllMilestones(req.user.id);
      res.json(milestones);
    } catch (error) {
      console.error("Error fetching milestones:", error);
      res.status(500).json({ message: "Failed to fetch milestones" });
    }
  });

  app.post("/api/milestones", getAuthenticatedUser, async (req: any, res) => {
    try {
      const validatedData = insertMilestoneSchema.parse(req.body);
      const milestone = await storage.createMilestone(validatedData, req.user.id);
      res.status(201).json(milestone);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid milestone data", errors: error.errors });
      }
      console.error("Error creating milestone:", error);
      res.status(500).json({ message: "Failed to create milestone" });
    }
  });

  app.put("/api/milestones/:id", getAuthenticatedUser, async (req: any, res) => {
    try {
      const id = req.params.id;
      const validatedData = insertMilestoneSchema.partial().parse(req.body);
      const milestone = await storage.updateMilestone(id, validatedData, req.user.id);
      if (!milestone) {
        return res.status(404).json({ message: "Milestone not found" });
      }
      res.json(milestone);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid milestone data", errors: error.errors });
      }
      console.error("Error updating milestone:", error);
      res.status(500).json({ message: "Failed to update milestone" });
    }
  });

  app.delete("/api/milestones/:id", getAuthenticatedUser, async (req: any, res) => {
    try {
      const id = req.params.id;
      const deleted = await storage.deleteMilestone(id, req.user.id);
      if (!deleted) {
        return res.status(404).json({ message: "Milestone not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting milestone:", error);
      res.status(500).json({ message: "Failed to delete milestone" });
    }
  });

  // Project routes
  app.get("/api/project", getAuthenticatedUser, async (req: any, res) => {
    try {
      const project = await storage.getProject(req.user.id);
      if (!project) {
        return res.json(null); // Return null instead of 404 for empty state
      }
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.post("/api/project", getAuthenticatedUser, async (req: any, res) => {
    try {
      const validatedData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validatedData, req.user.id);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  app.put("/api/project", getAuthenticatedUser, async (req: any, res) => {
    try {
      const validatedData = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(validatedData, req.user.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid project data", errors: error.errors });
      }
      console.error("Error updating project:", error);
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  // Dashboard stats route
  app.get("/api/dashboard/stats", getAuthenticatedUser, async (req: any, res) => {
    try {
      const expenses = await storage.getAllExpenses(req.user.id);
      const notes = await storage.getAllNotes(req.user.id);
      const milestones = await storage.getAllMilestones(req.user.id);
      const project = await storage.getProject(req.user.id);

      const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
      const totalBudget = project ? parseFloat(project.budget) : 0;
      const budgetRemaining = totalBudget - totalExpenses;
      const budgetUsedPercent = totalBudget > 0 ? Math.round((totalExpenses / totalBudget) * 100) : 0;
      
      const completedMilestones = milestones.filter(m => m.status === 'completed').length;
      const progressPercent = milestones.length > 0 ? Math.round((completedMilestones / milestones.length) * 100) : 0;

      res.json({
        totalExpenses: totalExpenses.toFixed(2),
        budgetRemaining: budgetRemaining.toFixed(2),
        budgetUsedPercent,
        activeNotes: notes.length,
        progressPercent,
        totalBudget: totalBudget.toFixed(2)
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}