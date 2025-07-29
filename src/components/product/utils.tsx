// Path: src/components/product/utils.tsx
// 🔧 Fixed Import - CategoryStyling and NutritionItem now from central types

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
import {
  ProductCategory,
  Product,
  NutritionInfo,
  CategoryStyling, // ✅ FIXED: Import from central types
  NutritionItem, // ✅ FIXED: Import from central types
} from "../../types/product";

/**
 * Get category icon based on product category
 */
export const getCategoryIcon = (category: ProductCategory) => {
  switch (category) {
    // ✅ Product Group Icons
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

    // Generic Categories
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
    // Product Group Colors
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

    // Generic Category Colors
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
      label: "วิตามิน C",
      value: nutritionInfo.vitamin_c,
      unit: "mg",
    },
    {
      label: "แคลเซียม",
      value: nutritionInfo.calcium,
      unit: "mg",
    },
  ];

  // Return only items with valid values
  return nutritionItems.filter(
    (item) => item.value !== undefined && item.value !== null && item.value > 0
  );
};

/**
 * Check if product has nutrition information
 */
export const hasNutritionInfo = (product: Product): boolean => {
  return !!(
    product.nutrition_info && Object.keys(product.nutrition_info).length > 0
  );
};

/**
 * Get formatted product size with unit
 */
export const getFormattedSize = (product: Product): string => {
  if (!product.size && !product.unit) return "";
  if (product.size && product.unit) return `${product.size} ${product.unit}`;
  if (product.size) return product.size;
  if (product.unit) return product.unit;
  return "";
};

/**
 * Format product price with currency
 */
export const getFormattedPrice = (product: Product): string => {
  if (!product.price) return "";
  const currency = product.currency || "฿";
  return `${currency}${product.price.toLocaleString()}`;
};

/**
 * Format price with currency (used by components)
 */
export const formatPrice = (price: number, currency?: string): string => {
  if (!price) return "";
  const currencySymbol = currency || "฿";
  return `${currencySymbol}${price.toLocaleString()}`;
};

/**
 * Format quantity with unit
 */
export const formatQuantity = (quantity: number, unit?: string): string => {
  if (quantity === 0) return "0";
  if (!unit) return quantity.toLocaleString();

  // Handle common unit translations
  const unitTranslations: Record<string, string> = {
    units: "หน่วย",
    pieces: "ชิ้น",
    packs: "แพ็ค",
    boxes: "กล่อง",
    bottles: "ขวด",
    cans: "กระป๋อง",
  };

  const translatedUnit = unitTranslations[unit.toLowerCase()] || unit;
  return `${quantity.toLocaleString()} ${translatedUnit}`;
};

/**
 * Format weight with appropriate unit
 */
export const formatWeight = (weight: number, unit: string = "g"): string => {
  if (!weight) return "";

  // Convert to appropriate unit for display
  if (unit === "g" && weight >= 1000) {
    return `${(weight / 1000).toFixed(1)} kg`;
  }

  return `${weight} ${unit}`;
};

/**
 * Format volume with appropriate unit
 */
export const formatVolume = (volume: number, unit: string = "ml"): string => {
  if (!volume) return "";

  // Convert to appropriate unit for display
  if (unit === "ml" && volume >= 1000) {
    return `${(volume / 1000).toFixed(1)} L`;
  }

  return `${volume} ${unit}`;
};
