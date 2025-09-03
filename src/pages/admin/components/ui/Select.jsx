import React, { useEffect, useMemo, useRef, useState } from "react";
import { FiChevronDown, FiCheck, FiX, FiSearch } from "react-icons/fi";

/**
 * Reusable DropdownSelect (single-select)
 * - TailwindCSS for styles
 * - react-icons for icons
 * - JSX (no TypeScript)
 *
 * Props
 * - options: Array<{ value: string | number, label: string, icon?: ReactNode }>
 * - value: string | number | null
 * - onChange: (value) => void
 * - placeholder?: string
 * - label?: string
 * - error?: string
 * - disabled?: boolean
 * - clearable?: boolean (default true)
 * - searchable?: boolean (default false)
 * - className?: string (extra tailwind on wrapper)
 */
export function Select({
  options = [],
  value = null,
  onChange,
  placeholder = "Select...",
  label,
  error,
  disabled = false,
  clearable = true,
  searchable = false,
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const buttonRef = useRef(null);
  const panelRef = useRef(null);

  const selected = useMemo(() => options.find(o => o.value === value) || null, [options, value]);

  const filtered = useMemo(() => {
    if (!searchable || !query.trim()) return options;
    const q = query.toLowerCase();
    return options.filter(o => o.label.toLowerCase().includes(q));
  }, [options, query, searchable]);

  // Close on outside click
  useEffect(() => {
    function onDocClick(e) {
      if (!open) return;
      const b = buttonRef.current;
      const p = panelRef.current;
      if (b && b.contains(e.target)) return;
      if (p && p.contains(e.target)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  // Keyboard navigation within list
  const [activeIndex, setActiveIndex] = useState(-1);
  useEffect(() => {
    if (!open) setActiveIndex(-1);
  }, [open]);

  function handleKeyDown(e) {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      setOpen(true);
      setTimeout(() => setActiveIndex(0), 0);
      return;
    }
    if (!open) return;
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(i => Math.min((i + 1), filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(i => Math.max((i - 1), 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[activeIndex]) {
        onChange?.(filtered[activeIndex].value);
        setOpen(false);
      }
    }
  }

  function toggle() {
    if (disabled) return;
    setOpen(o => !o);
  }

  function clearSelection(e) {
    e.stopPropagation();
    if (disabled) return;
    onChange?.(null);
  }

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      )}

      <div className={`relative`}>
        <button
          ref={buttonRef}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={toggle}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={`flex w-full items-center justify-between gap-2 rounded-2xl border bg-white px-3 py-2 text-left shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            disabled
              ? "cursor-not-allowed border-gray-200 text-gray-400"
              : open
              ? "border-gray-300 ring-2 ring-indigo-500"
              : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <div className="flex min-w-0 items-center gap-2">
            {selected?.icon && <span className="shrink-0">{selected.icon}</span>}
            <span className={`truncate capitalize ${selected ? "text-gray-900" : "text-gray-500"}`}>
              {selected ? selected.label : placeholder}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {clearable && selected && !disabled && (
              <span
                onClick={clearSelection}
                className="rounded-full p-1 hover:bg-gray-100 active:bg-gray-200"
                role="button"
                aria-label="Clear selection"
              >
                <FiX className="h-4 w-4" />
              </span>
            )}
            <FiChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : "rotate-0"}`} />
          </div>
        </button>

        {/* Panel */}
        {open && (
          <div
            ref={panelRef}
            role="listbox"
            tabIndex={-1}
            className="absolute z-50 mt-2 max-h-72 w-full overflow-auto rounded-2xl border border-gray-200 bg-white p-1 shadow-2xl focus:outline-none"
          >
            {searchable && (
              <div className="sticky top-0 z-10 mb-1 flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-2 py-1.5">
                <FiSearch className="h-4 w-4" />
                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full border-0 p-0 text-sm focus:outline-none"
                />
              </div>
            )}

            {filtered.length === 0 && (
              <div className="px-3 py-2 text-sm text-gray-500">No results</div>
            )}

            <ul className="space-y-0.5">
              {filtered.map((opt, idx) => {
                const isSelected = value === opt.value;
                const isActive = idx === activeIndex;
                return (
                  <li key={String(opt.value)}>
                    <button
                      role="option"
                      aria-selected={isSelected}
                      onMouseEnter={() => setActiveIndex(idx)}
                      onClick={() => {
                        onChange?.(opt.value);
                        setOpen(false);
                      }}
                      className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left transition focus:outline-none ${
                        isActive ? "bg-gray-100" : "hover:bg-gray-50"
                      } ${isSelected ? "ring-2 ring-indigo-500" : ""}`}
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                        <span className="truncate text-sm text-gray-800">{opt.label}</span>
                      </span>
                      {isSelected && <FiCheck className="h-4 w-4" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}