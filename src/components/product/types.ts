// src/components/product/types.ts - Product Component Types
import { Product } from "../../types/product";

// Common interfaces for product components
export interface BaseProductComponentProps {
  product: Product;
}

export interface ProductInfoMainProps {
  product: Product | null;
  barcode?: string;
  isLoading?: boolean;
  error?: string;
  onAddToInventory?: (product: Product, quantity: number) => boolean;
  currentInventoryQuantity?: number;
}

export interface InventoryActionProps {
  product: Product;
  onAddToInventory: (product: Product, quantity: number) => boolean;
  currentInventoryQuantity: number;
}

export interface BarcodeDisplayProps {
  barcode: string;
  scannedBarcode?: string;
  onCopy?: () => void;
  copied?: boolean;
}

export interface EmptyStateProps {
  title: string;
  message: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

// Quantity control types
export interface QuantityControlProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  unit?: string;
}

// Nutrition display types
export interface NutritionItem {
  label: string;
  value: number | undefined;
  unit: string;
}

export interface NutritionDisplayProps {
  nutritionData: NutritionItem[];
  servingSize?: string;
}

// Product category styling
export interface CategoryStyling {
  icon: React.ReactNode;
  colorClass: string;
}

export interface ProductDisplayOptions {
  showPrice?: boolean;
  showNutrition?: boolean;
  showDetails?: boolean;
  showInventoryActions?: boolean;
  compactMode?: boolean;
}
