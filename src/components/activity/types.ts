// ./src/components/activity/types.ts
import { InventoryItem } from "../../hooks/inventory/types";

export interface ActivityItem {
  id: string;
  type: "add" | "scan" | "update" | "remove";
  productName: string;
  barcode: string;
  quantity?: number;
  timestamp: string;
  brand: string;
  category?: string;
  oldQuantity?: number;
  newQuantity?: number;
  // ✅ เพิ่ม barcodeType property เพื่อรองรับการแสดงผล unit ที่ถูกต้อง
  barcodeType?: "ea" | "dsp" | "cs";
}

export interface ActivityItemProps {
  activity: ActivityItem;
  formatTime: (timestamp: string) => string;
}

export interface RecentActivityProps {
  inventory: InventoryItem[]; // Changed from any[] to InventoryItem[]
  lastScannedBarcode?: string;
  limit?: number;
  compact?: boolean;
  showHeader?: boolean;
}

export interface ActivityConfig {
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  getText: (activity: ActivityItem) => string;
}

export type ActivityType = ActivityItem["type"];
