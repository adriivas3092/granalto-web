"use client";

import { Search } from "lucide-react";
import { useId } from "react";

type Props = {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
};

/** Campo de búsqueda accesible con label asociado. */
export function SearchInput({ label, placeholder, value, onChange }: Props) {
  const id = useId();
  return (
    <div className="relative w-full max-w-md">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mineral"
      />
      <input
        id={id}
        type="search"
        value={value}
        placeholder={placeholder ?? label}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-sm border border-stone-beige bg-white py-3 pl-10 pr-4 text-sm text-ink placeholder:text-mineral focus:border-ink focus:outline-none"
      />
    </div>
  );
}
