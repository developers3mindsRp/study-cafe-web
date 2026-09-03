import React from "react";

import type { CaseLawFilterOption } from "@/services/platform.service";

export const CASE_LAW_SORT_OPTIONS = [
  { label: "Latest", value: "latest" },
  { label: "Oldest", value: "oldest" },
] as const;

export interface CaseLawFilterState {
  court: string;
  taxType: string;
  sort: string;
}

interface Props {
  courts: CaseLawFilterOption[];
  taxTypes: CaseLawFilterOption[];
  value: CaseLawFilterState;
  onChange: (patch: Partial<CaseLawFilterState>) => void;
  onClear: () => void;
  /** Shown next to the filters so the count reflects the filters actually applied. */
  total: number;
  disabled?: boolean;
}

const SELECT_CLASS =
  "border p-2 pr-8 m-2 md:m-0 rounded-[10px] text-ellipsis appearance-none w-full sm:w-[180px] md:w-[200px] lg:w-[220px] truncate bg-white disabled:opacity-60";

const Chevron = () => (
  <svg
    className="w-4 h-4 text-gray-500 absolute right-[5px] top-1/2 -translate-y-1/2 pointer-events-none"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
  </svg>
);

const CaseLawFilters = ({
  courts,
  taxTypes,
  value,
  onChange,
  onClear,
  total,
  disabled = false,
}: Props) => {
  const hasActiveFilters =
    value.court !== "" || value.taxType !== "" || value.sort !== "latest";

  return (
    <div className="filter-bar mb-8 md:px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:gap-4 gap-2 px-4 md:px-0 md:flex-wrap md:items-center">

        {/* Sort */}
        <div className="relative inline-block w-full sm:w-auto">
          <select
            aria-label="Sort case laws"
            value={value.sort}
            disabled={disabled}
            onChange={(e) => onChange({ sort: e.target.value })}
            className={SELECT_CLASS}
          >
            {CASE_LAW_SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <Chevron />
        </div>

        {/* Court */}
        <div className="relative inline-block w-full sm:w-auto">
          <select
            aria-label="Filter by court"
            value={value.court}
            disabled={disabled || courts.length === 0}
            onChange={(e) => onChange({ court: e.target.value })}
            className={SELECT_CLASS}
          >
            <option value="">All Courts</option>
            {courts.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          <Chevron />
        </div>

        {/* Type of tax */}
        <div className="relative inline-block w-full sm:w-auto">
          <select
            aria-label="Filter by category"
            value={value.taxType}
            disabled={disabled || taxTypes.length === 0}
            onChange={(e) => onChange({ taxType: e.target.value })}
            className={SELECT_CLASS}
          >
            <option value="">All Categories</option>
            {taxTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <Chevron />
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            disabled={disabled}
            className="border p-2 m-2 md:m-0 rounded-[10px] text-[#09339B] flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-60"
            onClick={onClear}
          >
            Clear All Filter
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="mt-[2px]">
              <path
                d="M8.75 0.75L0.75054 8.74947M8.74947 8.75L0.75 0.750567"
                stroke="#09339B"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        <span className="md:ml-auto px-2 text-sm text-[#696969] whitespace-nowrap">
          {total} {total === 1 ? "judgement" : "judgements"}
        </span>
      </div>
    </div>
  );
};

export default CaseLawFilters;
