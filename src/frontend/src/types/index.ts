export type Priority = "low" | "medium" | "high";
export type Filter = "all" | "active" | "completed";
export type SortOption =
  | "createdAt"
  | "dueDate"
  | "priority"
  | "alphabetical"
  | "manual";

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Todo {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: number | null;
  category: string | null;
  completed: boolean;
  createdAt: number;
  sortOrder: number;
  subtasks: Subtask[];
}

export interface CreateTodoInput {
  title: string;
  description: string;
  priority: Priority;
  dueDate: number | null;
  category: string | null;
}

export interface UpdateTodoInput {
  id: string;
  title?: string;
  description?: string;
  priority?: Priority;
  dueDate?: number | null;
  category?: string | null;
  completed?: boolean;
  sortOrder?: number;
}

export interface UserPreferences {
  darkMode: boolean;
}

export type Category = string;
