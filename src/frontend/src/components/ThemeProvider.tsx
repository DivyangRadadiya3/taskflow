import { useTodoStore } from "@/store/useTodoStore";
import { useEffect } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const darkMode = useTodoStore((s) => s.darkMode);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  return <>{children}</>;
}
