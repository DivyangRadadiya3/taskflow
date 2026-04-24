import { BulkActionsMenu } from "@/components/BulkActionsMenu";
import { FilterPanel } from "@/components/FilterPanel";
import { Layout } from "@/components/Layout";
import { ProgressRing } from "@/components/ProgressRing";
import { SortControls } from "@/components/SortControls";
import { TaskList } from "@/components/TaskList";
import { TaskModal } from "@/components/TaskModal";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useTodoStore } from "@/store/useTodoStore";
import type { Todo } from "@/types";
import { useCallback, useState } from "react";

export function TodoPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editTodo, setEditTodo] = useState<Todo | null>(null);

  const { todos, filter, categoryFilter } = useTodoStore();

  const completedCount = todos.filter((t) => t.completed).length;
  const completionPct =
    todos.length > 0 ? (completedCount / todos.length) * 100 : 0;

  const openCreate = useCallback(() => {
    setEditTodo(null);
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((todo: Todo) => {
    setEditTodo(todo);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setEditTodo(null);
  }, []);

  useKeyboardShortcuts({
    onNewTask: openCreate,
    onFocusSearch: () => {
      if (typeof window !== "undefined") {
        (window as Window & { __focusSearch?: () => void }).__focusSearch?.();
      }
    },
  });

  const pageTitle = categoryFilter
    ? categoryFilter
    : filter === "active"
      ? "Active Tasks"
      : filter === "completed"
        ? "Completed"
        : "All Tasks";

  return (
    <>
      <Layout onCreateTask={openCreate}>
        <div className="px-4 md:px-6 py-5 max-w-3xl mx-auto w-full">
          {/* Page heading */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 min-w-0">
              <h1 className="font-display font-bold text-xl text-foreground tracking-tight">
                {pageTitle}
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {completedCount} of {todos.length} task
                {todos.length !== 1 ? "s" : ""} completed
              </p>
            </div>

            {/* Progress ring */}
            {todos.length > 0 && (
              <ProgressRing
                value={completionPct}
                size={48}
                strokeWidth={3.5}
                className="shrink-0"
              />
            )}

            {/* Sort + bulk */}
            <div className="flex items-center gap-1">
              <SortControls />
              <BulkActionsMenu />
            </div>
          </div>

          {/* Filters */}
          <FilterPanel />

          {/* Task list */}
          <TaskList onEdit={openEdit} />
        </div>
      </Layout>

      <TaskModal open={modalOpen} onClose={closeModal} editTodo={editTodo} />
    </>
  );
}
