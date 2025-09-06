import React, { useEffect, useRef, useState } from "react";

/**
 * Reusable Collapse component using Tailwind for styling.
 * - Works controlled or uncontrolled
 * - Smooth height transition
 * - Accessible: header gets button-like behavior with aria-expanded
 *
 * Usage:
 * <Collapse header={<span>More</span>} defaultOpen>
 *   <p>Hidden content</p>
 * </Collapse>
 */
export default function Collapse({
  isOpen: controlledOpen,
  defaultOpen = false,
  onToggle,
  duration = 300,
  unmountOnExit = false,
  className = "",
  header,
  children,
}) {
  const [isOpenInternal, setIsOpenInternal] = useState(defaultOpen);
  const isControlled = typeof controlledOpen === "boolean";
  const isOpen = isControlled ? controlledOpen : isOpenInternal;

  const contentRef = useRef(null);
  const [maxHeight, setMaxHeight] = useState(isOpen ? "none" : 0);
  const [isMeasuring, setIsMeasuring] = useState(false);

  // Update maxHeight whenever open state changes
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    // Measure content height
    const height = el.scrollHeight;

    // If opening: set to measured height, then after transition set to 'none'
    if (isOpen) {
      setIsMeasuring(true);
      // set to measured px so transition runs from 0 -> height
      setMaxHeight(height);

      const t = setTimeout(() => {
        setMaxHeight("none");
        setIsMeasuring(false);
      }, duration + 20);

      return () => clearTimeout(t);
    }

    // If closing: from 'none' we need to measure and set px first so transition runs
    if (!isOpen) {
      setIsMeasuring(true);
      // if previously 'none', force the measured height first
      requestAnimationFrame(() => {
        const measured = el.scrollHeight;
        // start from measured px then set to 0 so transition runs
        setMaxHeight(measured);

        // next tick, collapse to 0
        requestAnimationFrame(() => {
          setMaxHeight(0);
        });
      });

      const t = setTimeout(() => {
        setIsMeasuring(false);
      }, duration + 20);

      return () => clearTimeout(t);
    }
  }, [isOpen, duration]);

  // Toggle helper
  const toggle = () => {
    if (isControlled) {
      onToggle?.(!controlledOpen);
    } else {
      setIsOpenInternal((s) => {
        const next = !s;
        onToggle?.(next);
        return next;
      });
    }
  };

  // header keyboard handling (Enter/Space)
  const onHeaderKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  };

  // If unmountOnExit and closed (and not animating) -> return null
  if (unmountOnExit && !isOpen && !isMeasuring) return null;

  return (
    <div className={`w-full ${className}`}>
      {header ? (
        <div
          role="button"
          tabIndex={0}
          aria-expanded={isOpen}
          onClick={toggle}
          onKeyDown={onHeaderKeyDown}
          className="flex items-center justify-between cursor-pointer select-none"
        >
          {header}
        </div>
      ) : null}

      {/* Outer wrapper controls overflow + transition */}
      <div
        aria-hidden={!isOpen}
        style={{
          transition: `max-height ${duration}ms ease`,
          maxHeight: typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight,
          overflow: maxHeight === "none" ? "visible" : "hidden",
        }}
      >
        <div ref={contentRef} className="pt-0">
          {children}
        </div>
      </div>
    </div>
  );
}


/* ==========================================
   Example usage (keep this in a separate file
   in your app, or uncomment to use in dev)
   ==========================================

import React, { useState } from "react";
import Collapse from "./ReusableCollapse";

function Demo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6 max-w-xl mx-auto">
      <Collapse
        header={
          <div className="w-full flex items-center justify-between p-3 bg-gray-100 rounded-md">
            <span className="font-medium">Show details</span>
            <span className="text-sm text-gray-500">{open ? "-" : "+"}</span>
          </div>
        }
        isOpen={open}
        onToggle={setOpen}
        duration={250}
      >
        <div className="p-4 bg-white border rounded-md">
          <p className="mb-2">Here are the hidden details — collapsible content.</p>
          <p className="text-sm text-gray-600">Works with controlled or uncontrolled mode.</p>
        </div>
      </Collapse>
    </div>
  );
}

export default Demo;
*/
