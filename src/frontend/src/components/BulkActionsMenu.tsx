import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTodoStore } from "@/store/useTodoStore";
import { CheckCheck, Download, MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function BulkActionsMenu() {
  const { todos, markAllCompleted, deleteAllCompleted } = useTodoStore();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const completedCount = todos.filter((t) => t.completed).length;

  function handleMarkAll() {
    markAllCompleted();
    toast.success(`All ${todos.length} tasks marked complete`);
  }

  function handleDeleteCompleted() {
    if (completedCount === 0) {
      toast.info("No completed tasks to clear");
      return;
    }
    setConfirmOpen(true);
  }

  function handleConfirmDelete() {
    deleteAllCompleted();
    toast.success(
      `Cleared ${completedCount} completed task${completedCount !== 1 ? "s" : ""}`,
    );
    setConfirmOpen(false);
  }

  function handleExport() {
    const dataStr = JSON.stringify(todos, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tasks-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Tasks exported to JSON");
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            data-ocid="bulk_actions.open_modal_button"
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
          className="w-48 glass-card border-border/30"
        >
          <DropdownMenuItem
            data-ocid="bulk_actions.mark_all.button"
            onClick={handleMarkAll}
            className="gap-2 cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5 text-accent" />
            Mark all complete
          </DropdownMenuItem>
          <DropdownMenuItem
            data-ocid="bulk_actions.export.button"
            onClick={handleExport}
            className="gap-2 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-muted-foreground" />
            Export JSON
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            data-ocid="bulk_actions.delete_completed.button"
            onClick={handleDeleteCompleted}
            className="gap-2 cursor-pointer text-destructive focus:text-destructive"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear completed ({completedCount})
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete completed tasks"
        description={`This will permanently delete ${completedCount} completed task${completedCount !== 1 ? "s" : ""}. This action cannot be undone.`}
        confirmLabel="Delete all"
        destructive
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
