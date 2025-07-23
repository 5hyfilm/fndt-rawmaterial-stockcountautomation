// Path: src/components/InventoryDisplay.tsx - Enhanced with Collapsible Controls
"use client";

import React, { useState, useMemo } from "react";
import { ChevronUp, ChevronDown, Settings } from "lucide-react";
import {
  InventoryItem,
  QuantityDetail,
  InventorySummary,
} from "../hooks/inventory/types";
import { Product } from "../types/product";
import {
  InventoryControls,
  InventoryList,
  ConfirmDeleteDialog,
  ErrorAlert,
  LoadingSpinner,
} from "./inventory";
import {
  UnitFilterType,
  filterInventoryByUnitType,
} from "./inventory/UnitTypeFilter";

interface InventoryDisplayProps {
  inventory: InventoryItem[];
  isLoading: boolean;
  error: string | null;
  summary: InventorySummary;
  onAddOrUpdateItem: (
    product: Product,
    quantityInput: number,
    barcodeType?: "ea" | "dsp" | "cs"
  ) => boolean;
  onUpdateItemQuantity: (itemId: string, newQuantity: number) => boolean;
  onUpdateItemQuantityDetail?: (
    materialCode: string,
    quantityDetail: QuantityDetail
  ) => boolean;
  onRemoveItem: (itemId: string) => boolean;
  onClearInventory: () => boolean;
  onSearch: (searchTerm: string) => InventoryItem[];
  onExport: () => Promise<void>;
  onClearError: () => void;
  className?: string;
}

type SortBy = "name" | "quantity" | "date" | "fgCode";
type SortOrder = "asc" | "desc";

interface EditState {
  itemId: string | null;
  simpleQuantity: number;
  quantityDetail?: QuantityDetail;
}

// ✅ FIXED: Helper function to extract F/FG code for sorting - with new product support
const getFgCode = (item: InventoryItem): string => {
  // ✅ ตรวจสอบว่าเป็นสินค้าใหม่หรือไม่
  const isNewProduct =
    !item.materialCode ||
    item.materialCode.trim() === "" ||
    item.materialCode.startsWith("NEW_") ||
    item.materialCode.startsWith("new_") ||
    item.brand === "สินค้าใหม่" ||
    item.brand === "เพิ่มใหม่" ||
    item.productName?.startsWith("FG");

  if (isNewProduct) {
    // ✅ สำหรับสินค้าใหม่: ใช้รหัสที่ผู้ใช้กรอก (เก็บใน productData.name) หรือ barcode
    if (item.productData?.name) {
      return item.productData.name.toString().toUpperCase();
    }
    // Fallback สำหรับสินค้าใหม่: ใช้ barcode
    if (item.barcode) {
      return item.barcode.toString().toUpperCase();
    }
  } else {
    // ✅ สำหรับสินค้าในฐานข้อมูล: ใช้รหัสจาก productData.id หรือ materialCode
    if (item.productData?.id && !item.productData.id.startsWith("NEW_")) {
      return item.productData.id.toString().toUpperCase();
    }

    // ใช้ materialCode สำหรับสินค้าเก่า
    if (
      item.materialCode &&
      !item.materialCode.includes("หมื่น") &&
      !item.materialCode.includes("นิว")
    ) {
      return item.materialCode.toString().toUpperCase();
    }

    // Fallback สำหรับสินค้าเก่า: ใช้ barcode
    if (item.barcode) {
      return item.barcode.toString().toUpperCase();
    }
  }

  // สุดท้าย: ใช้ id
  return item.id.toString().toUpperCase();
};

export const InventoryDisplay: React.FC<InventoryDisplayProps> = ({
  inventory,
  isLoading,
  error,
  summary,
  onUpdateItemQuantity,
  onUpdateItemQuantityDetail,
  onRemoveItem,
  onClearInventory,
  onSearch,
  onExport,
  onClearError,
  className = "",
}) => {
  // ✅ State management
  const [searchTerm, setSearchTerm] = useState("");
  const [editState, setEditState] = useState<EditState>({
    itemId: null,
    simpleQuantity: 0,
    quantityDetail: undefined,
  });

  // ✅ State for clear all confirmation modal
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  // ✅ State for individual delete confirmation modal
  const [showConfirmDeleteItem, setShowConfirmDeleteItem] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null);

  // ✅ NEW: State for controls visibility
  const [showControls, setShowControls] = useState(true);

  // ✅ Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [selectedUnitType, setSelectedUnitType] =
    useState<UnitFilterType>("all");

  // ✅ Sort states - default to F/FG code sorting
  const [sortBy, setSortBy] = useState<SortBy>("fgCode");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [isExporting, setIsExporting] = useState(false);

  // ✅ FIXED: Combined sort handler for InventoryControls
  const handleSortChange = (newSortBy: string, newSortOrder: string) => {
    console.log("🔧 handleSortChange:", { newSortBy, newSortOrder });
    setSortBy(newSortBy as SortBy);
    setSortOrder(newSortOrder as SortOrder);
  };

  // ✅ Clear filters handler
  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedBrand("all");
    setSelectedUnitType("all");
    setSortBy("fgCode");
    setSortOrder("asc");
  };

  // ✅ NEW: Toggle controls visibility
  const toggleControls = () => {
    setShowControls(!showControls);
  };

  // ✅ Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      searchTerm.trim() !== "" ||
      selectedCategory !== "all" ||
      selectedBrand !== "all" ||
      selectedUnitType !== "all" ||
      sortBy !== "fgCode" ||
      sortOrder !== "asc"
    );
  }, [
    searchTerm,
    selectedCategory,
    selectedBrand,
    selectedUnitType,
    sortBy,
    sortOrder,
  ]);

  // ✅ Helper function to find item by itemId
  const findItemById = (itemId: string): InventoryItem | undefined => {
    return inventory.find((item) => item.id === itemId);
  };

  // ✅ FIXED: Wrapper function to handle materialCode conversion
  const handleEditQuantityDetailSave = (
    materialCode: string,
    quantityDetail: QuantityDetail
  ): boolean => {
    console.log("🔧 handleEditQuantityDetailSave:", {
      materialCode,
      quantityDetail,
      functionExists: !!onUpdateItemQuantityDetail,
    });

    if (!onUpdateItemQuantityDetail) {
      console.error("❌ onUpdateItemQuantityDetail function not provided");
      return false;
    }

    // Call the actual function with materialCode
    const success = onUpdateItemQuantityDetail(materialCode, quantityDetail);

    if (success) {
      // Clear edit state
      setEditState({
        itemId: null,
        simpleQuantity: 0,
        quantityDetail: undefined,
      });
    }

    return success;
  };

  // ✅ Enhanced filtered and sorted inventory with Unit Type filter
  const filteredAndSortedInventory = useMemo(() => {
    let filtered = [...inventory];

    // Apply search filter
    if (searchTerm.trim()) {
      const searchResults = onSearch(searchTerm.trim());
      filtered = searchResults;
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (item) =>
          item.category === selectedCategory ||
          item.productGroup === selectedCategory
      );
    }

    // Apply brand filter
    if (selectedBrand !== "all") {
      filtered = filtered.filter((item) => item.brand === selectedBrand);
    }

    // ✅ Apply unit type filter
    filtered = filterInventoryByUnitType(filtered, selectedUnitType);

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "name":
          comparison = a.productName.localeCompare(b.productName, "th");
          break;
        case "quantity":
          // ✅ Enhanced quantity comparison supporting multi-unit
          const aQty = a.quantities
            ? Object.values(a.quantities).reduce(
                (sum, qty) => sum + (qty || 0),
                0
              )
            : a.quantity || 0;
          const bQty = b.quantities
            ? Object.values(b.quantities).reduce(
                (sum, qty) => sum + (qty || 0),
                0
              )
            : b.quantity || 0;
          comparison = aQty - bQty;
          break;
        case "date":
          comparison =
            new Date(a.lastUpdated).getTime() -
            new Date(b.lastUpdated).getTime();
          break;
        case "fgCode":
          // ✅ FIXED: Now uses the corrected getFgCode function
          const aCode = getFgCode(a);
          const bCode = getFgCode(b);
          console.log("🔍 Sorting fgCode:", {
            a: { id: a.id, productName: a.productName, code: aCode },
            b: { id: b.id, productName: b.productName, code: bCode },
          });
          comparison = aCode.localeCompare(bCode);
          break;
        default:
          comparison = 0;
      }

      return sortOrder === "desc" ? -comparison : comparison;
    });

    return filtered;
  }, [
    inventory,
    searchTerm,
    selectedCategory,
    selectedBrand,
    selectedUnitType,
    sortBy,
    sortOrder,
    onSearch,
  ]);

  // ✅ Edit handlers
  const handleEditStart = (item: InventoryItem) => {
    console.log("✏️ Starting edit for item:", item.id, item.materialCode);

    const totalQuantity = item.quantities
      ? Object.values(item.quantities).reduce((sum, qty) => sum + (qty || 0), 0)
      : item.quantity || 0;

    setEditState({
      itemId: item.id,
      simpleQuantity: totalQuantity,
      quantityDetail: item.quantities
        ? {
            cs: item.quantities.cs || 0,
            dsp: item.quantities.dsp || 0,
            ea: item.quantities.ea || 0,
            isManualEdit: true,
            lastModified: new Date().toISOString(),
          }
        : undefined,
    });
  };

  const handleEditSave = () => {
    if (!editState.itemId) return;

    const item = findItemById(editState.itemId);
    if (!item) {
      console.error("❌ Item not found for saving:", editState.itemId);
      return;
    }

    console.log("💾 Saving edit for item:", {
      itemId: item.id,
      materialCode: item.materialCode,
      simpleQuantity: editState.simpleQuantity,
    });

    // For simple quantity updates (legacy items)
    const success = onUpdateItemQuantity(
      editState.itemId,
      editState.simpleQuantity
    );

    if (success) {
      setEditState({
        itemId: null,
        simpleQuantity: 0,
        quantityDetail: undefined,
      });
    }
  };

  const handleEditCancel = () => {
    setEditState({
      itemId: null,
      simpleQuantity: 0,
      quantityDetail: undefined,
    });
  };

  const handleEditQuantityChange = (quantity: number) => {
    setEditState((prev) => ({
      ...prev,
      simpleQuantity: quantity,
    }));
  };

  const handleEditQuantityDetailChange = (quantityDetail: QuantityDetail) => {
    setEditState((prev) => ({
      ...prev,
      quantityDetail,
    }));
  };

  const handleQuickAdjust = (
    itemId: string,
    currentQuantity: number,
    delta: number
  ) => {
    const newQuantity = Math.max(0, currentQuantity + delta);
    onUpdateItemQuantity(itemId, newQuantity);
  };

  // ✅ Individual delete handlers
  const handleRequestDeleteItem = (itemId: string) => {
    const item = findItemById(itemId);
    if (item) {
      setItemToDelete(item);
      setShowConfirmDeleteItem(true);
    }
  };

  const handleConfirmDeleteItem = () => {
    if (itemToDelete) {
      onRemoveItem(itemToDelete.id);
      setItemToDelete(null);
    }
    setShowConfirmDeleteItem(false);
  };

  const handleCancelDeleteItem = () => {
    setItemToDelete(null);
    setShowConfirmDeleteItem(false);
  };

  // ✅ Export handler
  const handleExport = async () => {
    setIsExporting(true);
    try {
      await onExport();
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* ✅ Error Alert */}
      {error && <ErrorAlert message={error} onDismiss={onClearError} />}

      {/* ✅ NEW: Controls Toggle Header */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {/* Toggle Header */}
        <button
          onClick={toggleControls}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 rounded-xl"
        >
          <div className="flex items-center gap-3">
            <Settings className="text-gray-500" size={20} />
            <span className="text-gray-700 font-medium">Control Panel</span>
            {hasActiveFilters && (
              <span className="bg-fn-green text-white text-xs px-2 py-1 rounded-full">
                มีการกรองข้อมูล
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {showControls ? "ซ่อน" : "แสดง"}
            </span>
            {showControls ? (
              <ChevronUp className="text-gray-400" size={20} />
            ) : (
              <ChevronDown className="text-gray-400" size={20} />
            )}
          </div>
        </button>

        {/* ✅ Collapsible Controls Content */}
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            showControls ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="border-t border-gray-200">
            <InventoryControls
              inventory={inventory}
              summary={summary}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedBrand={selectedBrand}
              onBrandChange={setSelectedBrand}
              selectedUnitType={selectedUnitType}
              onUnitTypeChange={setSelectedUnitType}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={handleSortChange}
              onClearFilters={handleClearFilters}
              onExport={handleExport}
              onClearAll={() => setShowConfirmClear(true)}
              isExporting={isExporting}
              filteredCount={filteredAndSortedInventory.length}
            />
          </div>
        </div>
      </div>

      {/* ✅ Inventory List */}
      <InventoryList
        items={filteredAndSortedInventory}
        totalCount={inventory.length}
        editingItem={editState.itemId}
        editQuantity={editState.simpleQuantity}
        onEditStart={handleEditStart}
        onEditSave={handleEditSave}
        onEditQuantityDetailSave={handleEditQuantityDetailSave}
        onEditCancel={handleEditCancel}
        onEditQuantityChange={handleEditQuantityChange}
        onEditQuantityDetailChange={handleEditQuantityDetailChange}
        onQuickAdjust={handleQuickAdjust}
        onRemoveItem={handleRequestDeleteItem}
      />

      {/* ✅ Clear All Confirmation Modal */}
      <ConfirmDeleteDialog
        isOpen={showConfirmClear}
        onConfirm={() => {
          onClearInventory();
          setShowConfirmClear(false);
        }}
        onCancel={() => setShowConfirmClear(false)}
        title="ล้างข้อมูลทั้งหมด"
        message="คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลสินค้าทั้งหมด?"
        confirmText="ลบทั้งหมด"
        cancelText="ยกเลิก"
        type="danger"
        itemCount={inventory.length}
      />

      {/* ✅ Individual Delete Confirmation Modal */}
      <ConfirmDeleteDialog
        isOpen={showConfirmDeleteItem}
        onConfirm={handleConfirmDeleteItem}
        onCancel={handleCancelDeleteItem}
        title="ลบรายการสินค้า"
        message={`คุณแน่ใจหรือไม่ว่าต้องการลบ "${itemToDelete?.productName}" ออกจาก inventory?`}
        confirmText="ลบ"
        cancelText="ยกเลิก"
        type="warning"
      />
    </div>
  );
};
