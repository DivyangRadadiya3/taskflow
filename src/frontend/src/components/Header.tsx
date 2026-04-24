import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTodoStore } from "@/store/useTodoStore";
import {
  CheckCheck,
  Moon,
  MoreHorizontal,
  Plus,
  Search,
  Sun,
  Trash2,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface HeaderProps {
  onCreateTask: () => void;
}

export function Header({ onCreateTask }: HeaderProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const {
    todos,
    searchQuery,
    setSearchQuery,
    darkMode,
    toggleDarkMode,
    markAllCompleted,
    deleteAllCompleted,
  } = useTodoStore();

  const activeTodos = todos.filter((t) => !t.completed);
  const completedTodos = todos.filter((t) => t.completed);
  const completionPct =
    todos.length > 0
      ? Math.round((completedTodos.length / todos.length) * 100)
      : 0;

  function handleMarkAll() {
    markAllCompleted();
    toast.success("All tasks marked complete");
  }

  function handleDeleteCompleted() {
    if (completedTodos.length === 0) {
      toast.info("No completed tasks to clear");
      return;
    }
    setConfirmClearOpen(true);
  }

  function handleConfirmClear() {
    deleteAllCompleted();
    toast.success(
      `Cleared ${completedTodos.length} completed task${completedTodos.length !== 1 ? "s" : ""}`,
    );
  }

  // Expose search focus to keyboard shortcuts via data attribute
  const focusSearch = () => searchRef.current?.focus();
  // Attach to window for shortcut handler
  if (typeof window !== "undefined") {
    (window as Window & { __focusSearch?: () => void }).__focusSearch =
      focusSearch;
  }

  return (
    <>
      <ConfirmDialog
        open={confirmClearOpen}
        onOpenChange={setConfirmClearOpen}
        title="Clear completed tasks?"
        description={`This will permanently delete ${completedTodos.length} completed task${completedTodos.length !== 1 ? "s" : ""}. This action cannot be undone.`}
        confirmLabel="Clear completed"
        destructive
        onConfirm={handleConfirmClear}
      />
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-lg border-b border-border/30 shadow-glass-sm">
        <div className="px-4 md:px-6 py-3">
          {/* Top row */}
          <div className="flex items-center gap-3">
            {/* Brand */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-accent/20 flex items-center justify-center ring-1 ring-accent/30 shrink-0">
                <CheckCheck className="w-4 h-4 text-accent" strokeWidth={2} />
              </div>
              <span className="font-display font-bold text-base text-foreground hidden sm:block tracking-tight">
                DoFlow
              </span>
            </div>

            {/* Search bar */}
            <div
              className={cn(
                "relative flex-1 max-w-sm transition-smooth",
                searchFocused && "max-w-md",
              )}
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
              <Input
                ref={searchRef}
                data-ocid="header.search_input"
                type="search"
                placeholder="Search tasks… (⌘K)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="pl-8 h-8 bg-muted/50 border-border/30 text-sm placeholder:text-muted-foreground/60 focus-visible:ring-accent/50"
              />
            </div>

            <div className="flex items-center gap-1.5 ml-auto">
              {/* Task counter badge */}
              <div className="hidden sm:flex items-center gap-1.5 bg-muted/40 rounded-full px-2.5 py-0.5 border border-border/20">
                <span className="text-xs font-mono text-accent font-semibold tabular-nums">
                  {activeTodos.length}
                </span>
                <span className="text-xs text-muted-foreground">active</span>
              </div>

              {/* Bulk actions */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    data-ocid="header.bulk_actions.open_modal_button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    aria-label="Bulk actions"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-44 glass-card border-border/30"
                >
                  <DropdownMenuItem
                    data-ocid="header.mark_all.button"
                    onClick={handleMarkAll}
                    className="gap-2 cursor-pointer"
                  >
                    <CheckCheck className="w-3.5 h-3.5 text-accent" />
                    Mark all complete
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    data-ocid="header.delete_completed.button"
                    onClick={handleDeleteCompleted}
                    className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Clear completed
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Theme toggle */}
              <Button
                data-ocid="header.theme_toggle"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={toggleDarkMode}
                aria-label="Toggle theme (⌘L)"
              >
                {darkMode ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </Button>

              {/* New task CTA */}
              <Button
                data-ocid="header.create_task.primary_button"
                size="sm"
                className="h-8 gap-1.5 bg-accent text-accent-foreground hover:bg-accent/90 shadow-glass-sm font-medium text-xs"
                onClick={onCreateTask}
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">New Task</span>
              </Button>
            </div>
          </div>

          {/* Progress bar */}
          {todos.length > 0 && (
            <div className="mt-2.5 flex items-center gap-2">
              <div className="flex-1 h-1 bg-muted/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
              <span className="text-xs font-mono text-muted-foreground tabular-nums">
                {completionPct}%
              </span>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
