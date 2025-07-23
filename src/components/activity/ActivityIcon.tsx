// src/components/activity/ActivityIcon.tsx
"use client";

import React from "react";
import { ActivityType } from "./types";
import { getActivityConfig } from "./config";

interface ActivityIconProps {
  type: ActivityType;
  size?: "sm" | "md" | "lg";
}

export const ActivityIcon: React.FC<ActivityIconProps> = ({
  type,
  size = "md",
}) => {
  const config = getActivityConfig(type);

  const sizeClasses = {
    sm: "p-1",
    md: "p-1.5",
    lg: "p-2",
  };

  return (
    <div
      className={`bg-white rounded-full border border-gray-200 shadow-sm ${sizeClasses[size]}`}
    >
      {config.icon}
    </div>
  );
};
