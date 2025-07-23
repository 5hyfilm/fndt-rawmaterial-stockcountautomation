// Path: /src/components/product/utils.ts - Product Component Utilities (Fixed TypeScript)
import {
  Coffee,
  Package,
  Cookie,
  Archive,
  Wheat,
  Soup,
  ChefHat,
  Refrigerator,
  UtensilsCrossed,
  Droplets,
  Milk,
  Crown,
  Beaker,
} from "lucide-react";
import { ProductCategory, Product, NutritionInfo } from "../../types/product";
import { CategoryStyling, NutritionItem } from "./types";

/**
 * Get category icon based on product category
 */
export const getCategoryIcon = (category: ProductCategory) => {
  switch (category) {
    // ✅ ใหม่: Product Group Icons
    case ProductCategory.STM:
      return <Coffee size={16} className="text-blue-500" />;
    case ProductCategory.BB_GOLD:
      return <Crown size={16} className="text-yellow-500" />;
    case ProductCategory.EVAP:
      return <Droplets size={16} className="text-purple-500" />;
    case ProductCategory.SBC:
      return <Beaker size={16} className="text-green-500" />;
    case ProductCategory.SCM:
      return <Milk size={16} className="text-red-500" />;
    case ProductCategory.MAGNOLIA_UHT:
      return <Coffee size={16} className="text-indigo-500" />;
    case ProductCategory.NUTRISOY:
      return <Coffee size={16} className="text-teal-500" />;
    case ProductCategory.GUMMY:
      return <Cookie size={16} className="text-pink-500" />;

    // เดิม: Generic Categories
    case ProductCategory.BEVERAGES:
      return <Coffee size={16} className="text-blue-500" />;
    case ProductCategory.DAIRY:
      return <Droplets size={16} className="text-yellow-500" />;
    case ProductCategory.SNACKS:
      return <Cookie size={16} className="text-orange-500" />;
    case ProductCategory.CANNED_FOOD:
      return <Archive size={16} className="text-green-500" />;
    case ProductCategory.BAKERY:
      return <Wheat size={16} className="text-amber-500" />;
    case ProductCategory.CONFECTIONERY:
      return <Cookie size={16} className="text-pink-500" />;
    case ProductCategory.INSTANT_NOODLES:
      return <Soup size={16} className="text-red-500" />;
    case ProductCategory.SAUCES:
      return <ChefHat size={16} className="text-purple-500" />;
    case ProductCategory.SEASONING:
      return <UtensilsCrossed size={16} className="text-indigo-500" />;
    case ProductCategory.FROZEN:
      return <Refrigerator size={16} className="text-cyan-500" />;
    case ProductCategory.OTHER:
      return <Package size={16} className="text-gray-500" />;
    default:
      return <Package size={16} className="text-gray-500" />;
  }
};

/**
 * Get category color classes based on product category
 */
export const getCategoryColor = (category: ProductCategory): string => {
  switch (category) {
    // ✅ ใหม่: Product Group Colors
    case ProductCategory.STM:
      return "bg-blue-50 text-blue-800 border-blue-200";
    case ProductCategory.BB_GOLD:
      return "bg-yellow-50 text-yellow-800 border-yellow-200";
    case ProductCategory.EVAP:
      return "bg-purple-50 text-purple-800 border-purple-200";
    case ProductCategory.SBC:
      return "bg-green-50 text-green-800 border-green-200";
    case ProductCategory.SCM:
      return "bg-red-50 text-red-800 border-red-200";
    case ProductCategory.MAGNOLIA_UHT:
      return "bg-indigo-50 text-indigo-800 border-indigo-200";
    case ProductCategory.NUTRISOY:
      return "bg-teal-50 text-teal-800 border-teal-200";
    case ProductCategory.GUMMY:
      return "bg-pink-50 text-pink-800 border-pink-200";

    // เดิม: Generic Categories
    case ProductCategory.BEVERAGES:
      return "bg-blue-50 text-blue-800 border-blue-200";
    case ProductCategory.DAIRY:
      return "bg-yellow-50 text-yellow-800 border-yellow-200";
    case ProductCategory.SNACKS:
      return "bg-orange-50 text-orange-800 border-orange-200";
    case ProductCategory.CANNED_FOOD:
      return "bg-green-50 text-green-800 border-green-200";
    case ProductCategory.BAKERY:
      return "bg-amber-50 text-amber-800 border-amber-200";
    case ProductCategory.CONFECTIONERY:
      return "bg-pink-50 text-pink-800 border-pink-200";
    case ProductCategory.INSTANT_NOODLES:
      return "bg-red-50 text-red-800 border-red-200";
    case ProductCategory.SAUCES:
      return "bg-purple-50 text-purple-800 border-purple-200";
    case ProductCategory.SEASONING:
      return "bg-indigo-50 text-indigo-800 border-indigo-200";
    case ProductCategory.FROZEN:
      return "bg-cyan-50 text-cyan-800 border-cyan-200";
    case ProductCategory.OTHER:
      return "bg-gray-50 text-gray-800 border-gray-200";
    default:
      return "bg-gray-50 text-gray-800 border-gray-200";
  }
};

/**
 * Get complete category styling (icon + colors)
 */
export const getCategoryStyling = (
  category: ProductCategory
): CategoryStyling => {
  return {
    icon: getCategoryIcon(category),
    colorClass: getCategoryColor(category),
  };
};

/**
 * Format nutrition data for display with proper typing
 */
export const formatNutritionData = (
  nutritionInfo: NutritionInfo | undefined
): NutritionItem[] => {
  if (!nutritionInfo || typeof nutritionInfo !== "object") return [];

  const nutritionItems: NutritionItem[] = [
    {
      label: "แคลอรี่",
      value: nutritionInfo.calories_per_serving,
      unit: "kcal",
    },
    {
      label: "โปรตีน",
      value: nutritionInfo.protein,
      unit: "g",
    },
    {
      label: "คาร์โบไหเดรต",
      value: nutritionInfo.carbohydrates,
      unit: "g",
    },
    {
      label: "น้ำตาล",
      value: nutritionInfo.sugar,
      unit: "g",
    },
    {
      label: "ไขมัน",
      value: nutritionInfo.fat,
      unit: "g",
    },
    {
      label: "ไขมันอิ่มตัว",
      value: nutritionInfo.saturated_fat,
      unit: "g",
    },
    {
      label: "โซเดียม",
      value: nutritionInfo.sodium,
      unit: "mg",
    },
    {
      label: "ไฟเบอร์",
      value: nutritionInfo.fiber,
      unit: "g",
    },
    {
      label: "วิตามินซี",
      value: nutritionInfo.vitamin_c,
      unit: "mg",
    },
    {
      label: "แคลเซียม",
      value: nutritionInfo.calcium,
      unit: "mg",
    },
  ];

  // Filter out items with undefined, null, or 0 values
  return nutritionItems.filter(
    (item) =>
      item.value !== undefined &&
      item.value !== null &&
      item.value > 0 &&
      !isNaN(Number(item.value))
  );
};

/**
 * Format price for display with proper currency handling
 */
export const formatPrice = (
  price: number | undefined,
  currency: string = "THB"
): string => {
  if (!price || isNaN(price) || price <= 0) return "";

  const numPrice = Number(price);

  switch (currency.toUpperCase()) {
    case "THB":
      return `฿${numPrice.toLocaleString("th-TH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    case "USD":
      return `$${numPrice.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    case "EUR":
      return `€${numPrice.toLocaleString("de-DE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    default:
      return `${numPrice.toFixed(2)} ${currency}`;
  }
};

/**
 * Format quantity with unit, handling edge cases
 */
export const formatQuantity = (quantity: number, unit?: string): string => {
  if (!quantity || isNaN(quantity)) return "0 ชิ้น";

  const numQuantity = Math.max(0, Math.floor(quantity));
  const displayUnit = unit && unit.trim() !== "" ? unit : "ชิ้น";

  return `${numQuantity.toLocaleString("th-TH")} ${displayUnit}`;
};

/**
 * Check if product has detailed information
 */
export const hasProductDetails = (product: Product | undefined): boolean => {
  if (!product || typeof product !== "object") return false;

  return !!(
    (product.sku && product.sku.trim() !== "") ||
    (product.country_of_origin && product.country_of_origin.trim() !== "") ||
    (product.storage_instructions &&
      product.storage_instructions.trim() !== "") ||
    (product.ingredients &&
      Array.isArray(product.ingredients) &&
      product.ingredients.length > 0) ||
    (product.allergens &&
      Array.isArray(product.allergens) &&
      product.allergens.length > 0)
  );
};

/**
 * Check if product has nutrition information
 */
export const hasNutritionInfo = (product: Product | undefined): boolean => {
  if (!product || typeof product !== "object") return false;

  return !!(
    product.nutrition_info &&
    typeof product.nutrition_info === "object" &&
    formatNutritionData(product.nutrition_info).length > 0
  );
};

/**
 * Copy text to clipboard with better error handling
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  if (!text || typeof text !== "string") {
    console.error("Invalid text provided for clipboard copy");
    return false;
  }

  try {
    // Modern clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback for older browsers or non-secure contexts
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const result = document.execCommand("copy");
    document.body.removeChild(textArea);
    return result;
  } catch (err) {
    console.error("Failed to copy text to clipboard:", err);
    return false;
  }
};

/**
 * Validate quantity input with proper bounds checking
 */
export const validateQuantity = (
  value: number | string,
  min: number = 1,
  max?: number // ✅ เปลี่ยนเป็น optional และไม่มี default value
): number => {
  const numValue = typeof value === "string" ? parseInt(value, 10) : value;

  if (isNaN(numValue) || !isFinite(numValue)) return min;
  if (numValue < min) return min;

  // ✅ เอาการเช็ค max limit ออก - ให้กรอกได้ไม่จำกัด
  if (max !== undefined && numValue > max) return max;

  return Math.floor(Math.abs(numValue));
};

/**
 * Generate product display name with fallback
 */
export const getDisplayName = (product: Product | undefined): string => {
  if (!product || typeof product !== "object") return "ไม่ระบุชื่อสินค้า";

  const name = product.name?.trim() || product.name_en?.trim() || "";
  return name || "ไม่ระบุชื่อสินค้า";
};

/**
 * Generate product subtitle with proper formatting
 */
export const getProductSubtitle = (product: Product | undefined): string => {
  if (!product || typeof product !== "object") return "";

  const parts: string[] = [];

  if (product.brand?.trim()) {
    parts.push(product.brand.trim());
  }

  if (product.size?.trim() && product.unit?.trim()) {
    parts.push(`${product.size.trim()} ${product.unit.trim()}`);
  } else if (product.size?.trim()) {
    parts.push(product.size.trim());
  }

  if (product.category?.trim()) {
    parts.push(product.category.trim());
  }

  return parts.join(" • ");
};

/**
 * Format date for display in Thai locale
 */
export const formatDate = (dateString: string | Date): string => {
  if (!dateString) return "ไม่ระบุวันที่";

  try {
    const date =
      typeof dateString === "string" ? new Date(dateString) : dateString;

    if (isNaN(date.getTime())) {
      return "วันที่ไม่ถูกต้อง";
    }

    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "วันที่ไม่ถูกต้อง";
  }
};

/**
 * Check if barcode is valid format
 */
export const isValidBarcode = (barcode: string): boolean => {
  if (!barcode || typeof barcode !== "string") return false;

  const cleanBarcode = barcode.trim().replace(/[^0-9]/g, "");

  // Common barcode lengths: UPC-A (12), EAN-13 (13), EAN-8 (8)
  const validLengths = [8, 12, 13, 14];
  return validLengths.includes(cleanBarcode.length);
};

/**
 * Clean and normalize barcode
 */
export const normalizeBarcode = (barcode: string): string => {
  if (!barcode || typeof barcode !== "string") return "";

  return barcode.trim().replace(/[^0-9]/g, "");
};

/**
 * Get status color for inventory quantity
 */
export const getStockStatusColor = (quantity: number): string => {
  if (quantity <= 0) return "text-red-600";
  if (quantity <= 5) return "text-yellow-600";
  if (quantity <= 10) return "text-orange-600";
  return "text-green-600";
};

/**
 * Get status text for inventory
 */
export const getStockStatusText = (quantity: number): string => {
  if (quantity <= 0) return "หมด";
  if (quantity <= 5) return "เหลือน้อย";
  if (quantity <= 10) return "ปานกลาง";
  return "พอเพียง";
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * Debounce function for search inputs with proper typing
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Generate unique ID for components
 */
export const generateId = (prefix: string = "id"): string => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
