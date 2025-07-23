// src/components/RecentActivity.tsx - Refactored with sub-components
"use client";

import React from "react";
import { InventoryItem } from "../hooks/useInventoryManager";
import {
  ActivityItem,
  ActivityHeader,
  ActivityListItem,
  EmptyActivityState,
  formatTimeFromNow,
  createActivityFromInventory,
  createScanActivity,
  sortActivitiesByTime,
} from "./activity";

interface RecentActivityProps {
  inventory: InventoryItem[];
  lastScannedBarcode?: string;
  limit?: number;
  compact?: boolean;
  showHeader?: boolean;
  className?: string;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({
  inventory,
  lastScannedBarcode,
  limit = 5,
  compact = false,
  showHeader = true,
  className = "",
}) => {
  // สร้างรายการกิจกรรมล่าสุด
  const recentActivities = React.useMemo(() => {
    const activities: ActivityItem[] = [];

    // เพิ่มกิจกรรมจาก inventory (เรียงตามเวลา)
    const sortedInventory = [...inventory]
      .sort(
        (a, b) =>
          new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      )
      .slice(0, limit);

    sortedInventory.forEach((item) => {
      activities.push(createActivityFromInventory(item, "add"));
    });

    // เพิ่มกิจกรรมการสแกนล่าสุด
    if (lastScannedBarcode) {
      const scannedItem = inventory.find(
        (item) => item.barcode === lastScannedBarcode
      );

      if (scannedItem) {
        activities.unshift(createScanActivity(lastScannedBarcode, scannedItem));
      }
    }

    // เรียงตามเวลาและจำกัดจำนวน
    return sortActivitiesByTime(activities).slice(0, limit);
  }, [inventory, lastScannedBarcode, limit]);

  // Component wrapper classes
  const wrapperClasses = `
    bg-white rounded-lg border border-gray-200 
    ${compact ? "p-3" : "p-4"} 
    ${className}
  `.trim();

  // Empty state
  if (recentActivities.length === 0) {
    return (
      <div className={wrapperClasses}>
        {showHeader && (
          <ActivityHeader title="กิจกรรมล่าสุด" compact={compact} />
        )}
        <EmptyActivityState compact={compact} />
      </div>
    );
  }

  // Main content
  return (
    <div className={wrapperClasses}>
      {showHeader && (
        <ActivityHeader
          title="กิจกรรมล่าสุด"
          subtitle={compact ? undefined : "ประวัติการใช้งานล่าสุด"}
          count={recentActivities.length}
          compact={compact}
        />
      )}

      <div className={compact ? "space-y-2" : "space-y-3"}>
        {recentActivities.map((activity) => (
          <ActivityListItem
            key={activity.id}
            activity={activity}
            formatTime={formatTimeFromNow}
            compact={compact}
            showBorder={!compact}
          />
        ))}
      </div>

      {/* Summary footer */}
      {!compact && inventory.length > limit && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            แสดง {recentActivities.length} จาก {inventory.length} กิจกรรม
          </p>
        </div>
      )}
    </div>
  );
};
