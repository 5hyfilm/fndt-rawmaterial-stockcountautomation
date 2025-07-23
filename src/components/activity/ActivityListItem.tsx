// src/components/activity/ActivityListItem.tsx
"use client";

import React from "react";
import { ActivityItemProps } from "./types";
import { getActivityConfig } from "./config";
import { ActivityIcon } from "./ActivityIcon";
import { ActivityDetails } from "./ActivityDetails";

interface ActivityListItemProps extends ActivityItemProps {
  compact?: boolean;
  showBorder?: boolean;
}

export const ActivityListItem: React.FC<ActivityListItemProps> = ({
  activity,
  formatTime,
  compact = false,
  showBorder = true,
}) => {
  const config = getActivityConfig(activity.type);

  return (
    <div
      className={`transition-colors hover:bg-gray-50 ${
        showBorder ? `p-3 rounded-lg border ${config.bgColor}` : "p-2"
      }`}
    >
      <div className="flex items-start gap-3">
        <ActivityIcon type={activity.type} size={compact ? "sm" : "md"} />
        <ActivityDetails
          activity={activity}
          formatTime={formatTime}
          compact={compact}
        />
      </div>
    </div>
  );
};
