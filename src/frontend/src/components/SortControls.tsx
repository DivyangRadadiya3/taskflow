import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useTodoStore } from "@/store/useTodoStore";
import type { SortOption } from "@/types";
import { ArrowUpDown, Check } from "lucide-react";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "createdAt", label: "Date created" },
  { value: "dueDate", label: "Due date" },
  { value: "priority", label: "Priority" },
  { value: "alphabetical", label: "A–Z" },
  { value: "manual", label: "Manual order" },
];

export function SortControls() {
  const { sortOption, setSortOption } = useTodoStore();
  const current = SORT_OPTIONS.find((o) => o.value === sortOption);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          data-ocid="sort.open_modal_button"
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowUpDown className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{current?.label ?? "Sort"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-44 glass-card border-border/30"
      >
        {SORT_OPTIONS.map((opt) => (
          <DropdownMenuItem
            key={opt.value}
            data-ocid={`sort.${opt.value}`}
            onClick={() => setSortOption(opt.value)}
            className={cn(
              "cursor-pointer text-sm gap-2",
              sortOption === opt.value && "text-accent",
            )}
          >
            {sortOption === opt.value ? (
              <Check className="w-3.5 h-3.5 text-accent shrink-0" />
            ) : (
              <span className="w-3.5 h-3.5 shrink-0" />
            )}
            {opt.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
