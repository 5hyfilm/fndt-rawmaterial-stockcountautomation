// Path: src/hooks/inventory/useInventoryStorage.tsx
"use client";

import { useState, useCallback } from "react";
import { InventoryItem, StorageConfig } from "../../types/inventory";

const DEFAULT_CONFIG: StorageConfig = {
  storageKey: "fn_inventory_data",
  versionKey: "fn_inventory_version",
  currentVersion: "1.1",
};

export const useInventoryStorage = (config: StorageConfig = DEFAULT_CONFIG) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load inventory data from localStorage
  const loadInventory = useCallback((): InventoryItem[] => {
    try {
      setIsLoading(true);
      setError(null);

      // Check version compatibility
      const savedVersion = localStorage.getItem(config.versionKey);
      if (savedVersion && savedVersion !== config.currentVersion) {
        console.warn("🔄 Inventory version mismatch, clearing old data");
        localStorage.removeItem(config.storageKey);
        localStorage.setItem(config.versionKey, config.currentVersion);
      }

      const savedData = localStorage.getItem(config.storageKey);

      if (savedData) {
        const parsedData: InventoryItem[] = JSON.parse(savedData);

        // Validate data structure
        const validatedData = parsedData.filter(
          (item) =>
            item.id &&
            item.barcode &&
            item.productName &&
            typeof item.quantity === "number"
        );

        console.log("📦 Loaded inventory:", validatedData.length, "items");
        return validatedData;
      } else {
        console.log("📦 No saved inventory found, starting fresh");
        return [];
      }
    } catch (error: unknown) {
      console.error("❌ Error loading inventory:", error);
      setError("ไม่สามารถโหลดข้อมูล inventory ได้");
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [config]);

  // Save inventory data to localStorage
  const saveInventory = useCallback(
    (data: InventoryItem[]): boolean => {
      try {
        localStorage.setItem(config.storageKey, JSON.stringify(data));
        localStorage.setItem(config.versionKey, config.currentVersion);
        console.log("💾 Saved inventory:", data.length, "items");
        return true;
      } catch (error: unknown) {
        console.error("❌ Error saving inventory:", error);
        setError("ไม่สามารถบันทึกข้อมูล inventory ได้");
        return false;
      }
    },
    [config]
  );

  // Clear all inventory data
  const clearInventory = useCallback((): boolean => {
    try {
      localStorage.removeItem(config.storageKey);
      localStorage.removeItem(config.versionKey);
      console.log("🗑️ Cleared inventory data");
      return true;
    } catch (error: unknown) {
      console.error("❌ Error clearing inventory:", error);
      setError("ไม่สามารถลบข้อมูล inventory ได้");
      return false;
    }
  }, [config]);

  // Get storage stats
  const getStorageStats = useCallback(() => {
    try {
      const savedData = localStorage.getItem(config.storageKey);
      const dataSize = savedData ? new Blob([savedData]).size : 0;
      const version = localStorage.getItem(config.versionKey);

      return {
        hasData: !!savedData,
        dataSize,
        version,
        itemCount: savedData ? JSON.parse(savedData).length : 0,
      };
    } catch (error: unknown) {
      console.error("❌ Error getting storage stats:", error);
      return {
        hasData: false,
        dataSize: 0,
        version: null,
        itemCount: 0,
      };
    }
  }, [config]);

  return {
    // Core operations
    loadInventory,
    saveInventory,
    clearInventory,

    // State
    isLoading,
    error,
    setError,

    // Utilities
    getStorageStats,
  };
};
