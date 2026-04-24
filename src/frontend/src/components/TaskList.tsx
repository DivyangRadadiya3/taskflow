import { EmptyState } from "@/components/EmptyState";
import { TaskCard } from "@/components/TaskCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useTodoStore } from "@/store/useTodoStore";
import type { Todo } from "@/types";
import { useCallback, useRef, useState } from "react";

interface TaskListProps {
  onEdit: (todo: Todo) => void;
}

export function TaskList({ onEdit }: TaskListProps) {
  const {
    getFilteredTodos,
    reorderTodo,
    searchQuery,
    filter,
    categoryFilter,
    setSearchQuery,
    setFilter,
    setCategoryFilter,
  } = useTodoStore();
  const [isLoading] = useState(false);
  const dragIdRef = useRef<string | null>(null);

  const filteredTodos = getFilteredTodos();

  const handleDragStart = useCallback((e: React.DragEvent, id: string) => {
    dragIdRef.current = id;
    e.dataTransfer.effectAllowed = "move";
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, targetId: string) => {
      e.preventDefault();
      if (!dragIdRef.current || dragIdRef.current === targetId) return;
      const allFiltered = getFilteredTodos();
      const targetIndex = allFiltered.findIndex((t) => t.id === targetId);
      if (targetIndex === -1) return;
      reorderTodo(dragIdRef.current, targetIndex);
      dragIdRef.current = null;
    },
    [getFilteredTodos, reorderTodo],
  );

  const emptyType = searchQuery
    ? "search"
    : filter !== "all" || categoryFilter
      ? "filtered"
      : "all";

  function handleEmptyStateCta() {
    if (searchQuery) setSearchQuery("");
    else if (filter !== "all" || categoryFilter) {
      setFilter("all");
      setCategoryFilter(null);
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-2" data-ocid="task_list.loading_state">
        {Array.from({ length: 3 }).map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (filteredTodos.length === 0) {
    return <EmptyState type={emptyType} onCreateTask={handleEmptyStateCta} />;
  }

  return (
    <div data-ocid="task_list.list" className="space-y-2">
      {filteredTodos.map((todo, idx) => (
        <TaskCard
          key={todo.id}
          todo={todo}
          index={idx + 1}
          searchQuery={searchQuery}
          onEdit={onEdit}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        />
      ))}
    </div>
  );
}
