import { createSignal, createEffect, onMount } from "solid-js";

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);

export default function ThemeToggle() {
  const [isDark, setIsDark] = createSignal(false);
  const [ready, setReady] = createSignal(false);

  onMount(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    setReady(true);
  });

  createEffect(() => {
    if (!ready()) return;
    document.documentElement.classList.toggle("dark", isDark());
    localStorage.setItem("theme", isDark() ? "dark" : "light");
  });

  return (
    <button
      onClick={() => setIsDark(d => !d)}
      aria-label={isDark() ? "Switch to light mode" : "Switch to dark mode"}
      class="w-9 h-9 flex items-center justify-center rounded-md hover:bg-surface-alt transition-colors"
    >
      {isDark() ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
