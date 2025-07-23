// src/components/activity/ActivityTimeline.tsx - Advanced timeline view
"use client";

import React from "react";
import { ActivityItem } from "./types";
import { ActivityListItem } from "./ActivityListItem";
import { formatTimeFromNow, groupActivitiesByDate } from "./utils";
import { Calendar } from "lucide-react";

interface ActivityTimelineProps {
  activities: ActivityItem[];
  showDateSeparators?: boolean;
  maxItems?: number;
  compact?: boolean;
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
  activities,
  showDateSeparators = true,
  maxItems = 20,
  compact = false,
}) => {
  const groupedActivities = React.useMemo(() => {
    const limited = activities.slice(0, maxItems);
    return showDateSeparators
      ? groupActivitiesByDate(limited)
      : { all: limited };
  }, [activities, maxItems, showDateSeparators]);

  const formatDateGroup = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "วันนี้";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "เมื่อวาน";
    } else {
      return date.toLocaleDateString("th-TH", {
        weekday: "long",
        month: "short",
        day: "numeric",
      });
    }
  };

  if (activities.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500">ไม่มีกิจกรรม</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Object.entries(groupedActivities).map(([dateGroup, groupActivities]) => (
        <div key={dateGroup} className="space-y-2">
          {showDateSeparators && dateGroup !== "all" && (
            <div className="flex items-center gap-3">
              <div className="h-px bg-gray-200 flex-1" />
              <span className="text-sm font-medium text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                {formatDateGroup(dateGroup)}
              </span>
              <div className="h-px bg-gray-200 flex-1" />
            </div>
          )}

          <div className="space-y-2">
            {groupActivities.map((activity) => (
              <div key={activity.id} className="relative">
                {!compact && (
                  <div className="absolute left-4 top-8 bottom-0 w-px bg-gray-200" />
                )}
                <ActivityListItem
                  activity={activity}
                  formatTime={formatTimeFromNow}
                  compact={compact}
                  showBorder={true}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      {activities.length > maxItems && (
        <div className="text-center py-2">
          <span className="text-xs text-gray-500">
            และอีก {activities.length - maxItems} กิจกรรม...
          </span>
        </div>
      )}
    </div>
  );
};
