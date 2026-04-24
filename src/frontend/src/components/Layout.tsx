import { Header } from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useTodoStore } from "@/store/useTodoStore";
import {
  CalendarClock,
  CalendarDays,
  ChevronDown,
  Inbox,
  LayoutList,
  Menu,
  Tag,
  X,
} from "lucide-react";
import { useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
  onCreateTask: () => void;
}

const NAV_ITEMS = [
  { icon: Inbox, label: "Inbox", filter: "all" as const },
  { icon: CalendarDays, label: "Today", filter: "today" as const },
  { icon: CalendarClock, label: "Upcoming", filter: "upcoming" as const },
];

type NavFilter = "all" | "today" | "upcoming";

export function Layout({ children, onCreateTask }: LayoutProps) {
  const isMobile = useIsMobile();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [projectsExpanded, setProjectsExpanded] = useState(true);
  const [activeNav, setActiveNav] = useState<NavFilter>("all");

  const { todos, getCategories, setFilter, setCategoryFilter, categoryFilter } =
    useTodoStore();

  const categories = getCategories();

  const activeTodayCount = todos.filter(
    (t) => !t.completed && t.dueDate && t.dueDate <= Date.now() + 86400000,
  ).length;

  const activeCount = todos.filter((t) => !t.completed).length;

  function handleNavItem(nav: NavFilter) {
    setActiveNav(nav);
    setCategoryFilter(null);
    if (nav === "all") {
      setFilter("all");
    } else {
      setFilter("all");
    }
    if (isMobile) setMobileNavOpen(false);
  }

  function handleCategoryClick(cat: string) {
    setCategoryFilter(categoryFilter === cat ? null : cat);
    if (isMobile) setMobileNavOpen(false);
  }

  const SidebarContent = (
    <aside className="flex flex-col h-full">
      {/* Brand — visible in sidebar on mobile overlay */}
      <div className="flex items-center justify-between px-4 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-accent/20 flex items-center justify-center ring-1 ring-accent/30">
            <LayoutList className="w-4 h-4 text-accent" />
          </div>
          <span className="font-display font-bold text-base text-foreground tracking-tight">
            DoFlow
          </span>
        </div>
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setMobileNavOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      <Separator className="opacity-30 mb-2" />

      {/* Primary nav */}
      <nav className="px-2 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = activeNav === item.filter && !categoryFilter;
          const count =
            item.filter === "all"
              ? activeCount
              : item.filter === "today"
                ? activeTodayCount
                : 0;
          return (
            <button
              key={item.filter}
              type="button"
              data-ocid={`sidebar.nav.${item.filter}`}
              onClick={() => handleNavItem(item.filter)}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-smooth group",
                isActive
                  ? "bg-accent/15 text-accent ring-1 ring-accent/20"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" strokeWidth={1.8} />
              <span className="flex-1 text-left">{item.label}</span>
              {count > 0 && (
                <Badge
                  variant="secondary"
                  className={cn(
                    "h-4 px-1.5 text-xs font-mono tabular-nums min-w-[1.25rem]",
                    isActive
                      ? "bg-accent/20 text-accent border-accent/30"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {count}
                </Badge>
              )}
            </button>
          );
        })}
      </nav>

      <Separator className="opacity-30 my-3 mx-2" />

      {/* Categories / Projects */}
      <div className="px-2 flex-1 min-h-0 overflow-y-auto">
        <button
          type="button"
          className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-smooth"
          onClick={() => setProjectsExpanded((v) => !v)}
          aria-label="Toggle projects"
        >
          <Tag className="w-3.5 h-3.5" />
          Categories
          <ChevronDown
            className={cn(
              "w-3 h-3 ml-auto transition-transform duration-200",
              !projectsExpanded && "-rotate-90",
            )}
          />
        </button>

        {projectsExpanded && (
          <div className="mt-1 space-y-0.5 animate-fade-in-up">
            {categories.length === 0 && (
              <p className="px-3 py-2 text-xs text-muted-foreground/60 italic">
                No categories yet
              </p>
            )}
            {categories.map((cat) => {
              const isActive = categoryFilter === cat;
              const catCount = todos.filter(
                (t) => !t.completed && t.category === cat,
              ).length;
              return (
                <button
                  key={cat}
                  type="button"
                  data-ocid={`sidebar.category.${cat.toLowerCase()}`}
                  onClick={() => handleCategoryClick(cat)}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-smooth",
                    isActive
                      ? "bg-accent/15 text-accent ring-1 ring-accent/20"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full shrink-0",
                      cat === "Work" && "bg-chart-4",
                      cat === "Personal" && "bg-chart-3",
                      cat === "Health" && "bg-chart-1",
                      !["Work", "Personal", "Health"].includes(cat) &&
                        "bg-chart-5",
                    )}
                  />
                  <span className="flex-1 text-left font-medium">{cat}</span>
                  {catCount > 0 && (
                    <span className="text-xs font-mono tabular-nums text-muted-foreground">
                      {catCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Theme toggle in sidebar bottom */}
      <div className="px-4 py-4 border-t border-border/20 mt-auto">
        <p className="text-xs text-muted-foreground/50 text-center">
          © {new Date().getFullYear()} Built with{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent/70 hover:text-accent transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header onCreateTask={onCreateTask} />

      <div className="flex flex-1 min-h-0 relative">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <div className="w-56 shrink-0 border-r border-border/20 bg-card/40 backdrop-blur-sm flex flex-col sticky top-[57px] h-[calc(100vh-57px)] overflow-hidden">
            {SidebarContent}
          </div>
        )}

        {/* Mobile sidebar overlay */}
        {isMobile && mobileNavOpen && (
          <>
            <div
              role="button"
              tabIndex={0}
              className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm"
              onClick={() => setMobileNavOpen(false)}
              onKeyDown={(e) => e.key === "Escape" && setMobileNavOpen(false)}
              aria-label="Close sidebar"
            />
            <div className="fixed left-0 top-0 bottom-0 z-50 w-64 bg-card border-r border-border/30 shadow-glass-xl animate-fade-in-up flex flex-col">
              {SidebarContent}
            </div>
          </>
        )}

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {/* Mobile nav toggle */}
          {isMobile && (
            <div className="px-4 pt-3 pb-0">
              <Button
                data-ocid="sidebar.mobile_toggle"
                variant="ghost"
                size="sm"
                className="gap-2 h-8 text-muted-foreground"
                onClick={() => setMobileNavOpen(true)}
                aria-label="Open navigation"
              >
                <Menu className="w-4 h-4" />
                <span className="text-sm">Menu</span>
              </Button>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
