// src/components/search/FilterPanel.tsx
"use client";

import React from "react";
import { X } from "lucide-react";
import type { FilterOption } from "@/types/search";
import { FilterGroup } from "./FilterGroup";

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    category: {
      value: string;
      options: FilterOption[];
      onChange: (value: string) => void;
    };
    brand: {
      value: string;
      options: FilterOption[];
      onChange: (value: string) => void;
    };
    sortBy: {
      value: string;
      onChange: (value: string) => void;
    };
    sortOrder: {
      value: "asc" | "desc";
      onChange: (value: "asc" | "desc") => void;
    };
  };
  onClearAll: () => void;
  activeFiltersCount: number;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  isOpen,
  onClose,
  filters,
  onClearAll,
  activeFiltersCount,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose}>
      <div
        className="absolute top-0 right-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">filter</h3>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <span className="bg-fn-green text-white text-xs px-2 py-1 rounded-full">
                {activeFiltersCount}
              </span>
            )}
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-6 h-full overflow-y-auto">
          <FilterGroup
            title="หมวดหมู่"
            value={filters.category.value}
            options={filters.category.options}
            onChange={filters.category.onChange}
          />

          <FilterGroup
            title="แบรนด์"
            value={filters.brand.value}
            options={filters.brand.options}
            onChange={filters.brand.onChange}
          />

          <div>
            <h4 className="font-medium text-gray-900 mb-3">เรียงตาม</h4>
            <select
              value={`${filters.sortBy.value}-${filters.sortOrder.value}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split("-") as [
                  string,
                  "asc" | "desc"
                ];
                filters.sortBy.onChange(sortBy);
                filters.sortOrder.onChange(sortOrder);
              }}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fn-green focus:border-fn-green"
            >
              <option value="name-asc">ชื่อ (ก-ฮ)</option>
              <option value="name-desc">ชื่อ (ฮ-ก)</option>
              <option value="brand-asc">แบรนด์ (ก-ฮ)</option>
              <option value="brand-desc">แบรนด์ (ฮ-ก)</option>
              <option value="category-asc">หมวดหมู่ (ก-ฮ)</option>
              <option value="category-desc">หมวดหมู่ (ฮ-ก)</option>
            </select>
          </div>

          {activeFiltersCount > 0 && (
            <button
              onClick={onClearAll}
              className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              ล้างตัวกรองทั้งหมด
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
