import { createSignal, createEffect, onCleanup } from "solid-js";
import { Menu, X } from "lucide-solid";
import { siteConfig } from "@/config/site";

export default function MobileMenu() {
  const [open, setOpen] = createSignal(false);

  // Lock body scroll when drawer is open
  createEffect(() => {
    document.body.style.overflow = open() ? "hidden" : "";
  });

  // Global Escape key handler
  createEffect(() => {
    if (!open()) return;
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
        {open() ? <X size={20} /> : <Menu size={20} />}
      </button>
      {open() && (
        <>
          <div
            class="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <nav
            class="fixed top-0 right-0 h-full w-64 bg-background border-l border-border z-50 p-6 flex flex-col gap-4"
          >
            <div class="flex justify-end">
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                class="w-9 h-9 flex items-center justify-center rounded-md hover:bg-muted transition-colors"
              >
                <X size={20} />
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
        </>
      )}
    </>
  );
}
