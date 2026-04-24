import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTodoStore } from "@/store/useTodoStore";
import type { Subtask } from "@/types";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface SubtaskListProps {
  todoId: string;
  subtasks: Subtask[];
}

export function SubtaskList({ todoId, subtasks }: SubtaskListProps) {
  const { addSubtask, toggleSubtask, deleteSubtask } = useTodoStore();
  const [newTitle, setNewTitle] = useState("");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addSubtask(todoId, newTitle.trim());
    setNewTitle("");
  }

  return (
    <div className="space-y-1.5">
      {subtasks.map((sub, i) => (
        <div key={sub.id} className="group flex items-center gap-2">
          <Checkbox
            id={`sub-${sub.id}`}
            checked={sub.completed}
            data-ocid={`subtask.checkbox.${i + 1}`}
            onCheckedChange={() => toggleSubtask(todoId, sub.id)}
            className="h-3.5 w-3.5 shrink-0 data-[state=checked]:bg-accent data-[state=checked]:border-accent"
          />
          <label
            htmlFor={`sub-${sub.id}`}
            className={cn(
              "flex-1 text-xs cursor-pointer leading-snug",
              sub.completed
                ? "line-through text-muted-foreground"
                : "text-foreground",
            )}
          >
            {sub.title}
          </label>
          <button
            type="button"
            data-ocid={`subtask.delete_button.${i + 1}`}
            onClick={() => deleteSubtask(todoId, sub.id)}
            className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-destructive/15 text-muted-foreground hover:text-destructive transition-smooth"
            aria-label="Delete subtask"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      ))}

      {/* Add subtask inline */}
      <form onSubmit={handleAdd} className="flex gap-2 mt-2 items-center">
        <Input
          data-ocid="subtask.add_input"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Add subtask…"
          className="h-7 text-xs bg-muted/30 border-border/20 flex-1"
        />
        <Button
          type="submit"
          size="sm"
          variant="ghost"
          className="h-7 px-2 text-accent hover:bg-accent/10 shrink-0"
          aria-label="Add subtask"
        >
          <Plus className="w-3.5 h-3.5" />
        </Button>
      </form>
    </div>
  );
}
