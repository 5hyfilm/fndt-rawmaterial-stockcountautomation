// Path: src/components/inventory/UnitTypeFilter.tsx - Filter by Unit Types (EA, DSP, CS)
"use client";

import React from "react";
import { Package2, Package, Archive, Grid3X3 } from "lucide-react";
import { InventoryItem } from "../../types/inventory";

export type UnitFilterType = "all" | "ea" | "dsp" | "cs" | "multi";

interface UnitTypeFilterProps {
  selectedUnitType: UnitFilterType;
  onUnitTypeChange: (unitType: UnitFilterType) => void;
  inventory: InventoryItem[];
  className?: string;
}

// ✅ Unit filter configuration
const UNIT_FILTER_CONFIG = {
  all: {
    label: "ทั้งหมด",
    shortLabel: "ALL",
    icon: Grid3X3,
    color: "bg-gray-100 text-gray-700 border-gray-200",
    activeColor: "bg-gray-600 text-white border-gray-600",
    description: "แสดงสินค้าทุกประเภท",
  },
  ea: {
    label: "ชิ้น",
    shortLabel: "EA",
    icon: Package2,
    color: "bg-blue-100 text-blue-700 border-blue-200",
    activeColor: "bg-blue-600 text-white border-blue-600",
    description: "สินค้าขายเป็นชิ้น",
  },
  dsp: {
    label: "แพ็ค",
    shortLabel: "DSP",
    icon: Package,
    color: "bg-green-100 text-green-700 border-green-200",
    activeColor: "bg-green-600 text-white border-green-600",
    description: "สินค้าขายเป็นแพ็ค",
  },
  cs: {
    label: "ลัง",
    shortLabel: "CS",
    icon: Archive,
    color: "bg-purple-100 text-purple-700 border-purple-200",
    activeColor: "bg-purple-600 text-white border-purple-600",
    description: "สินค้าขายเป็นลัง",
  },
  multi: {
    label: "หลายหน่วย",
    shortLabel: "MULTI",
    icon: Grid3X3,
    color: "bg-orange-50 text-orange-700 border-orange-200",
    activeColor: "bg-orange-600 text-white border-orange-600",
    description: "สินค้าที่มีหลายหน่วย",
  },
};

export const UnitTypeFilter: React.FC<UnitTypeFilterProps> = ({
  selectedUnitType,
  onUnitTypeChange,
  inventory,
  className = "",
}) => {
  // ✅ Calculate counts for each unit type
  const getUnitTypeCounts = () => {
    const counts = {
      all: inventory.length,
      ea: 0,
      dsp: 0,
      cs: 0,
      multi: 0,
    };

    inventory.forEach((item) => {
      const activeUnits = getItemActiveUnits(item);

      if (activeUnits.length > 1) {
        counts.multi++;
      } else if (activeUnits.length === 1) {
        const unitType = activeUnits[0];
        counts[unitType]++;
      } else {
        // Fallback for legacy items without quantities
        counts.ea++;
      }
    });

    return counts;
  };

  // ✅ Helper function to get active units for an item
  const getItemActiveUnits = (
    item: InventoryItem
  ): Array<"ea" | "dsp" | "cs"> => {
    if (!item.quantities) return ["ea"]; // Fallback for legacy items

    return (["cs", "dsp", "ea"] as const).filter(
      (unit) => (item.quantities?.[unit] || 0) > 0
    );
  };

  const counts = getUnitTypeCounts();

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">
          กรองตามประเภทหน่วย
        </h3>
        {selectedUnitType !== "all" && (
          <button
            onClick={() => onUnitTypeChange("all")}
            className="text-xs text-gray-500 hover:text-gray-700 underline"
          >
            ล้างตัวกรอง
          </button>
        )}
      </div>

      {/* Filter Buttons - Mobile: Horizontal scroll, Desktop: Grid */}
      <div className="flex gap-2 overflow-x-auto pb-2 md:grid md:grid-cols-5 md:overflow-visible md:pb-0">
        {(Object.keys(UNIT_FILTER_CONFIG) as UnitFilterType[]).map(
          (unitType) => {
            const config = UNIT_FILTER_CONFIG[unitType];
            const count = counts[unitType];
            const isActive = selectedUnitType === unitType;
            const IconComponent = config.icon;

            return (
              <button
                key={unitType}
                onClick={() => onUnitTypeChange(unitType)}
                className={`
                flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all
                hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2
                ${isActive ? config.activeColor : config.color}
                ${isActive ? "shadow-md" : "hover:shadow-sm"}
                min-w-[80px] md:min-w-0
              `}
                title={config.description}
              >
                {/* Icon */}
                <IconComponent
                  size={20}
                  className={isActive ? "text-white" : ""}
                />

                {/* Label */}
                <div className="text-center">
                  <div
                    className={`text-xs font-medium ${
                      isActive ? "text-white" : ""
                    }`}
                  >
                    {config.shortLabel}
                  </div>
                  <div
                    className={`text-xs font-normal mt-0.5 ${
                      isActive ? "text-white/90" : "text-gray-600"
                    }`}
                  >
                    {config.label}
                  </div>
                </div>

                {/* Count Badge */}
                <div
                  className={`
                text-xs font-bold px-2 py-0.5 rounded-full min-w-[24px]
                ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-gray-200 text-gray-700"
                }
              `}
                >
                  {count}
                </div>
              </button>
            );
          }
        )}
      </div>

      {/* Summary Information */}
      <div className="">
        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="text-center">
            <div className="font-medium text-gray-900">{counts.ea}</div>
            <div className="text-gray-600">ชิ้นเดียว</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-gray-900">{counts.dsp}</div>
            <div className="text-gray-600">แพ็คเดียว</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-gray-900">{counts.cs}</div>
            <div className="text-gray-600">ลังเดียว</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-gray-900">{counts.multi}</div>
            <div className="text-gray-600">หลายหน่วย</div>
          </div>
        </div> */}

        {selectedUnitType !== "all" && (
          <div className="mt-2 pt-2 border-t border-gray-200 text-center">
            <div className="text-xs text-gray-600">
              แสดง{" "}
              <span className="font-medium text-gray-900">
                {counts[selectedUnitType]}
              </span>{" "}
              รายการ จากทั้งหมด{" "}
              <span className="font-medium text-gray-900">{counts.all}</span>{" "}
              รายการ
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ✅ Helper function to filter inventory by unit type
export const filterInventoryByUnitType = (
  inventory: InventoryItem[],
  unitType: UnitFilterType
): InventoryItem[] => {
  if (unitType === "all") return inventory;

  return inventory.filter((item) => {
    const activeUnits = getItemActiveUnits(item);

    switch (unitType) {
      case "ea":
        return activeUnits.length === 1 && activeUnits.includes("ea");
      case "dsp":
        return activeUnits.length === 1 && activeUnits.includes("dsp");
      case "cs":
        return activeUnits.length === 1 && activeUnits.includes("cs");
      case "multi":
        return activeUnits.length > 1;
      default:
        return true;
    }
  });
};

// ✅ Helper function to get active units for an item (exported for reuse)
export const getItemActiveUnits = (
  item: InventoryItem
): Array<"ea" | "dsp" | "cs"> => {
  if (!item.quantities) {
    // Fallback for legacy items - try to determine from existing data
    return ["ea"];
  }

  return (["cs", "dsp", "ea"] as const).filter(
    (unit) => (item.quantities?.[unit] || 0) > 0
  );
};
