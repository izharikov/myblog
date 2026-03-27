import { createSignal, createEffect, onCleanup, onMount } from "solid-js";
import { Portal } from "solid-js/web";
import { siteConfig } from "@/config/site";

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
  </svg>
);

export default function MobileMenu() {
  const [open, setOpen] = createSignal(false);
  const [mounted, setMounted] = createSignal(false);

  onMount(() => setMounted(true));

  createEffect(() => {
    if (!mounted()) return;
    document.body.style.overflow = open() ? "hidden" : "";
  });

  createEffect(() => {
    if (!mounted() || !open()) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    onCleanup(() => document.removeEventListener("keydown", handler));
  });

  return (
    <>
      <button
        class="md:hidden w-9 h-9 flex items-center justify-center rounded-md hover:bg-muted transition-colors"
        onClick={() => setOpen(o => !o)}
        aria-label="Toggle navigation menu"
        aria-expanded={open()}
      >
        {open() ? <XIcon /> : <MenuIcon />}
      </button>
      {mounted() && open() && (
        <Portal>
          <div
            class="fixed inset-0 bg-black/50 z-[60] md:hidden"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <nav
            class="fixed top-0 right-0 h-full w-64 bg-background border-l border-border z-[70] p-6 flex flex-col gap-4"
          >
            <div class="flex justify-end">
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                class="w-9 h-9 flex items-center justify-center rounded-md hover:bg-muted transition-colors"
              >
                <XIcon />
              </button>
            </div>
            {siteConfig.navigation.map(item => (
              <a
                href={item.href}
                class="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setOpen(false)}
              >
                {item.name}
              </a>
            ))}
          </nav>
        </Portal>
      )}
    </>
  );
}
