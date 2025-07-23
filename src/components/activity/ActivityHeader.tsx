// src/components/activity/ActivityHeader.tsx
"use client";

import React from "react";
import { Clock } from "lucide-react";

interface ActivityHeaderProps {
  title?: string;
  subtitle?: string;
  count?: number;
  compact?: boolean;
  showIcon?: boolean;
}

export const ActivityHeader: React.FC<ActivityHeaderProps> = ({
  title = "กิจกรรมล่าสุด",
  subtitle,
  count,
  compact = false,
  showIcon = true,
}) => {
  if (compact) {
    return (
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {showIcon && <Clock className="text-gray-500" size={14} />}
          <span className="text-sm font-medium text-gray-700">{title}</span>
        </div>
        {count !== undefined && (
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {count}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 mb-3">
      {showIcon && <Clock className="text-gray-500" size={16} />}
      <div className="flex-1">
        <h3 className="text-sm font-medium text-gray-700">{title}</h3>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
      {count !== undefined && (
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {count} รายการ
        </span>
      )}
    </div>
  );
};
