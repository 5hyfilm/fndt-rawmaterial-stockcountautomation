// src/components/search/SearchResults.tsx
"use client";

import React from "react";
import { Search } from "lucide-react";
import type { SearchResult } from "@/types/search";

interface SearchResultsProps {
  query: string;
  results: SearchResult[];
  isLoading: boolean;
  totalResults: number;
  onSelectResult: (result: SearchResult) => void;
  renderResult: (result: SearchResult) => React.ReactNode;
  emptyMessage?: string;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  query,
  results,
  isLoading,
  totalResults,
  onSelectResult,
  renderResult,
  emptyMessage = "ไม่พบผลลัพธ์",
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin w-8 h-8 border-4 border-fn-green border-t-transparent rounded-full mx-auto mb-3"></div>
        <p className="text-gray-600">กำลังค้นหา...</p>
      </div>
    );
  }

  if (!query) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Search size={32} className="mx-auto mb-3 opacity-50" />
        <p>พิมพ์เพื่อค้นหาสินค้า</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Search size={32} className="mx-auto mb-3 opacity-50" />
        <p>{emptyMessage}</p>
        <p className="text-sm mt-2">ลองค้นหาด้วยคำอื่น หรือสแกนบาร์โค้ด</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 text-sm text-gray-600">
        พบ {totalResults} ผลลัพธ์สำหรับ &ldquo;{query}&rdquo;
      </div>
      <div className="space-y-2">
        {results.map((result, index) => (
          <div
            key={`${result.id || result.barcode}-${index}`}
            onClick={() => onSelectResult(result)}
            className="cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
          >
            {renderResult(result)}
          </div>
        ))}
      </div>
    </div>
  );
};
