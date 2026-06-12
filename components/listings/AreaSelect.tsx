"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface CreatableSelectProps {
  value?: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  className?: string;
}

export function CreatableSelect({
  value,
  onChange,
  options,
  placeholder = "Select or type...",
  className,
}: CreatableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState(value || "");
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filtered = options.filter((o) =>
    o.toLowerCase().includes(search.toLowerCase())
  );

  const isNewValue =
    search && !options.some((o) => o.toLowerCase() === search.toLowerCase());

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    setSearch(value || "");
  }, [value]);

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        className={className}
      />
      {isOpen && (filtered.length > 0 || isNewValue) && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-48 overflow-y-auto"
        >
          {filtered.map((opt) => (
            <button
              key={opt}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                setSearch(opt);
                onChange(opt);
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {opt}
            </button>
          ))}
          {isNewValue && (
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(search);
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm text-primary font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-t border-gray-100 dark:border-gray-700"
            >
              + Add &ldquo;{search}&rdquo;
            </button>
          )}
        </div>
      )}
    </div>
  );
}
