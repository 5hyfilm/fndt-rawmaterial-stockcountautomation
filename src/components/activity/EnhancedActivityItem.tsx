// ./src/components/activity/EnhancedActivityItem.tsx - แก้ไข renderMetadata function
"use client";

import React from "react";
import {
  Package2,
  Archive,
  Hash,
  Plus,
  Edit3,
  Trash2,
  Scan,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { ActivityItem } from "./types";

interface EnhancedActivityItemProps {
  activity: ActivityItem;
  formatTime: (timestamp: string) => string;
  compact?: boolean;
  showDetails?: boolean;
}

// ✅ Enhanced activity configuration
const ACTIVITY_CONFIG = {
  add: {
    icon: Plus,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    label: "เพิ่ม",
  },
  scan: {
    icon: Scan,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    label: "สแกน",
  },
  update: {
    icon: Edit3,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    label: "แก้ไข",
  },
  remove: {
    icon: Trash2,
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    label: "ลบ",
  },
};

const UNIT_CONFIG = {
  ea: {
    label: "ชิ้น",
    shortLabel: "EA",
    icon: Package2,
    color: "bg-blue-100 text-blue-700",
  },
  dsp: {
    label: "แพ็ค",
    shortLabel: "DSP",
    icon: Package2,
    color: "bg-green-100 text-green-700",
  },
  cs: {
    label: "ลัง",
    shortLabel: "CS",
    icon: Archive,
    color: "bg-purple-100 text-purple-700",
  },
};

export const EnhancedActivityItem: React.FC<EnhancedActivityItemProps> = ({
  activity,
  formatTime,
  compact = false,
  showDetails = true,
}) => {
  const config = ACTIVITY_CONFIG[activity.type];
  const Icon = config.icon;

  // ✅ Enhanced activity text generation
  const getActivityText = (): string => {
    const { type, productName, quantity, oldQuantity, newQuantity } = activity;

    switch (type) {
      case "add":
        if (quantity && quantity > 1) {
          return `เพิ่ม ${quantity} รายการของ ${productName}`;
        }
        return `เพิ่ม ${productName}`;

      case "scan":
        return `สแกน ${productName}`;

      case "update":
        if (oldQuantity !== undefined && newQuantity !== undefined) {
          const direction = newQuantity > oldQuantity ? "เพิ่ม" : "ลด";
          const diff = Math.abs(newQuantity - oldQuantity);
          return `${direction} ${productName} จำนวน ${diff} (${oldQuantity} → ${newQuantity})`;
        }
        return `แก้ไข ${productName}`;

      case "remove":
        return `ลบ ${productName}`;

      default:
        return `${config.label} ${productName}`;
    }
  };

  // ✅ Enhanced quantity display for activities
  const renderQuantityInfo = () => {
    // ✅ FIX: เพิ่ม fallback สำหรับ barcodeType ที่อาจจะ undefined
    const { quantity, oldQuantity, newQuantity, barcodeType = "ea" } = activity;

    if (!showDetails) return null;

    // Get unit configuration
    const unitConfig = barcodeType
      ? UNIT_CONFIG[barcodeType as keyof typeof UNIT_CONFIG]
      : UNIT_CONFIG.ea;

    if (
      activity.type === "update" &&
      oldQuantity !== undefined &&
      newQuantity !== undefined
    ) {
      const isIncrease = newQuantity > oldQuantity;
      const diff = Math.abs(newQuantity - oldQuantity);
      const TrendIcon = isIncrease ? TrendingUp : TrendingDown;
      const trendColor = isIncrease ? "text-green-600" : "text-red-600";

      return (
        <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
          <span
            className={`text-xs px-2 py-1 rounded ${unitConfig.color} font-medium`}
          >
            {unitConfig.shortLabel}
          </span>
          <div className="flex items-center gap-1">
            <span>{oldQuantity}</span>
            <TrendIcon size={12} className={trendColor} />
            <span>{newQuantity}</span>
            <span className="text-gray-400">({diff})</span>
          </div>
        </div>
      );
    }

    if (quantity !== undefined && quantity > 0) {
      return (
        <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
          <span
            className={`text-xs px-2 py-1 rounded ${unitConfig.color} font-medium`}
          >
            {unitConfig.shortLabel}
          </span>
          <span>
            {quantity} {unitConfig.label}
          </span>
        </div>
      );
    }

    return null;
  };

  // ✅ Enhanced barcode info display
  const renderBarcodeInfo = () => {
    if (!showDetails || !activity.barcode) return null;

    return (
      <div className="text-xs text-gray-500 font-mono mt-1">
        {activity.barcode}
      </div>
    );
  };

  // ✅ Enhanced metadata display - FIX: ระบุ type ให้ชัดเจน
  const renderMetadata = () => {
    if (!showDetails) return null;

    // ✅ FIX: ระบุ type ของ metadata เป็น string[] อย่างชัดเจน
    const metadata: string[] = [];

    if (activity.brand) {
      metadata.push(activity.brand);
    }

    if (activity.category) {
      metadata.push(activity.category);
    }

    if (metadata.length === 0) return null;

    return (
      <div className="text-xs text-gray-500 mt-1">{metadata.join(" • ")}</div>
    );
  };

  if (compact) {
    // ✅ Compact view for limited space
    return (
      <div
        className={`flex items-center gap-3 p-2 rounded-lg ${config.bgColor} ${config.borderColor} border`}
      >
        <div
          className={`w-6 h-6 rounded-full ${config.bgColor} flex items-center justify-center`}
        >
          <Icon size={12} className={config.color} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-900 truncate">{getActivityText()}</p>
          <p className="text-xs text-gray-500">
            {formatTime(activity.timestamp)}
          </p>
        </div>

        {renderQuantityInfo()}
      </div>
    );
  }

  // ✅ Full view with all details
  return (
    <div
      className={`p-4 rounded-lg ${config.bgColor} ${config.borderColor} border transition-all hover:shadow-sm`}
    >
      <div className="flex items-start gap-3">
        {/* Activity Icon */}
        <div
          className={`w-8 h-8 rounded-full ${config.bgColor} flex items-center justify-center mt-1`}
        >
          <Icon size={16} className={config.color} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Main Activity Text */}
          <div className="flex items-start justify-between">
            <p className="text-sm font-medium text-gray-900">
              {getActivityText()}
            </p>
            <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
              {formatTime(activity.timestamp)}
            </span>
          </div>

          {/* Product Details */}
          <div className="mt-2 space-y-1">
            {renderQuantityInfo()}
            {renderBarcodeInfo()}
            {renderMetadata()}
          </div>
        </div>
      </div>
    </div>
  );
};

// ✅ Enhanced Recent Activity Component
interface EnhancedRecentActivityProps {
  activities: ActivityItem[];
  limit?: number;
  compact?: boolean;
  showHeader?: boolean;
  title?: string;
}

export const EnhancedRecentActivity: React.FC<EnhancedRecentActivityProps> = ({
  activities,
  limit = 5,
  compact = false,
  showHeader = true,
  title = "กิจกรรมล่าสุด",
}) => {
  const formatTimeFromNow = (timestamp: string): string => {
    try {
      const now = new Date();
      const time = new Date(timestamp);
      const diffMs = now.getTime() - time.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);

      if (diffMins < 1) return "เมื่อสักครู่";
      if (diffMins < 60) return `${diffMins} นาทีที่แล้ว`;
      if (diffHours < 24) return `${diffHours} ชั่วโมงที่แล้ว`;

      return time.toLocaleDateString("th-TH", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "เวลาไม่ถูกต้อง";
    }
  };

  const displayActivities = activities.slice(0, limit);

  if (displayActivities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Hash size={24} className="mx-auto mb-2 opacity-50" />
        <p className="text-sm">ไม่มีกิจกรรมล่าสุด</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {showHeader && (
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <span className="text-xs text-gray-500">
            {displayActivities.length} รายการ
          </span>
        </div>
      )}

      <div className={`space-y-${compact ? "2" : "3"}`}>
        {displayActivities.map((activity, index) => (
          <EnhancedActivityItem
            key={`${activity.id}-${index}`}
            activity={activity}
            formatTime={formatTimeFromNow}
            compact={compact}
            showDetails={!compact}
          />
        ))}
      </div>

      {activities.length > limit && (
        <div className="text-center pt-2">
          <p className="text-xs text-gray-500">
            และอีก {activities.length - limit} กิจกรรม
          </p>
        </div>
      )}
    </div>
  );
};
