import React from 'react';
import { Search, X, ArrowUpDown } from 'lucide-react';
import { LeadFilters, LeadSource, LeadStatus } from '../../types';

interface LeadFiltersBarProps {
  filters: LeadFilters;
  searchInput: string;
  onSearchChange: (value: string) => void;
  onFilterChange: (key: keyof LeadFilters, value: string) => void;
  onClearFilters: () => void;
}

const STATUSES: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost'];
const SOURCES: LeadSource[] = ['Website', 'Instagram', 'Referral'];

const hasActiveFilters = (filters: LeadFilters, searchInput: string): boolean =>
  !!(filters.status || filters.source || searchInput || (filters.sort && filters.sort !== 'latest'));

export const LeadFiltersBar: React.FC<LeadFiltersBarProps> = ({
  filters,
  searchInput,
  onSearchChange,
  onFilterChange,
  onClearFilters,
}) => {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name or email..."
          className="input-base pl-9"
        />
      </div>

      {/* Status filter */}
      <select
        value={filters.status || ''}
        onChange={(e) => onFilterChange('status', e.target.value)}
        className="input-base w-auto min-w-[130px]"
      >
        <option value="">All Statuses</option>
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      {/* Source filter */}
      <select
        value={filters.source || ''}
        onChange={(e) => onFilterChange('source', e.target.value)}
        className="input-base w-auto min-w-[130px]"
      >
        <option value="">All Sources</option>
        {SOURCES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      {/* Sort */}
      <div className="flex items-center gap-2 input-base w-auto cursor-pointer">
        <ArrowUpDown className="w-4 h-4 text-gray-400 shrink-0" />
        <select
          value={filters.sort || 'latest'}
          onChange={(e) => onFilterChange('sort', e.target.value)}
          className="bg-transparent border-none p-0 text-sm w-auto cursor-pointer focus:ring-0"
        >
          <option value="latest">Latest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>

      {/* Clear filters */}
      {hasActiveFilters(filters, searchInput) && (
        <button
          onClick={onClearFilters}
          className="btn-ghost text-red-500 dark:text-red-400 flex items-center gap-1.5 px-3"
        >
          <X className="w-3.5 h-3.5" />
          Clear
        </button>
      )}
    </div>
  );
};
