// src/components/inventory/InventoryControls.tsx - Updated to remove Unit Type Filter
"use client";

import React from "react";
import {
  Search,
  Filter,
  X,
  FileText,
  Trash2,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  InventoryItem,
  InventorySummary,
} from "../../hooks/useInventoryManager";

interface InventoryControlsProps {
  inventory: InventoryItem[];
  summary: InventorySummary;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedBrand: string;
  onBrandChange: (brand: string) => void;
  // 🔴 ลบ Unit type filter props ออก - ไม่ต้องการแล้วเพราะแสดงแค่ EA
  // selectedUnitType: UnitFilterType;
  // onUnitTypeChange: (unitType: UnitFilterType) => void;
  // ✅ Updated sortBy type to include fgCode
  sortBy: "name" | "quantity" | "date" | "fgCode";
  sortOrder: "asc" | "desc";
  onSortChange: (sortBy: string, sortOrder: string) => void;
  onClearFilters: () => void;
  onExport: () => Promise<void>;
  onClearAll: () => void;
  isExporting: boolean;
  filteredCount: number;
}

export const InventoryControls: React.FC<InventoryControlsProps> = ({
  inventory,
  summary,
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedBrand,
  onBrandChange,
  // 🔴 ลบ unit type filter props
  // selectedUnitType,
  // onUnitTypeChange,
  sortBy,
  sortOrder,
  onSortChange,
  onClearFilters,
  onExport,
  onClearAll,
  isExporting,
  filteredCount,
}) => {
  // Get unique categories and brands for filters
  const categories = React.useMemo(
    () => [...new Set(inventory.map((item) => item.category))].sort(),
    [inventory]
  );

  const brands = React.useMemo(
    () => [...new Set(inventory.map((item) => item.brand))].sort(),
    [inventory]
  );

  const hasActiveFilters =
    searchTerm || selectedCategory !== "all" || selectedBrand !== "all";
  // 🔴 ลบ selectedUnitType !== "all" ออก

  // State สำหรับการแสดง/ซ่อน filters dropdown
  const [showFilters, setShowFilters] = React.useState(false);

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm space-y-6">
      {/* Search and Actions */}
      <div className="flex flex-col xl:flex-row gap-4 items-start xl:items-center justify-between">
        <div className="flex-1 max-w-lg w-full">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="ค้นหาสินค้า รหัสสินค้า หรือบาร์โค้ด..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-fn-green focus:border-fn-green transition-all duration-200"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full xl:w-auto">
          <button
            onClick={onExport}
            disabled={isExporting || inventory.length === 0}
            className="flex-1 xl:flex-none px-4 py-3 bg-fn-green text-white rounded-xl hover:bg-fn-green-dark disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2 text-sm font-medium"
          >
            {isExporting ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                กำลังส่งออก...
              </>
            ) : (
              <>
                <FileText size={16} />
                ส่งออก CSV
              </>
            )}
          </button>

          <button
            onClick={onClearAll}
            disabled={inventory.length === 0}
            className="px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2 text-sm font-medium"
          >
            <Trash2 size={16} />
            ลบทั้งหมด
          </button>
        </div>
      </div>

      {/* 🔴 ลบ Unit Type Filter Section ออกทั้งหมด - ไม่ต้องการแล้ว */}
      {/* <div className="border-t border-gray-100 pt-6">
        <UnitTypeFilter
          selectedUnitType={selectedUnitType}
          onUnitTypeChange={onUnitTypeChange}
          inventory={inventory}
          className="mb-6"
        />
      </div> */}

      {/* Advanced Filters Toggle */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div
          className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={() => setShowFilters(!showFilters)}
        >
          <div className="flex items-center gap-3">
            <Filter size={18} className="text-gray-500" />
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">Filter & Sort</span>
              {hasActiveFilters && (
                <>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    กำลังกรอง
                  </span>
                  <span className="text-sm text-gray-600">
                    แสดง {filteredCount} จาก {inventory.length} รายการ
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Right side - actions and toggle icon */}
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClearFilters();
                }}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 p-1 rounded-lg transition-colors text-xs"
                title="ล้างตัวกรอง"
              >
                <X size={14} />
              </button>
            )}
            <div className="cursor-pointer p-1">
              {showFilters ? (
                <ChevronUp className="text-gray-400" size={20} />
              ) : (
                <ChevronDown className="text-gray-400" size={20} />
              )}
            </div>
          </div>
        </div>

        {/* Filter Content - Show/Hide */}
        {showFilters && (
          <div className="px-6 pb-6 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  หมวดหมู่สินค้า
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => onCategoryChange(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-fn-green focus:border-fn-green transition-all duration-200 text-sm"
                >
                  <option value="all">ทุกหมวดหมู่</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Brand Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  แบรนด์
                </label>
                <select
                  value={selectedBrand}
                  onChange={(e) => onBrandChange(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-fn-green focus:border-fn-green transition-all duration-200 text-sm"
                >
                  <option value="all">ทุกแบรนด์</option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  เรียงลำดับ
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => onSortChange(e.target.value, sortOrder)}
                    className="p-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-fn-green focus:border-fn-green transition-all duration-200 text-sm"
                  >
                    <option value="fgCode">รหัส F/FG</option>
                    {/* <option value="name">ชื่อสินค้า</option> */}
                    {/* <option value="quantity">จำนวน</option> */}
                    <option value="date">เวลาที่อัปเดต</option>
                  </select>
                  <select
                    value={sortOrder}
                    onChange={(e) => onSortChange(sortBy, e.target.value)}
                    className="p-3 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-fn-green focus:border-fn-green transition-all duration-200 text-sm"
                  >
                    <option value="asc">จากน้อยไปมาก</option>
                    <option value="desc">จากมากไปน้อย</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ✅ Summary Stats - แก้ไขให้เหมาะสมกับ EA เท่านั้น */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {summary.totalItems}
            </div>
            <div className="text-sm text-blue-700 font-medium">
              รายการสินค้า
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {Object.keys(summary.brands).length}
            </div>
            <div className="text-sm text-purple-700 font-medium">แบรนด์</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {summary.quantityBreakdown?.totalEA || 0}
            </div>
            <div className="text-sm text-green-700 font-medium">
              รวมทั้งหมด (ชิ้น)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
