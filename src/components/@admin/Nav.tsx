"use client";

import {
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";

interface NavContextValue {
  leftRef: RefObject<HTMLDivElement | null>;
  rightRef: RefObject<HTMLDivElement | null>;
}

const NavContext = createContext<NavContextValue>({
  leftRef: { current: null },
  rightRef: { current: null },
});

/**
 * Wraps all admin pages with a sticky top nav bar.
 *
 * Renders two empty slot divs (left, right) that pages populate via
 * {@link NavSlot}.
 */
export function NavProvider({ children }: { children: ReactNode }) {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  return (
    <NavContext.Provider value={{ leftRef, rightRef }}>
      <div className="min-h-screen flex flex-col">
        <nav className="flex items-center justify-between px-4 h-[49px] border-b border-gray-200 bg-white sticky top-0 z-10">
          <div ref={leftRef} className="flex items-center gap-4" />
          <div ref={rightRef} className="flex items-center gap-2" />
        </nav>
        {children}
      </div>
    </NavContext.Provider>
  );
}

/**
 * Portals content into the admin nav's left and/or right slots.
 *
 * Render this inside any admin page or component — state from the
 * surrounding component tree flows naturally through the portal.
 *
 * @example
 * ```tsx
 * <NavSlot
 *   left={<Link href="/admin/posts">← Zpět</Link>}
 *   right={<button onClick={handlePublish}>Publikovat</button>}
 * />
 * ```
 */
export function NavSlot({
  left,
  right,
}: {
  left?: ReactNode;
  right?: ReactNode;
}) {
  const { leftRef, rightRef } = useContext(NavContext);
  const [mounted, setMounted] = useState(false);

  // useLayoutEffect fires before the browser paints, so the slots are
  // populated before the first visible frame — no flash.
  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {left && leftRef.current && createPortal(left, leftRef.current)}
      {right && rightRef.current && createPortal(right, rightRef.current)}
    </>
  );
}
