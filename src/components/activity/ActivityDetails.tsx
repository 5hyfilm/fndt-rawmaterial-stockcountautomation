// src/components/activity/ActivityDetails.tsx
"use client";

import React from "react";
import { ActivityItem } from "./types";
import { getActivityConfig } from "./config";

interface ActivityDetailsProps {
  activity: ActivityItem;
  formatTime: (timestamp: string) => string;
  compact?: boolean;
}

export const ActivityDetails: React.FC<ActivityDetailsProps> = ({
  activity,
  formatTime,
  compact = false,
}) => {
  const config = getActivityConfig(activity.type);

  if (compact) {
    return (
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {activity.productName}
        </p>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className={config.color}>{config.getText(activity)}</span>
          <span>•</span>
          <span>{formatTime(activity.timestamp)}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm font-medium text-gray-900 truncate">
          {activity.productName}
        </p>
        <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
          {formatTime(activity.timestamp)}
        </span>
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
        <span className={config.color}>{config.getText(activity)}</span>
        <span>•</span>
        <span className="font-medium">{activity.brand}</span>
        {activity.category && (
          <>
            <span>•</span>
            <span>{activity.category}</span>
          </>
        )}
      </div>

      <div className="mt-1">
        <code className="text-xs text-gray-500 bg-white/70 px-1 py-0.5 rounded">
          {activity.barcode}
        </code>
      </div>
    </div>
  );
};
