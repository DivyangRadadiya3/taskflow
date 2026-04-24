import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckSquare, Filter, Search } from "lucide-react";

interface EmptyStateProps {
  type?: "all" | "filtered" | "search";
  onCreateTask?: () => void;
  className?: string;
}

const configs = {
  all: {
    Icon: CheckSquare,
    title: "No tasks yet",
    description:
      "You're all clear! Create your first task to get started and stay on top of your day.",
    cta: "Create your first task",
  },
  filtered: {
    Icon: Filter,
    title: "No matching tasks",
    description:
      "No tasks match the current filter. Try adjusting your filters or create a new task.",
    cta: "Clear filters",
  },
  search: {
    Icon: Search,
    title: "Nothing found",
    description:
      "No tasks match your search. Try different keywords or clear the search.",
    cta: "Clear search",
  },
};

export function EmptyState({
  type = "all",
  onCreateTask,
  className,
}: EmptyStateProps) {
  const config = configs[type];
  const { Icon } = config;

  return (
    <div
      data-ocid="empty_state"
      className={cn(
        "flex flex-col items-center justify-center py-20 px-8 text-center animate-fade-in-up",
        className,
      )}
    >
      {/* Decorative glow ring */}
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center ring-1 ring-accent/20 shadow-glass-sm">
          <div className="w-16 h-16 rounded-full bg-accent/15 flex items-center justify-center">
            <Icon className="w-8 h-8 text-accent" strokeWidth={1.5} />
          </div>
        </div>
        <div className="absolute -inset-3 rounded-full bg-accent/5 blur-xl" />
      </div>

      <h3 className="font-display font-semibold text-xl text-foreground mb-2">
        {config.title}
      </h3>
      <p className="text-muted-foreground text-sm max-w-xs leading-relaxed mb-6">
        {config.description}
      </p>
      {onCreateTask && (
        <Button
          data-ocid="empty_state.primary_button"
          onClick={onCreateTask}
          className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-glass-sm font-medium"
        >
          {config.cta}
        </Button>
      )}
    </div>
  );
}
