import {
  loadPreferences,
  loadTodos,
  savePreferences,
  saveTodos,
} from "@/lib/localStorage";
import type {
  CreateTodoInput,
  Filter,
  Priority,
  SortOption,
  Subtask,
  Todo,
} from "@/types";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

interface TodoStore {
  todos: Todo[];
  filter: Filter;
  priorityFilter: Priority | "all";
  categoryFilter: string | null;
  searchQuery: string;
  sortOption: SortOption;
  darkMode: boolean;
  sidebarOpen: boolean;

  // Actions
  setFilter: (filter: Filter) => void;
  setPriorityFilter: (p: Priority | "all") => void;
  setCategoryFilter: (cat: string | null) => void;
  setSearchQuery: (q: string) => void;
  setSortOption: (s: SortOption) => void;
  toggleDarkMode: () => void;
  setSidebarOpen: (open: boolean) => void;

  createTodo: (input: CreateTodoInput) => Todo;
  updateTodo: (
    id: string,
    changes: Partial<Omit<Todo, "id" | "createdAt">>,
  ) => void;
  deleteTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
  markAllCompleted: () => void;
  deleteAllCompleted: () => void;
  reorderTodo: (id: string, newIndex: number) => void;

  addSubtask: (todoId: string, title: string) => void;
  toggleSubtask: (todoId: string, subtaskId: string) => void;
  deleteSubtask: (todoId: string, subtaskId: string) => void;

  getCategories: () => string[];
  getFilteredTodos: () => Todo[];
}

const initialTodos = loadTodos();
const initialPrefs = loadPreferences();

// Seed sample todos if empty
const seedTodos: Todo[] =
  initialTodos.length > 0
    ? initialTodos
    : [
        {
          id: generateId(),
          title: "Design system tokens review",
          description:
            "Audit OKLCH palette, verify contrast ratios across all theme variants",
          priority: "high",
          dueDate: Date.now() + 2 * 86400000,
          category: "Work",
          completed: false,
          createdAt: Date.now() - 3600000,
          sortOrder: 0,
          subtasks: [
            {
              id: generateId(),
              title: "Check foreground contrast",
              completed: true,
            },
            { id: generateId(), title: "Test dark mode", completed: false },
          ],
        },
        {
          id: generateId(),
          title: "Build drag-and-drop task reordering",
          description:
            "Implement touch-friendly DnD for both desktop and mobile",
          priority: "medium",
          dueDate: Date.now() + 5 * 86400000,
          category: "Work",
          completed: false,
          createdAt: Date.now() - 7200000,
          sortOrder: 1,
          subtasks: [],
        },
        {
          id: generateId(),
          title: "Morning run — 5K",
          description: "Pre-sunrise run at the park, goal is under 28 minutes",
          priority: "medium",
          dueDate: Date.now() + 86400000,
          category: "Health",
          completed: false,
          createdAt: Date.now() - 10800000,
          sortOrder: 2,
          subtasks: [],
        },
        {
          id: generateId(),
          title: "Read Atomic Habits chapter 7",
          description: "Focus on habit stacking and the two-minute rule",
          priority: "low",
          dueDate: null,
          category: "Personal",
          completed: true,
          createdAt: Date.now() - 86400000,
          sortOrder: 3,
          subtasks: [],
        },
        {
          id: generateId(),
          title: "Team retrospective preparation",
          description:
            "Gather sprint metrics and write talking points for the retro",
          priority: "high",
          dueDate: Date.now() + 86400000,
          category: "Work",
          completed: false,
          createdAt: Date.now() - 14400000,
          sortOrder: 4,
          subtasks: [
            { id: generateId(), title: "Pull velocity data", completed: true },
            { id: generateId(), title: "Draft agenda", completed: false },
            {
              id: generateId(),
              title: "Send calendar invite",
              completed: false,
            },
          ],
        },
        {
          id: generateId(),
          title: "Grocery run — weekend meals",
          description:
            "Pick up ingredients for meal prep: chicken, quinoa, veggies",
          priority: "low",
          dueDate: Date.now() + 2 * 86400000,
          category: "Personal",
          completed: false,
          createdAt: Date.now() - 18000000,
          sortOrder: 5,
          subtasks: [],
        },
      ];

export const useTodoStore = create<TodoStore>()(
  subscribeWithSelector((set, get) => ({
    todos: seedTodos,
    filter: "all",
    priorityFilter: "all",
    categoryFilter: null,
    searchQuery: "",
    sortOption: "createdAt",
    darkMode: initialPrefs?.darkMode ?? true,
    sidebarOpen: false,

    setFilter: (filter) => set({ filter }),
    setPriorityFilter: (priorityFilter) => set({ priorityFilter }),
    setCategoryFilter: (categoryFilter) => set({ categoryFilter }),
    setSearchQuery: (searchQuery) => set({ searchQuery }),
    setSortOption: (sortOption) => set({ sortOption }),
    toggleDarkMode: () =>
      set((s) => {
        const darkMode = !s.darkMode;
        savePreferences({ darkMode });
        return { darkMode };
      }),
    setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),

    createTodo: (input) => {
      const todos = get().todos;
      const todo: Todo = {
        id: generateId(),
        title: input.title,
        description: input.description,
        priority: input.priority,
        dueDate: input.dueDate,
        category: input.category,
        completed: false,
        createdAt: Date.now(),
        sortOrder: todos.length,
        subtasks: [],
      };
      const updated = [todo, ...todos];
      set({ todos: updated });
      saveTodos(updated);
      return todo;
    },

    updateTodo: (id, changes) => {
      const updated = get().todos.map((t) =>
        t.id === id ? { ...t, ...changes } : t,
      );
      set({ todos: updated });
      saveTodos(updated);
    },

    deleteTodo: (id) => {
      const updated = get().todos.filter((t) => t.id !== id);
      set({ todos: updated });
      saveTodos(updated);
    },

    toggleTodo: (id) => {
      const updated = get().todos.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t,
      );
      set({ todos: updated });
      saveTodos(updated);
    },

    markAllCompleted: () => {
      const updated = get().todos.map((t) => ({ ...t, completed: true }));
      set({ todos: updated });
      saveTodos(updated);
    },

    deleteAllCompleted: () => {
      const updated = get().todos.filter((t) => !t.completed);
      set({ todos: updated });
      saveTodos(updated);
    },

    reorderTodo: (id, newIndex) => {
      const todos = [...get().todos];
      const oldIndex = todos.findIndex((t) => t.id === id);
      if (oldIndex === -1) return;
      const [item] = todos.splice(oldIndex, 1);
      todos.splice(newIndex, 0, item);
      const reordered = todos.map((t, i) => ({ ...t, sortOrder: i }));
      set({ todos: reordered });
      saveTodos(reordered);
    },

    addSubtask: (todoId, title) => {
      const subtask: Subtask = { id: generateId(), title, completed: false };
      const updated = get().todos.map((t) =>
        t.id === todoId ? { ...t, subtasks: [...t.subtasks, subtask] } : t,
      );
      set({ todos: updated });
      saveTodos(updated);
    },

    toggleSubtask: (todoId, subtaskId) => {
      const updated = get().todos.map((t) =>
        t.id === todoId
          ? {
              ...t,
              subtasks: t.subtasks.map((s) =>
                s.id === subtaskId ? { ...s, completed: !s.completed } : s,
              ),
            }
          : t,
      );
      set({ todos: updated });
      saveTodos(updated);
    },

    deleteSubtask: (todoId, subtaskId) => {
      const updated = get().todos.map((t) =>
        t.id === todoId
          ? { ...t, subtasks: t.subtasks.filter((s) => s.id !== subtaskId) }
          : t,
      );
      set({ todos: updated });
      saveTodos(updated);
    },

    getCategories: () => {
      const cats = new Set<string>();
      for (const t of get().todos) {
        if (t.category) cats.add(t.category);
      }
      return Array.from(cats).sort();
    },

    getFilteredTodos: () => {
      const {
        todos,
        filter,
        priorityFilter,
        categoryFilter,
        searchQuery,
        sortOption,
      } = get();
      let result = [...todos];

      // Status filter
      if (filter === "active") result = result.filter((t) => !t.completed);
      else if (filter === "completed")
        result = result.filter((t) => t.completed);

      // Priority filter
      if (priorityFilter !== "all")
        result = result.filter((t) => t.priority === priorityFilter);

      // Category filter
      if (categoryFilter)
        result = result.filter((t) => t.category === categoryFilter);

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        result = result.filter(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q) ||
            (t.category?.toLowerCase().includes(q) ?? false),
        );
      }

      // Sort
      result.sort((a, b) => {
        switch (sortOption) {
          case "dueDate":
            if (!a.dueDate && !b.dueDate) return 0;
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return a.dueDate - b.dueDate;
          case "priority": {
            const pOrder = { high: 0, medium: 1, low: 2 };
            return pOrder[a.priority] - pOrder[b.priority];
          }
          case "alphabetical":
            return a.title.localeCompare(b.title);
          case "manual":
            return a.sortOrder - b.sortOrder;
          default: // createdAt
            return b.createdAt - a.createdAt;
        }
      });

      return result;
    },
  })),
);
