// src/components/search/FilterGroup.tsx
"use client";

import React, { useState } from "react";
import type { FilterOption } from "@/types/search";

interface FilterGroupProps {
  title: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
  showCount?: number;
}

export const FilterGroup: React.FC<FilterGroupProps> = ({
  title,
  value,
  options,
  onChange,
  showCount = 5,
}) => {
  const [showAll, setShowAll] = useState(false);
  const displayOptions = showAll ? options : options.slice(0, showCount);

  return (
    <div>
      <h4 className="font-medium text-gray-900 mb-3">{title}</h4>
      <div className="space-y-2">
        <label className="flex items-center">
          <input
            type="radio"
            name={title}
            value=""
            checked={value === ""}
            onChange={() => onChange("")}
            className="mr-2"
          />
          <span>ทั้งหมด</span>
        </label>
        {displayOptions.map((option) => (
          <label
            key={option.value}
            className="flex items-center justify-between"
          >
            <div className="flex items-center">
              <input
                type="radio"
                name={title}
                value={option.value}
                checked={value === option.value}
                onChange={() => onChange(option.value)}
                className="mr-2"
              />
              <span>{option.label}</span>
            </div>
            {option.count !== undefined && (
              <span className="text-sm text-gray-500">({option.count})</span>
            )}
          </label>
        ))}
        {options.length > showCount && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-fn-green text-sm hover:underline"
          >
            {showAll ? "แสดงน้อยลง" : `แสดงทั้งหมด (${options.length})`}
          </button>
        )}
      </div>
    </div>
  );
};
