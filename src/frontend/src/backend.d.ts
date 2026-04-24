import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Subtask {
    id: bigint;
    title: string;
    completed: boolean;
}
export interface UserPreferences {
    darkMode: boolean;
}
export interface UpdateTodoInput {
    id: bigint;
    title: string;
    sortOrder: bigint;
    completed: boolean;
    dueDate?: bigint;
    description: string;
    category?: string;
    priority: Priority;
}
export interface Todo {
    id: bigint;
    title: string;
    sortOrder: bigint;
    createdAt: bigint;
    completed: boolean;
    dueDate?: bigint;
    description: string;
    category?: string;
    priority: Priority;
    subtasks: Array<Subtask>;
}
export interface CreateTodoInput {
    title: string;
    sortOrder: bigint;
    dueDate?: bigint;
    description: string;
    category?: string;
    priority: Priority;
}
export enum Priority {
    low = "low",
    high = "high",
    medium = "medium"
}
export interface backendInterface {
    addSubtask(todoId: bigint, title: string): Promise<boolean>;
    createTodo(input: CreateTodoInput): Promise<Todo>;
    deleteAllCompleted(): Promise<bigint>;
    deleteSubtask(todoId: bigint, subtaskId: bigint): Promise<boolean>;
    deleteTodo(id: bigint): Promise<boolean>;
    getCategories(): Promise<Array<string>>;
    getPreferences(): Promise<UserPreferences>;
    getTodos(): Promise<Array<Todo>>;
    markAllCompleted(): Promise<void>;
    reorderTodo(id: bigint, sortOrder: bigint): Promise<boolean>;
    setDarkMode(enabled: boolean): Promise<void>;
    toggleSubtask(todoId: bigint, subtaskId: bigint): Promise<boolean>;
    updateTodo(input: UpdateTodoInput): Promise<boolean>;
}
