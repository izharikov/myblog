import { createSignal, createEffect } from "solid-js";
import { Moon, Sun } from "lucide-solid";

export default function ThemeToggle() {
  const [isDark, setIsDark] = createSignal(
    document.documentElement.classList.contains("dark")
  );

  createEffect(() => {
    document.documentElement.classList.toggle("dark", isDark());
    localStorage.setItem("theme", isDark() ? "dark" : "light");
  });

  return (
    <button
      onClick={() => setIsDark(d => !d)}
      aria-label={isDark() ? "Switch to light mode" : "Switch to dark mode"}
      class="w-9 h-9 flex items-center justify-center rounded-md hover:bg-muted transition-colors"
    >
      {isDark() ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
