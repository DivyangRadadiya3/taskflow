import { useTodoStore } from "@/store/useTodoStore";
import { useEffect } from "react";

interface ShortcutOptions {
  onNewTask?: () => void;
  onFocusSearch?: () => void;
}

export function useKeyboardShortcuts({
  onNewTask,
  onFocusSearch,
}: ShortcutOptions = {}) {
  const toggleDarkMode = useTodoStore((s) => s.toggleDarkMode);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const isInputActive =
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement;

      if ((e.ctrlKey || e.metaKey) && e.key === "n") {
        e.preventDefault();
        onNewTask?.();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        onFocusSearch?.();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "l") {
        e.preventDefault();
        toggleDarkMode();
      }
      // Escape closes dialogs (handled by individual components via Radix)
      if (e.key === "Escape" && isInputActive) {
        (document.activeElement as HTMLElement).blur();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onNewTask, onFocusSearch, toggleDarkMode]);
}
