// src/components/activity/index.ts
// Export all activity components and utilities
export { ActivityIcon } from "./ActivityIcon";
export { ActivityDetails } from "./ActivityDetails";
export { ActivityListItem } from "./ActivityListItem";
export { ActivityHeader } from "./ActivityHeader";
export { EmptyActivityState } from "./EmptyActivityState";
export { ActivityTimeline } from "./ActivityTimeline";

// Enhanced component (optional)
export { EnhancedRecentActivity } from "../EnhancedRecentActivity";

// Export types
export type {
  ActivityItem,
  ActivityItemProps,
  RecentActivityProps,
  ActivityConfig,
  ActivityType,
} from "./types";

// Export configuration
export { ACTIVITY_CONFIG, getActivityConfig } from "./config";

// Export utilities
export {
  formatTimeFromNow,
  createActivityFromInventory,
  createScanActivity,
  sortActivitiesByTime,
  filterActivitiesByType,
  getUniqueActivityTypes,
  groupActivitiesByDate,
  getActivitySummary,
} from "./utils";
