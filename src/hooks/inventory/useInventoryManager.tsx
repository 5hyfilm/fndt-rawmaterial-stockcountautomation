// Path: src/hooks/inventory/useInventoryManager.tsx - Phase 2: Fixed TypeScript Issues
"use client";

import { useState, useEffect, useMemo } from "react";
import {
  InventoryItem,
  InventorySummary,
  UseInventoryManagerReturn,
  QuantityDetail,
  StorageConfig,
  migrateOldInventoryItem,
  isLegacyInventoryItem,
  isModernInventoryItem,
  LegacyInventoryItem,
} from "./types";
import { useInventoryStorage } from "./useInventoryStorage";
import { useInventoryOperations } from "./useInventoryOperations";

const STORAGE_CONFIG: StorageConfig = {
  storageKey: "fn_inventory_data_v2", // ✅ เปลี่ยน key ใหม่
  versionKey: "fn_inventory_version_v2",
  currentVersion: "2.0", // ✅ Version ใหม่
};

export const useInventoryManager = (): UseInventoryManagerReturn => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Storage operations
  const {
    loadInventory: loadFromStorage,
    saveInventory,
    // ✅ Remove unused variables to fix ESLint warnings
    // isLoading: storageLoading,
    // error: storageError,
  } = useInventoryStorage(STORAGE_CONFIG);

  // ✅ Business operations
  const {
    addOrUpdateMultiUnitItem,
    updateUnitQuantity,
    findItemByMaterialCode,
    addOrUpdateItem, // legacy
    updateItemQuantity, // legacy
    findItemByBarcode, // legacy
    removeItem,
    searchItems,
  } = useInventoryOperations({
    inventory,
    setInventory,
    saveInventory,
    setError,
  });

  // ✅ FIXED: Data migration helper with proper type safety
  const migrateOldData = (oldData: unknown[]): InventoryItem[] => {
    console.log("🔄 Migrating old inventory data...");

    try {
      return oldData
        .map((oldItem) => {
          // Type guard to ensure oldItem is an object
          if (!oldItem || typeof oldItem !== "object") {
            console.warn("⚠️ Skipping invalid data item:", oldItem);
            return null;
          }

          // ✅ Use type guards instead of unsafe casting
          if (isModernInventoryItem(oldItem)) {
            // Already in new format, no migration needed
            return oldItem;
          }

          if (isLegacyInventoryItem(oldItem)) {
            // Migrate legacy item
            const barcodeType = oldItem.barcodeType || "ea";
            return migrateOldInventoryItem(oldItem, barcodeType);
          }

          // ✅ Handle unknown format by attempting to convert to legacy first
          const unknownItem = oldItem as Record<string, unknown>;

          // Check if it has minimum required fields for legacy item
          if (
            typeof unknownItem.id === "string" &&
            typeof unknownItem.productName === "string" &&
            typeof unknownItem.barcode === "string"
          ) {
            // Convert to legacy item structure
            const legacyItem: LegacyInventoryItem = {
              id: unknownItem.id,
              materialCode:
                typeof unknownItem.materialCode === "string"
                  ? unknownItem.materialCode
                  : unknownItem.id,
              productName: unknownItem.productName,
              brand:
                typeof unknownItem.brand === "string"
                  ? unknownItem.brand
                  : "ไม่ระบุ",
              category:
                typeof unknownItem.category === "string"
                  ? unknownItem.category
                  : "ไม่ระบุ",
              size:
                typeof unknownItem.size === "string" ? unknownItem.size : "",
              unit:
                typeof unknownItem.unit === "string"
                  ? unknownItem.unit
                  : "ชิ้น",
              barcode: unknownItem.barcode,
              quantity:
                typeof unknownItem.quantity === "number"
                  ? unknownItem.quantity
                  : 0,
              lastUpdated:
                typeof unknownItem.lastUpdated === "string"
                  ? unknownItem.lastUpdated
                  : new Date().toISOString(),
              barcodeType: ["cs", "dsp", "ea"].includes(
                unknownItem.barcodeType as string
              )
                ? (unknownItem.barcodeType as "cs" | "dsp" | "ea")
                : "ea",
            };

            // Migrate the converted legacy item
            return migrateOldInventoryItem(
              legacyItem,
              legacyItem.barcodeType || "ea"
            );
          }

          console.warn("⚠️ Skipping unrecognizable data format:", unknownItem);
          return null;
        })
        .filter((item): item is InventoryItem => item !== null);
    } catch (error) {
      console.error("❌ Migration error:", error);
      return [];
    }
  };

  // ✅ Load inventory on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // ลองโหลดข้อมูลใหม่ก่อน
        const newData = loadFromStorage();

        if (newData && newData.length > 0) {
          console.log("📦 Loaded new format data:", newData.length, "items");
          const migratedData = migrateOldData(newData);
          setInventory(migratedData);
        } else {
          // ถ้าไม่มีข้อมูลใหม่ ลองโหลดข้อมูลเก่า
          const oldStorageKey = "fn_inventory_data"; // key เก่า
          const oldDataStr = localStorage.getItem(oldStorageKey);

          if (oldDataStr) {
            console.log("🔄 Found old format data, migrating...");
            const oldData = JSON.parse(oldDataStr);
            const migratedData = migrateOldData(oldData);
            setInventory(migratedData);

            // บันทึกข้อมูลใหม่และลบข้อมูลเก่า
            saveInventory(migratedData);
            localStorage.removeItem(oldStorageKey);
            console.log("✅ Migration completed and old data cleaned up");
          } else {
            console.log("📭 No existing inventory data found");
            setInventory([]);
          }
        }
      } catch (error) {
        console.error("❌ Error loading inventory:", error);
        setError("เกิดข้อผิดพลาดในการโหลดข้อมูลสินค้า");
        setInventory([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [loadFromStorage, saveInventory]);

  // ✅ Calculate summary
  const summary: InventorySummary = useMemo(() => {
    const totalItems = inventory.length;
    const totalProducts = inventory.reduce(
      (total, item) => total + (item.quantity || 0),
      0
    );

    // Latest update time
    const lastUpdate = inventory.reduce((latest, item) => {
      return item.lastUpdated > latest ? item.lastUpdated : latest;
    }, inventory[0]?.lastUpdated || new Date().toISOString());

    // Category distribution
    const categories: Record<string, number> = {};
    inventory.forEach((item) => {
      const category = item.category || "ไม่ระบุ";
      categories[category] = (categories[category] || 0) + 1;
    });

    // Brand distribution
    const brands: Record<string, number> = {};
    inventory.forEach((item) => {
      const brand = item.brand || "ไม่ระบุ";
      brands[brand] = (brands[brand] || 0) + 1;
    });

    // ✅ NEW: Multi-unit quantity breakdown
    let totalCS = 0;
    let totalDSP = 0;
    let totalEA = 0;
    let itemsWithMultipleUnits = 0;

    inventory.forEach((item) => {
      const { cs = 0, dsp = 0, ea = 0 } = item.quantities || {};

      totalCS += cs;
      totalDSP += dsp;
      totalEA += ea;

      // นับ SKU ที่มีมากกว่า 1 หน่วย
      const activeUnits = [cs > 0, dsp > 0, ea > 0].filter(Boolean).length;
      if (activeUnits > 1) {
        itemsWithMultipleUnits++;
      }
    });

    return {
      totalItems,
      totalProducts,
      lastUpdate,
      categories,
      brands,
      quantityBreakdown: {
        totalCS,
        totalDSP,
        totalEA,
        itemsWithMultipleUnits,
      },
    };
  }, [inventory]);

  // ✅ FIXED: Add missing updateItemQuantityDetail method
  const updateItemQuantityDetail = (
    materialCode: string,
    quantityDetail: QuantityDetail
  ): boolean => {
    try {
      setError(null);

      const existingItem = findItemByMaterialCode(materialCode);
      if (!existingItem) {
        setError("ไม่พบสินค้าที่ต้องการแก้ไข");
        return false;
      }

      const updatedItem: InventoryItem = {
        ...existingItem,
        quantities: {
          cs: quantityDetail.cs,
          dsp: quantityDetail.dsp,
          ea: quantityDetail.ea,
        },
        quantityDetail,
        quantity: quantityDetail.cs + quantityDetail.dsp + quantityDetail.ea,
        lastUpdated: new Date().toISOString(),
      };

      const updatedInventory = inventory.map((item) =>
        item.materialCode === materialCode ? updatedItem : item
      );

      setInventory(updatedInventory);
      return saveInventory(updatedInventory);
    } catch (error) {
      console.error("❌ Error updating item quantity detail:", error);
      setError("เกิดข้อผิดพลาดในการแก้ไขจำนวนสินค้า");
      return false;
    }
  };

  // ✅ Clear inventory
  const clearInventory = (): boolean => {
    try {
      setInventory([]);
      return saveInventory([]);
    } catch (error) {
      console.error("❌ Error clearing inventory:", error);
      setError("เกิดข้อผิดพลาดในการล้างข้อมูล");
      return false;
    }
  };

  // ✅ FIXED: Export inventory (return boolean, not void)
  const exportInventory = (): boolean => {
    try {
      // TODO: Implement export logic
      console.log("📤 Export inventory:", inventory);
      return true;
    } catch (error) {
      console.error("❌ Error exporting inventory:", error);
      setError("เกิดข้อผิดพลาดในการ export ข้อมูล");
      return false;
    }
  };

  // ✅ Clear error
  const clearError = () => {
    setError(null);
  };

  // ✅ Reload inventory
  const loadInventory = () => {
    const data = loadFromStorage();
    const migratedData = migrateOldData(data);
    setInventory(migratedData);
  };

  // ✅ Reset inventory state
  const resetInventoryState = (): boolean => {
    try {
      setInventory([]);
      setError(null);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("❌ Error resetting inventory state:", error);
      return false;
    }
  };

  return {
    // State
    inventory,
    isLoading,
    error,
    summary,

    // ✅ NEW: Multi-unit operations (หลัก)
    addOrUpdateMultiUnitItem,
    updateUnitQuantity,
    findItemByMaterialCode,

    // ✅ FIXED: Add the missing method
    updateItemQuantityDetail,

    // ✅ LEGACY: Backward compatibility (จะค่อย ๆ เอาออก)
    addOrUpdateItem,
    updateItemQuantity,
    findItemByBarcode,

    // Core operations
    removeItem,
    clearInventory,
    searchItems,
    exportInventory,

    // Utilities
    clearError,
    loadInventory,
    resetInventoryState,
  };
};
