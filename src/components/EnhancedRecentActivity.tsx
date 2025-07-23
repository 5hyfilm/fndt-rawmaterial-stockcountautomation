// src/components/EnhancedRecentActivity.tsx - Version with view toggle
"use client";

import React, { useState } from "react";
import { List, Clock, Calendar } from "lucide-react";
import { InventoryItem } from "../hooks/useInventoryManager";
import {
  ActivityItem,
  ActivityHeader,
  ActivityListItem,
  ActivityTimeline,
  EmptyActivityState,
  formatTimeFromNow,
  createActivityFromInventory,
  createScanActivity,
  sortActivitiesByTime,
  getActivitySummary,
} from "./activity";

interface EnhancedRecentActivityProps {
  inventory: InventoryItem[];
  lastScannedBarcode?: string;
  limit?: number;
  compact?: boolean;
  showHeader?: boolean;
  className?: string;
  allowViewToggle?: boolean; // เปิด/ปิดการสลับ view
  defaultView?: "list" | "timeline";
  showSummary?: boolean; // แสดงสถิติย่อ
}

export const EnhancedRecentActivity: React.FC<EnhancedRecentActivityProps> = ({
  inventory,
  lastScannedBarcode,
  limit = 10,
  compact = false,
  showHeader = true,
  className = "",
  allowViewToggle = true,
  defaultView = "list",
  showSummary = false,
}) => {
  const [viewType, setViewType] = useState<"list" | "timeline">(defaultView);
  const [showDateSeparators, setShowDateSeparators] = useState(true);

  // สร้างรายการกิจกรรมล่าสุด
  const recentActivities = React.useMemo(() => {
    const activities: ActivityItem[] = [];

    // เพิ่มกิจกรรมจาก inventory
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

    return sortActivitiesByTime(activities).slice(0, limit);
  }, [inventory, lastScannedBarcode, limit]);

  // คำนวณสถิติ
  const activitySummary = React.useMemo(() => {
    return getActivitySummary(recentActivities);
  }, [recentActivities]);

  // Component wrapper classes
  const wrapperClasses = `
    bg-white rounded-lg border border-gray-200 
    ${compact ? "p-3" : "p-4"} 
    ${className}
  `.trim();

  // View Toggle Component
  const ViewToggle = () => {
    if (!allowViewToggle || compact) return null;

    return (
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setViewType("list")}
          className={`px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors ${
            viewType === "list"
              ? "bg-white text-fn-green shadow-sm"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <List size={12} />
          รายการ
        </button>
        <button
          onClick={() => setViewType("timeline")}
          className={`px-2 py-1 rounded text-xs flex items-center gap-1 transition-colors ${
            viewType === "timeline"
              ? "bg-white text-fn-green shadow-sm"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <Clock size={12} />
          ไทม์ไลน์
        </button>
      </div>
    );
  };

  // Summary Stats Component
  const SummaryStats = () => {
    if (!showSummary || compact) return null;

    return (
      <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-lg font-bold text-fn-green">
            {activitySummary.today}
          </div>
          <div className="text-xs text-gray-600">วันนี้</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-blue-600">
            {activitySummary.thisWeek}
          </div>
          <div className="text-xs text-gray-600">สัปดาห์นี้</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-purple-600">
            {activitySummary.total}
          </div>
          <div className="text-xs text-gray-600">ทั้งหมด</div>
        </div>
      </div>
    );
  };

  // Empty state
  if (recentActivities.length === 0) {
    return (
      <div className={wrapperClasses}>
        {showHeader && (
          <div className="flex items-center justify-between mb-3">
            <ActivityHeader
              title="กิจกรรมล่าสุด"
              compact={compact}
              showIcon={!allowViewToggle}
            />
            <ViewToggle />
          </div>
        )}
        <EmptyActivityState compact={compact} />
      </div>
    );
  }

  // Main content
  return (
    <div className={wrapperClasses}>
      {showHeader && (
        <div className="flex items-center justify-between mb-3">
          <ActivityHeader
            title="กิจกรรมล่าสุด"
            subtitle={
              compact
                ? undefined
                : viewType === "timeline"
                ? "แสดงในรูปแบบ Timeline"
                : "ประวัติการใช้งานล่าสุด"
            }
            count={recentActivities.length}
            compact={compact}
            showIcon={!allowViewToggle}
          />
          <ViewToggle />
        </div>
      )}

      <SummaryStats />

      {/* Timeline Settings (เฉพาะ timeline view) */}
      {viewType === "timeline" && !compact && (
        <div className="flex items-center justify-end mb-3">
          <label className="flex items-center gap-2 text-xs text-gray-600">
            <input
              type="checkbox"
              checked={showDateSeparators}
              onChange={(e) => setShowDateSeparators(e.target.checked)}
              className="w-3 h-3 text-fn-green rounded"
            />
            <Calendar size={12} />
            แสดงวันที่
          </label>
        </div>
      )}

      {/* Activity Content */}
      {viewType === "timeline" ? (
        <ActivityTimeline
          activities={recentActivities}
          showDateSeparators={showDateSeparators}
          maxItems={limit}
          compact={compact}
        />
      ) : (
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
      )}

      {/* Summary footer */}
      {!compact && inventory.length > limit && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              แสดง {recentActivities.length} จาก {inventory.length} กิจกรรม
            </span>
            {activitySummary.byType && (
              <div className="flex gap-3">
                {Object.entries(activitySummary.byType).map(([type, count]) => (
                  <span key={type} className="capitalize">
                    {type === "add" && "เพิ่ม"}
                    {type === "scan" && "สแกน"}
                    {type === "update" && "แก้ไข"}
                    {type === "remove" && "ลบ"}: {count}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
