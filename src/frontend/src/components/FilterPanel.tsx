import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTodoStore } from "@/store/useTodoStore";
import type { Filter, Priority } from "@/types";
import { X } from "lucide-react";

const STATUS_FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
];

const PRIORITY_FILTERS: {
  value: Priority | "all";
  label: string;
  cls: string;
}[] = [
  { value: "all", label: "All", cls: "" },
  { value: "high", label: "High", cls: "priority-high" },
  { value: "medium", label: "Medium", cls: "priority-medium" },
  { value: "low", label: "Low", cls: "priority-low" },
];

export function FilterPanel() {
  const {
    filter,
    setFilter,
    priorityFilter,
    setPriorityFilter,
    categoryFilter,
    setCategoryFilter,
    getCategories,
  } = useTodoStore();

  const categories = getCategories();
  const hasActiveFilter =
    filter !== "all" || priorityFilter !== "all" || categoryFilter !== null;

  return (
    <div className="space-y-3 mb-4">
      {/* Status filter row */}
      <div className="flex items-center gap-1.5 bg-muted/40 rounded-lg p-0.5 border border-border/20 w-fit">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            data-ocid={`filter.${f.value}.tab`}
            onClick={() => setFilter(f.value)}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-smooth",
              filter === f.value
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Priority + category chips row */}
      <div className="flex flex-wrap gap-2 items-center">
        {PRIORITY_FILTERS.map((p) => (
          <Badge
            key={p.value}
            data-ocid={`priority_filter.${p.value}`}
            variant="outline"
            className={cn(
              "cursor-pointer text-xs transition-smooth select-none",
              priorityFilter === p.value && p.value === "all"
                ? "bg-accent/15 text-accent border-accent/30"
                : priorityFilter === p.value && p.value !== "all"
                  ? p.cls
                  : "border-border/30 text-muted-foreground hover:text-foreground",
            )}
            onClick={() => setPriorityFilter(p.value)}
          >
            {p.value === "all" ? "All priorities" : `${p.label} priority`}
          </Badge>
        ))}

        {/* Category chips */}
        {categories.map((cat) => (
          <Badge
            key={cat}
            data-ocid={`category_filter.${cat.toLowerCase()}`}
            variant="outline"
            className={cn(
              "cursor-pointer text-xs transition-smooth select-none",
              categoryFilter === cat
                ? "bg-accent/15 text-accent border-accent/30"
                : "border-border/30 text-muted-foreground hover:text-foreground",
            )}
            onClick={() =>
              setCategoryFilter(categoryFilter === cat ? null : cat)
            }
          >
            {cat}
          </Badge>
        ))}

        {/* Clear all filters */}
        {hasActiveFilter && (
          <button
            type="button"
            data-ocid="filter.clear_button"
            className="text-xs text-muted-foreground hover:text-destructive transition-smooth flex items-center gap-1 px-2 py-0.5 rounded-md border border-border/20 hover:border-destructive/30"
            onClick={() => {
              setFilter("all");
              setPriorityFilter("all");
              setCategoryFilter(null);
            }}
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
