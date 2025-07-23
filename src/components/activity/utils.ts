// ./src/components/activity/utils.ts
import { ActivityItem } from "./types";
import { InventoryItem } from "../../hooks/inventory/types";
import { Product } from "../../types/product";

/**
 * Format timestamp to human readable relative time
 */
export const formatTimeFromNow = (timestamp: string): string => {
  try {
    const now = new Date();
    const time = new Date(timestamp);

    if (isNaN(time.getTime())) {
      return "เวลาไม่ถูกต้อง";
    }

    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "เมื่อสักครู่";
    if (diffMins < 60) return `${diffMins} นาทีที่แล้ว`;
    if (diffHours < 24) return `${diffHours} ชั่วโมงที่แล้ว`;
    if (diffDays < 7) return `${diffDays} วันที่แล้ว`;

    return time.toLocaleDateString("th-TH", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.error("Error formatting time:", error);
    return "เวลาไม่ถูกต้อง";
  }
};

/**
 * Create activity item from inventory data
 * ✅ รองรับ barcodeType และ quantityDetail จาก Phase 2
 */
export const createActivityFromInventory = (
  item: InventoryItem,
  type: ActivityItem["type"] = "add"
): ActivityItem => {
  return {
    id: item.id || `${type}_${item.barcode}_${Date.now()}`,
    type,
    productName: item.productName || "ไม่ระบุชื่อ",
    barcode: item.barcode || "",
    quantity: item.quantity || 0,
    timestamp: item.lastUpdated || new Date().toISOString(),
    brand: item.brand || "ไม่ระบุแบรนด์",
    category: item.category,
    // ✅ เพิ่ม barcodeType จาก InventoryItem
    barcodeType: item.barcodeType || "ea",
  };
};

/**
 * Type guard to check if data is InventoryItem
 */
const isInventoryItem = (
  data: Product | InventoryItem
): data is InventoryItem => {
  return "productName" in data && "lastUpdated" in data;
};

/**
 * Create scan activity from barcode
 * ✅ รองรับ barcodeType detection จากสินค้า
 */
export const createScanActivity = (
  barcode: string,
  productData?: Product | InventoryItem
): ActivityItem => {
  if (!productData) {
    return {
      id: `scan_${barcode}_${Date.now()}`,
      type: "scan",
      productName: "สินค้าที่สแกน",
      barcode,
      timestamp: new Date().toISOString(),
      brand: "ไม่ระบุแบรนด์",
      category: undefined,
      // ✅ ใช้ default เป็น "ea" สำหรับสินค้าที่ไม่รู้จัก
      barcodeType: "ea",
    };
  }

  // Handle different property names between Product and InventoryItem
  const productName = isInventoryItem(productData)
    ? productData.productName
    : productData.name;

  // ✅ ดึง barcodeType จาก InventoryItem ถ้าเป็น InventoryItem
  const barcodeType = isInventoryItem(productData)
    ? productData.barcodeType || "ea"
    : "ea"; // Product ไม่มี barcodeType ให้ใช้ default

  return {
    id: `scan_${barcode}_${Date.now()}`,
    type: "scan",
    productName: productName || "สินค้าที่สแกน",
    barcode,
    timestamp: new Date().toISOString(),
    brand: productData.brand || "ไม่ระบุแบรนด์",
    category: productData.category,
    // ✅ เพิ่ม barcodeType ให้ถูกต้อง
    barcodeType,
  };
};

/**
 * Sort activities by timestamp (newest first)
 */
export const sortActivitiesByTime = (
  activities: ActivityItem[]
): ActivityItem[] => {
  return [...activities].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};

/**
 * Filter activities by type
 */
export const filterActivitiesByType = (
  activities: ActivityItem[],
  types: ActivityItem["type"][]
): ActivityItem[] => {
  return activities.filter((activity) => types.includes(activity.type));
};

/**
 * Get unique activity types from activities list
 */
export const getUniqueActivityTypes = (
  activities: ActivityItem[]
): ActivityItem["type"][] => {
  return [...new Set(activities.map((activity) => activity.type))];
};

/**
 * Group activities by date
 */
export const groupActivitiesByDate = (
  activities: ActivityItem[]
): Record<string, ActivityItem[]> => {
  return activities.reduce((groups, activity) => {
    const date = new Date(activity.timestamp).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(activity);
    return groups;
  }, {} as Record<string, ActivityItem[]>);
};

/**
 * Get activity summary statistics
 */
export const getActivitySummary = (activities: ActivityItem[]) => {
  const summary = {
    total: activities.length,
    byType: {} as Record<ActivityItem["type"], number>,
    byBarcodeType: {} as Record<"ea" | "dsp" | "cs", number>,
    today: 0,
    thisWeek: 0,
  };

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  activities.forEach((activity) => {
    // Count by type
    summary.byType[activity.type] = (summary.byType[activity.type] || 0) + 1;

    // ✅ Count by barcode type
    const barcodeType = activity.barcodeType || "ea";
    summary.byBarcodeType[barcodeType] =
      (summary.byBarcodeType[barcodeType] || 0) + 1;

    // Count by time period
    const activityDate = new Date(activity.timestamp);
    if (activityDate >= today) {
      summary.today++;
    }
    if (activityDate >= weekAgo) {
      summary.thisWeek++;
    }
  });

  return summary;
};
