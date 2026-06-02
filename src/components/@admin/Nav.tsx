"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export interface NavAction {
  label: string;
  /** Optional icon rendered in place of the label. */
  icon?: React.ReactNode;
  variant?: "outline" | "dark";
  disabled?: boolean;
  /** Render as a link. Mutually exclusive with onClick. */
  href?: string;
  /** Render as a button. Mutually exclusive with href. */
  onClick?: () => void;
}

export interface NavConfig {
  /** Back link on the left. Mutually exclusive with title. */
  back?: { href: string; label: string };
  /** Static page title on the left when there is no back link. */
  title?: string;
  /** Gray status text shown after back/title (e.g. autosave timestamp). */
  status?: string;
  /** Red error text shown after back/title. Takes precedence over status. */
  error?: string;
  /** Action buttons/links on the right. */
  actions?: NavAction[];
}

const NavContext = createContext<((config: NavConfig) => void) | null>(null);

/**
 * Wraps all admin pages with a sticky top nav bar.
 *
 * Pages declare their nav content via {@link NavSlot}.
 */
export function NavConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<NavConfig>({});

  return (
    <NavContext.Provider value={setConfig}>
      <div className="min-h-screen flex flex-col">
        <nav className="flex items-center justify-between px-4 h-nav border-b border-gray-200 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-4">
            {config.back ? (
              <Link
                href={config.back.href}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                {config.back.label}
              </Link>
            ) : config.title ? (
              <span className="text-sm font-medium text-gray-700">
                {config.title}
              </span>
            ) : null}
            {config.error ? (
              <span className="text-sm text-red-500">{config.error}</span>
            ) : config.status ? (
              <span className="text-sm text-gray-400">{config.status}</span>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            {config.actions?.map((action) =>
              action.href ? (
                <Link
                  key={action.label}
                  href={action.href}
                  aria-label={action.label}
                  className={
                    action.variant === "dark"
                      ? "h-9 px-3 text-sm flex items-center bg-gray-900 text-white rounded-md hover:bg-gray-700"
                      : "h-9 px-3 text-sm flex items-center border border-gray-300 rounded-md hover:bg-gray-50"
                  }
                >
                  {action.icon ?? action.label}
                </Link>
              ) : (
                <button
                  key={action.label}
                  type="button"
                  onClick={action.onClick}
                  disabled={action.disabled}
                  aria-label={action.label}
                  className={
                    action.variant === "dark"
                      ? "h-9 px-3 text-sm flex items-center bg-gray-900 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
                      : "h-9 px-3 text-sm flex items-center border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                  }
                >
                  {action.icon ?? action.label}
                </button>
              )
            )}
          </div>
        </nav>
        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </div>
    </NavContext.Provider>
  );
}

/**
 * Declares what the admin nav should show for the current page.
 *
 * Place inside any admin page or component — the config is synced on every
 * render, so dynamic values (status text, disabled state) stay live without
 * extra wiring.
 *
 * @example
 * ```tsx
 * <NavSlot
 *   back={{ href: "/admin/posts", label: "← Zpět na správu článků" }}
 *   status={lastSaved ? `Automaticky uloženo ve ${formatTime(lastSaved)}` : undefined}
 *   error={saveError ?? undefined}
 *   actions={[
 *     { label: "Náhled", onClick: handlePreview, variant: "outline" },
 *     { label: "Publikovat", onClick: handlePublish, variant: "dark", disabled: isPending },
 *   ]}
 * />
 * ```
 */
export function NavSlot(config: NavConfig) {
  const setNavConfig = useContext(NavContext);
  if (!setNavConfig) throw new Error("NavSlot must be used within NavProvider");

  useIsomorphicLayoutEffect(() => {
    setNavConfig(config);
    return () => setNavConfig({});
  });

  return null;
}
