// Path: src/hooks/inventory/useInventoryManager.tsx - Cleaned Version (No Legacy Code)
"use client";

import { useState, useEffect, useMemo } from "react";
import {
  InventoryItem,
  InventorySummary,
  UseInventoryManagerReturn,
  QuantityDetail,
  StorageConfig,
} from "../../types/inventory";
import { useInventoryStorage } from "./useInventoryStorage";
import { useInventoryOperations } from "./useInventoryOperations";

const STORAGE_CONFIG: StorageConfig = {
  storageKey: "fn_inventory_data_v2",
  versionKey: "fn_inventory_version_v2",
  currentVersion: "2.0",
};

export const useInventoryManager = (): UseInventoryManagerReturn => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Storage operations
  const { loadInventory: loadFromStorage, saveInventory } =
    useInventoryStorage(STORAGE_CONFIG);

  // ✅ Business operations (ไม่มี legacy methods)
  const {
    addOrUpdateMultiUnitItem,
    updateUnitQuantity,
    findItemByMaterialCode,
    findItemByBarcode,
    removeItem,
    searchItems,
  } = useInventoryOperations({
    inventory,
    setInventory,
    saveInventory,
    setError,
  });

  // ✅ Load inventory on mount (ไม่มี migration logic)
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // ✅ โหลดข้อมูลใหม่เท่านั้น (ไม่ต้อง migrate)
        const data = loadFromStorage();

        if (data && data.length > 0) {
          console.log("📦 Loaded inventory data:", data.length, "items");
          setInventory(data);
        } else {
          console.log("📭 No existing inventory data found");
          setInventory([]);
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
  }, [loadFromStorage]);

  // ✅ Calculate summary (ไม่มี legacy fallback)
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

    // ✅ Multi-unit quantity breakdown (ใช้ quantities โดยตรง)
    let totalCS = 0;
    let totalDSP = 0;
    let totalEA = 0;
    let itemsWithMultipleUnits = 0;

    inventory.forEach((item) => {
      const { cs = 0, dsp = 0, ea = 0 } = item.quantities;

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

  // ✅ Update item quantity detail
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

  // ✅ Export inventory
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

  // ✅ Reload inventory (ไม่มี migration)
  const loadInventory = () => {
    const data = loadFromStorage();
    setInventory(data);
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
    // ✅ State
    inventory,
    isLoading,
    error,
    summary,

    // ✅ Core multi-unit operations
    addOrUpdateMultiUnitItem,
    updateUnitQuantity,
    updateItemQuantityDetail,

    // ✅ Search and find operations
    findItemByMaterialCode,
    findItemByBarcode,
    searchItems,

    // ✅ Core operations
    removeItem,
    clearInventory,
    exportInventory,
    resetInventoryState,

    // ✅ Utilities
    clearError,
    loadInventory,
  };
};
