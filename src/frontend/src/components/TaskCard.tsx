import { SubtaskList } from "@/components/SubtaskList";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTodoStore } from "@/store/useTodoStore";
import type { Todo } from "@/types";
import type { Priority } from "@/types";
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Circle,
  Edit2,
  Flag,
  GripVertical,
  Tag,
  Trash2,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

const PRIORITY_CONFIG: Record<Priority, { label: string; className: string }> =
  {
    high: { label: "High", className: "priority-high" },
    medium: { label: "Medium", className: "priority-medium" },
    low: { label: "Low", className: "priority-low" },
  };

function formatDate(ts: number): string {
  const d = new Date(ts);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === tomorrow.toDateString()) return "Tomorrow";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function isOverdue(ts: number): boolean {
  return ts < Date.now() - 86400000;
}

function highlightText(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const parts = text.split(
    new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"),
  );
  const nodes: React.ReactNode[] = [];
  parts.forEach((part, i) => {
    if (part.toLowerCase() === query.toLowerCase()) {
      nodes.push(
        <mark
          // biome-ignore lint/suspicious/noArrayIndexKey: positional highlight parts have no stable id
          key={i}
          className="bg-accent/30 text-foreground rounded-sm px-0.5 not-italic"
        >
          {part}
        </mark>,
      );
    } else {
      nodes.push(part);
    }
  });
  return nodes;
}

interface TaskCardProps {
  todo: Todo;
  index: number;
  searchQuery?: string;
  onEdit: (todo: Todo) => void;
  onDragStart?: (e: React.DragEvent, id: string) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, id: string) => void;
}

export function TaskCard({
  todo,
  index,
  searchQuery = "",
  onEdit,
  onDragStart,
  onDragOver,
  onDrop,
}: TaskCardProps) {
  const { toggleTodo, deleteTodo } = useTodoStore();
  const [expanded, setExpanded] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const completedSubs = todo.subtasks.filter((s) => s.completed).length;
  const subtaskPct =
    todo.subtasks.length > 0 ? (completedSubs / todo.subtasks.length) * 100 : 0;
  const cfg = PRIORITY_CONFIG[todo.priority];

  return (
    <div
      ref={cardRef}
      data-ocid={`task.item.${index}`}
      draggable
      onDragStart={(e) => onDragStart?.(e, todo.id)}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
        onDragOver?.(e);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        setIsDragOver(false);
        onDrop?.(e, todo.id);
      }}
      className={cn(
        "group relative glass-card rounded-xl p-4 transition-smooth",
        "hover:shadow-glass-lg hover:border-border/50",
        todo.completed && "opacity-60",
        isDragOver && "ring-2 ring-accent/40 border-accent/40",
      )}
      style={{
        animationDelay: `${Math.min(index * 50, 400)}ms`,
        animationFillMode: "both",
      }}
    >
      <div className="flex items-start gap-3">
        {/* Drag handle */}
        <GripVertical className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-muted-foreground/60 mt-1 shrink-0 cursor-grab active:cursor-grabbing" />

        {/* Checkbox */}
        <button
          type="button"
          data-ocid={`task.checkbox.${index}`}
          onClick={() => {
            toggleTodo(todo.id);
            if (!todo.completed) toast.success("Task completed! 🎉");
          }}
          className="shrink-0 mt-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-full"
          aria-label={todo.completed ? "Mark incomplete" : "Mark complete"}
        >
          {todo.completed ? (
            <CheckCircle2 className="w-5 h-5 text-accent" />
          ) : (
            <Circle className="w-5 h-5 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <span
            className={cn(
              "font-medium text-sm leading-snug break-words block",
              todo.completed
                ? "line-through text-muted-foreground"
                : "text-foreground",
            )}
          >
            {highlightText(todo.title, searchQuery)}
          </span>

          {todo.description && (
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
              {highlightText(todo.description, searchQuery)}
            </p>
          )}

          {/* Meta row */}
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            <span
              className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium",
                cfg.className,
              )}
            >
              <Flag className="w-2.5 h-2.5" />
              {cfg.label}
            </span>

            {todo.category && (
              <Badge
                variant="outline"
                className="px-2 py-0.5 h-auto text-xs bg-muted/40 text-muted-foreground border-border/20 font-normal gap-1"
              >
                <Tag className="w-2.5 h-2.5" />
                {highlightText(todo.category, searchQuery)}
              </Badge>
            )}

            {todo.dueDate && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs",
                  isOverdue(todo.dueDate) && !todo.completed
                    ? "bg-destructive/15 text-destructive border border-destructive/20"
                    : "bg-muted/40 text-muted-foreground border border-border/20",
                )}
              >
                <Calendar className="w-2.5 h-2.5" />
                {formatDate(todo.dueDate)}
              </span>
            )}

            {todo.subtasks.length > 0 && (
              <span className="text-xs text-muted-foreground font-mono tabular-nums ml-auto">
                {completedSubs}/{todo.subtasks.length}
              </span>
            )}
          </div>

          {/* Subtask progress bar */}
          {todo.subtasks.length > 0 && (
            <div className="mt-2 h-0.5 bg-muted/40 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all duration-500"
                style={{ width: `${subtaskPct}%` }}
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-smooth shrink-0">
          {todo.subtasks.length > 0 && (
            <button
              type="button"
              data-ocid={`task.expand.${index}`}
              className="p-1.5 rounded-md hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setExpanded((v) => !v)}
              aria-label={expanded ? "Collapse subtasks" : "Expand subtasks"}
            >
              {expanded ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          )}
          <button
            type="button"
            data-ocid={`task.edit_button.${index}`}
            className="p-1.5 rounded-md hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => onEdit(todo)}
            aria-label="Edit task"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            data-ocid={`task.delete_button.${index}`}
            className="p-1.5 rounded-md hover:bg-destructive/15 text-muted-foreground hover:text-destructive transition-colors"
            onClick={() => {
              deleteTodo(todo.id);
              toast.info("Task deleted");
            }}
            aria-label="Delete task"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          {/* Always show expand for subtask add */}
          {todo.subtasks.length === 0 && (
            <button
              type="button"
              data-ocid={`task.expand.${index}`}
              className="p-1.5 rounded-md hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setExpanded((v) => !v)}
              aria-label={expanded ? "Collapse" : "Add subtasks"}
            >
              {expanded ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Subtask panel */}
      {expanded && (
        <div className="mt-3 ml-11 border-t border-border/20 pt-3">
          <SubtaskList todoId={todo.id} subtasks={todo.subtasks} />
        </div>
      )}
    </div>
  );
}
