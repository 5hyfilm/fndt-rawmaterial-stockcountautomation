// Path: src/hooks/inventory/useInventorySummary.tsx - Cleaned Version (No Legacy Code)
"use client";

import { useMemo } from "react";
import { InventoryItem, InventorySummary } from "../../types/inventory";

interface UseInventorySummaryProps {
  inventory: InventoryItem[];
}

export const useInventorySummary = ({
  inventory,
}: UseInventorySummaryProps) => {
  // ✅ Modern summary calculations (ไม่มี legacy fallback)
  const summary: InventorySummary = useMemo(() => {
    if (inventory.length === 0) {
      return {
        totalItems: 0,
        totalProducts: 0,
        lastUpdate: "",
        categories: {},
        brands: {},
        quantityBreakdown: {
          totalEA: 0,
          totalDSP: 0,
          totalCS: 0,
          itemsWithMultipleUnits: 0,
        },
      };
    }

    // ✅ Basic counts
    const totalItems = inventory.length;
    const uniqueBarcodes = new Set(inventory.map((item) => item.barcode));
    const totalProducts = uniqueBarcodes.size;

    // ✅ Find most recent update
    const lastUpdate = inventory.reduce((latest, item) => {
      const itemDate = new Date(item.lastUpdated);
      const latestDate = new Date(latest);
      return itemDate > latestDate ? item.lastUpdated : latest;
    }, inventory[0]?.lastUpdated || "");

    // ✅ Category distribution
    const categories: Record<string, number> = {};
    inventory.forEach((item) => {
      const category = item.category || "ไม่ระบุ";
      categories[category] = (categories[category] || 0) + 1;
    });

    // ✅ Brand distribution
    const brands: Record<string, number> = {};
    inventory.forEach((item) => {
      const brand = item.brand || "ไม่ระบุ";
      brands[brand] = (brands[brand] || 0) + 1;
    });

    // ✅ Modern quantity breakdown (ใช้ quantities โดยตรง)
    let totalEA = 0;
    let totalDSP = 0;
    let totalCS = 0;
    let itemsWithMultipleUnits = 0;

    inventory.forEach((item) => {
      // ✅ ใช้ quantities object โดยตรง (ไม่มี legacy fallback)
      const { cs = 0, dsp = 0, ea = 0 } = item.quantities;

      totalCS += cs;
      totalDSP += dsp;
      totalEA += ea;

      // ✅ นับจำนวน SKU ที่มีมากกว่า 1 หน่วย
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
        totalEA,
        totalDSP,
        totalCS,
        itemsWithMultipleUnits,
      },
    };
  }, [inventory]);

  // ✅ Additional computed values
  const computedStats = useMemo(() => {
    const { quantityBreakdown } = summary;

    return {
      // Percentage breakdowns
      multiUnitCoverage:
        summary.totalItems > 0
          ? Math.round(
              ((quantityBreakdown?.itemsWithMultipleUnits || 0) /
                summary.totalItems) *
                100
            )
          : 0,

      // Quantity distribution percentages
      quantityDistribution: {
        ea: quantityBreakdown?.totalEA || 0,
        dsp: quantityBreakdown?.totalDSP || 0,
        cs: quantityBreakdown?.totalCS || 0,
      },

      // Category insights
      topCategory:
        Object.entries(summary.categories).sort(
          ([, a], [, b]) => b - a
        )[0]?.[0] || "",
      topBrand:
        Object.entries(summary.brands).sort(([, a], [, b]) => b - a)[0]?.[0] ||
        "",

      // Data quality metrics
      dataQuality: {
        hasMultipleUnits: quantityBreakdown?.itemsWithMultipleUnits || 0,
        hasSingleUnit:
          summary.totalItems - (quantityBreakdown?.itemsWithMultipleUnits || 0),
        avgUnitsPerItem:
          summary.totalItems > 0
            ? Math.round(
                (((quantityBreakdown?.totalCS || 0) +
                  (quantityBreakdown?.totalDSP || 0) +
                  (quantityBreakdown?.totalEA || 0)) /
                  summary.totalItems) *
                  100
              ) / 100
            : 0,
      },
    };
  }, [summary]);

  // ✅ Helper functions for display
  const getQuantityByType = (type: "ea" | "dsp" | "cs"): number => {
    return summary.quantityBreakdown?.[`total${type.toUpperCase()}`] || 0;
  };

  const getCategoryPercentage = (category: string): number => {
    const count = summary.categories[category] || 0;
    return summary.totalItems > 0
      ? Math.round((count / summary.totalItems) * 100)
      : 0;
  };

  const getBrandPercentage = (brand: string): number => {
    const count = summary.brands[brand] || 0;
    return summary.totalItems > 0
      ? Math.round((count / summary.totalItems) * 100)
      : 0;
  };

  // ✅ Generate summary text for display
  const getSummaryText = (): string => {
    const { totalItems, totalProducts, quantityBreakdown } = summary;
    const { multiUnitCoverage } = computedStats;

    let text = `รวม ${totalItems} รายการ จาก ${totalProducts} สินค้า`;

    if (quantityBreakdown && quantityBreakdown.itemsWithMultipleUnits > 0) {
      text += ` (${multiUnitCoverage}% มีหลายหน่วย)`;
    }

    return text;
  };

  // ✅ Generate detailed breakdown text
  const getDetailedBreakdown = (): string[] => {
    const breakdown: string[] = [];
    const { quantityBreakdown } = summary;

    if (!quantityBreakdown) return breakdown;

    if (quantityBreakdown.totalEA > 0) {
      breakdown.push(`${quantityBreakdown.totalEA} ชิ้น (EA)`);
    }

    if (quantityBreakdown.totalDSP > 0) {
      breakdown.push(`${quantityBreakdown.totalDSP} แพ็ค (DSP)`);
    }

    if (quantityBreakdown.totalCS > 0) {
      breakdown.push(`${quantityBreakdown.totalCS} ลัง (CS)`);
    }

    if (quantityBreakdown.itemsWithMultipleUnits > 0) {
      breakdown.push(
        `${quantityBreakdown.itemsWithMultipleUnits} รายการมีหลายหน่วย`
      );
    }

    return breakdown;
  };

  // ✅ Modern filter helpers (ใช้ quantities โดยตรง)
  const getItemsByType = (type: "ea" | "dsp" | "cs"): InventoryItem[] => {
    return inventory.filter((item) => {
      return (item.quantities[type] || 0) > 0;
    });
  };

  const getMultiUnitItems = (): InventoryItem[] => {
    return inventory.filter((item) => {
      const { cs = 0, dsp = 0, ea = 0 } = item.quantities;
      const activeUnits = [cs > 0, dsp > 0, ea > 0].filter(Boolean).length;
      return activeUnits > 1;
    });
  };

  const getSingleUnitItems = (): InventoryItem[] => {
    return inventory.filter((item) => {
      const { cs = 0, dsp = 0, ea = 0 } = item.quantities;
      const activeUnits = [cs > 0, dsp > 0, ea > 0].filter(Boolean).length;
      return activeUnits === 1;
    });
  };

  return {
    // Core summary data
    summary,
    computedStats,

    // Helper functions
    getQuantityByType,
    getCategoryPercentage,
    getBrandPercentage,
    getSummaryText,
    getDetailedBreakdown,

    // Filter functions
    getItemsByType,
    getMultiUnitItems,
    getSingleUnitItems,
  };
};
