// src/components/search/SearchBar.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Search, X, Filter, ScanLine } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
  showScanButton?: boolean;
  onScanClick?: () => void;
  showFilterButton?: boolean;
  onFilterClick?: () => void;
  isLoading?: boolean;
  debounceMs?: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onClear,
  placeholder = "ค้นหาสินค้า, แบรนด์, หรือบาร์โค้ด...",
  showScanButton = false,
  onScanClick,
  showFilterButton = false,
  onFilterClick,
  isLoading = false,
  debounceMs = 300,
}) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localValue, value, onChange, debounceMs]);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleClear = () => {
    setLocalValue("");
    onClear();
  };

  return (
    <div className="relative flex items-center gap-2">
      <div className="relative flex-1">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={16}
        />
        <input
          type="text"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fn-green focus:border-fn-green transition-colors"
        />

        {localValue && !isLoading && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        )}

        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin w-4 h-4 border-2 border-fn-green border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>

      {showScanButton && onScanClick && (
        <button
          onClick={onScanClick}
          className="bg-fn-green hover:bg-fn-green/90 text-white p-2 rounded-lg transition-colors"
          title="สแกนบาร์โค้ด"
        >
          <ScanLine size={16} />
        </button>
      )}

      {showFilterButton && onFilterClick && (
        <button
          onClick={onFilterClick}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors"
          title="filter"
        >
          <Filter size={16} />
        </button>
      )}
    </div>
  );
};
