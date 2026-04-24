import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useTodoStore } from "@/store/useTodoStore";
import type { CreateTodoInput, Priority, Todo } from "@/types";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  editTodo?: Todo | null;
}

export function TaskModal({ open, onClose, editTodo }: TaskModalProps) {
  const { createTodo, updateTodo, getCategories } = useTodoStore();
  const categories = getCategories();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const prevId = useRef<string | undefined>(undefined);

  // Sync form when editTodo changes or modal opens
  useEffect(() => {
    if (!open) return;
    if (editTodo?.id !== prevId.current) {
      prevId.current = editTodo?.id;
      setTitle(editTodo?.title ?? "");
      setDescription(editTodo?.description ?? "");
      setPriority(editTodo?.priority ?? "medium");
      setDueDate(
        editTodo?.dueDate
          ? new Date(editTodo.dueDate).toISOString().slice(0, 10)
          : "",
      );
      setCategory(editTodo?.category ?? "");
      setNewCategory("");
    }
  }, [open, editTodo]);

  // Reset on close
  useEffect(() => {
    if (!open) {
      prevId.current = undefined;
      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate("");
      setCategory("");
      setNewCategory("");
    }
  }, [open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Task title is required");
      return;
    }
    const finalCategory = newCategory.trim() || category || null;
    const dueDateTs = dueDate ? new Date(dueDate).getTime() : null;

    if (editTodo) {
      updateTodo(editTodo.id, {
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate: dueDateTs,
        category: finalCategory,
      });
      toast.success("Task updated");
    } else {
      const input: CreateTodoInput = {
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate: dueDateTs,
        category: finalCategory,
      };
      createTodo(input);
      toast.success("Task created 🎯");
    }
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        data-ocid="task_modal.dialog"
        className="glass-card border-border/30 shadow-glass-xl max-w-md sm:rounded-xl"
      >
        <DialogHeader>
          <DialogTitle className="font-display font-semibold text-base">
            {editTodo ? "Edit Task" : "New Task"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-1">
          <div className="space-y-1.5">
            <Label
              htmlFor="tm-title"
              className="text-xs font-medium text-muted-foreground"
            >
              Title *
            </Label>
            <Input
              id="tm-title"
              data-ocid="task_modal.title.input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="bg-muted/30 border-border/30 focus-visible:ring-accent/50"
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="tm-desc"
              className="text-xs font-medium text-muted-foreground"
            >
              Description
            </Label>
            <Textarea
              id="tm-desc"
              data-ocid="task_modal.description.textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details…"
              rows={2}
              className="bg-muted/30 border-border/30 focus-visible:ring-accent/50 resize-none text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">
                Priority
              </Label>
              <Select
                value={priority}
                onValueChange={(v) => setPriority(v as Priority)}
              >
                <SelectTrigger
                  data-ocid="task_modal.priority.select"
                  className="h-9 bg-muted/30 border-border/30 text-sm"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card border-border/30">
                  <SelectItem value="high">🔴 High</SelectItem>
                  <SelectItem value="medium">🟡 Medium</SelectItem>
                  <SelectItem value="low">🟢 Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="tm-due"
                className="text-xs font-medium text-muted-foreground"
              >
                Due date
              </Label>
              <Input
                id="tm-due"
                data-ocid="task_modal.due_date.input"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="h-9 bg-muted/30 border-border/30 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Category
            </Label>
            <div className="flex gap-2">
              {categories.length > 0 && (
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger
                    data-ocid="task_modal.category.select"
                    className="h-9 bg-muted/30 border-border/30 text-sm flex-1"
                  >
                    <SelectValue placeholder="Select…" />
                  </SelectTrigger>
                  <SelectContent className="glass-card border-border/30">
                    <SelectItem value="">None</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <Input
                data-ocid="task_modal.new_category.input"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder={categories.length > 0 ? "Or new…" : "Category…"}
                className="h-9 bg-muted/30 border-border/30 text-sm flex-1"
              />
            </div>
          </div>

          <Separator className="opacity-20" />

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              data-ocid="task_modal.cancel_button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-muted-foreground"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              data-ocid="task_modal.submit_button"
              size="sm"
              className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-glass-sm"
            >
              {editTodo ? "Save changes" : "Create task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
