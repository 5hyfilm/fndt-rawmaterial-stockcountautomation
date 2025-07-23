// ./src/components/activity/config.tsx
import React from "react";
import { Scan, Plus, Edit3, Trash2, Package } from "lucide-react";
import { ActivityType, ActivityConfig, ActivityItem } from "./types";

export const ACTIVITY_CONFIG: Record<ActivityType, ActivityConfig> = {
  scan: {
    icon: <Scan className="text-blue-500" size={16} />,
    color: "text-blue-700",
    bgColor: "bg-blue-50 border-blue-200",
    getText: () => "สแกนสินค้า",
  },
  add: {
    icon: <Plus className="text-green-500" size={16} />,
    color: "text-green-700",
    bgColor: "bg-green-50 border-green-200",
    getText: (activity: ActivityItem) =>
      `เพิ่มเข้า Stock (${activity.quantity || 0} ชิ้น)`,
  },
  update: {
    icon: <Edit3 className="text-orange-500" size={16} />,
    color: "text-orange-700",
    bgColor: "bg-orange-50 border-orange-200",
    getText: (activity: ActivityItem) => {
      if (
        activity.oldQuantity !== undefined &&
        activity.newQuantity !== undefined
      ) {
        return `อัพเดตจำนวน (${activity.oldQuantity} → ${activity.newQuantity})`;
      }
      return `อัพเดตจำนวน (${activity.quantity || 0} ชิ้น)`;
    },
  },
  remove: {
    icon: <Trash2 className="text-red-500" size={16} />,
    color: "text-red-700",
    bgColor: "bg-red-50 border-red-200",
    getText: () => "ลบออกจาก Stock",
  },
};

export const getActivityConfig = (type: ActivityType): ActivityConfig => {
  return (
    ACTIVITY_CONFIG[type] || {
      icon: <Package className="text-gray-500" size={16} />,
      color: "text-gray-700",
      bgColor: "bg-gray-50 border-gray-200",
      getText: () => "กิจกรรม",
    }
  );
};
