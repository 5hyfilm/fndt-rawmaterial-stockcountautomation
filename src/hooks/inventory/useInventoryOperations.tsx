// Path: src/hooks/inventory/useInventoryOperations.tsx - Fixed with QuantityDetail Support
"use client";

import { useCallback } from "react";
import { Product } from "../../types/product";
import {
  InventoryItem,
  QuantityInput,
  QuantityDetail,
  MultiUnitQuantities,
  getTotalQuantityAllUnits,
  isQuantityDetail,
} from "./types";

interface UseInventoryOperationsProps {
  inventory: InventoryItem[];
  setInventory: (inventory: InventoryItem[]) => void;
  saveInventory: (inventory: InventoryItem[]) => boolean;
  setError: (error: string | null) => void;
}

export const useInventoryOperations = ({
  inventory,
  setInventory,
  saveInventory,
  setError,
}: UseInventoryOperationsProps) => {
  // ✅ Generate unique material code for new products
  const generateMaterialCode = useCallback((product: Product): string => {
    return product.name || product.barcode || `MAT_${Date.now()}`;
  }, []);

  // ✅ Find item by material code (ใหม่ - สำคัญ!)
  const findItemByMaterialCode = useCallback(
    (materialCode: string): InventoryItem | undefined => {
      return inventory.find((item) => item.materialCode === materialCode);
    },
    [inventory]
  );

  // ✅ Find item by barcode (เก่า - เก็บไว้เพื่อ compatibility)
  const findItemByBarcode = useCallback(
    (barcode: string): InventoryItem | undefined => {
      return inventory.find(
        (item) =>
          item.barcode === barcode ||
          item.scannedBarcodes?.cs === barcode ||
          item.scannedBarcodes?.dsp === barcode ||
          item.scannedBarcodes?.ea === barcode
      );
    },
    [inventory]
  );

  // ✅ FIXED: Add or update multi-unit item with QuantityDetail support
  const addOrUpdateMultiUnitItem = useCallback(
    (
      product: Product,
      quantityInput: QuantityInput,
      barcodeType: "cs" | "dsp" | "ea",
      directProductGroup?: string
    ): boolean => {
      try {
        setError(null);

        // ✅ FIXED: Parse quantity input with QuantityDetail support
        let quantities: MultiUnitQuantities = {};

        if (typeof quantityInput === "number") {
          // Simple number input
          quantities[barcodeType] = quantityInput;
          console.log(
            "📝 Simple quantity input:",
            quantityInput,
            "for",
            barcodeType
          );
        } else if ("quantity" in quantityInput && "unit" in quantityInput) {
          // Unit-specific input: { quantity: number, unit: string }
          const unitInput = quantityInput as {
            quantity: number;
            unit: "cs" | "dsp" | "ea";
          };
          quantities[unitInput.unit] = unitInput.quantity;
          console.log("📝 Unit-specific input:", unitInput);

          // ตรวจสอบว่า unit ตรงกับ barcodeType หรือไม่
          if (unitInput.unit !== barcodeType) {
            console.warn(
              `Unit mismatch: input=${unitInput.unit}, barcode=${barcodeType}`
            );
          }
        } else if (isQuantityDetail(quantityInput)) {
          // ✅ NEW: QuantityDetail input - รองรับครบ 3 หน่วย
          const quantityDetail = quantityInput as QuantityDetail;
          quantities = {
            cs: quantityDetail.cs,
            dsp: quantityDetail.dsp,
            ea: quantityDetail.ea,
          };
          // ลบหน่วยที่เป็น 0 ออก
          if (quantities.cs === 0) delete quantities.cs;
          if (quantities.dsp === 0) delete quantities.dsp;
          if (quantities.ea === 0) delete quantities.ea;

          console.log("📝 QuantityDetail input (3-unit):", quantities);
        } else {
          console.error("❌ Invalid quantityInput format:", quantityInput);
          setError("รูปแบบข้อมูลจำนวนไม่ถูกต้อง");
          return false;
        }

        // ✅ Validate quantities
        const totalQuantity = Object.values(quantities).reduce(
          (sum, qty) => sum + (qty || 0),
          0
        );
        if (totalQuantity <= 0) {
          setError("จำนวนสินค้าต้องมากกว่า 0");
          return false;
        }

        // Generate or get material code
        const materialCode = generateMaterialCode(product);

        console.log(
          "🔍 Looking for existing item with materialCode:",
          materialCode
        );
        console.log("📦 New quantities to add:", quantities);

        // Find existing item by material code
        const existingItem = findItemByMaterialCode(materialCode);

        if (existingItem) {
          // ✅ UPDATE: เพิ่มจำนวนเข้ากับรายการเดิม
          console.log("📦 Found existing item, updating quantities:", {
            current: existingItem.quantities,
            adding: quantities,
          });

          const updatedQuantities: MultiUnitQuantities = {
            cs: (existingItem.quantities.cs || 0) + (quantities.cs || 0),
            dsp: (existingItem.quantities.dsp || 0) + (quantities.dsp || 0),
            ea: (existingItem.quantities.ea || 0) + (quantities.ea || 0),
          };

          // ลบหน่วยที่เป็น 0 ออก
          if (updatedQuantities.cs === 0) delete updatedQuantities.cs;
          if (updatedQuantities.dsp === 0) delete updatedQuantities.dsp;
          if (updatedQuantities.ea === 0) delete updatedQuantities.ea;

          // อัปเดต scanned barcodes
          const updatedScannedBarcodes = {
            ...existingItem.scannedBarcodes,
          };

          // เพิ่มบาร์โค้ดใหม่สำหรับหน่วยที่มีการเพิ่ม
          Object.keys(quantities).forEach((unit) => {
            if (quantities[unit as keyof MultiUnitQuantities]! > 0) {
              updatedScannedBarcodes[
                unit as keyof typeof updatedScannedBarcodes
              ] = product.barcode;
            }
          });

          const updatedItem: InventoryItem = {
            ...existingItem,
            quantities: updatedQuantities,
            quantity: Object.values(updatedQuantities).reduce(
              (sum, qty) => sum + (qty || 0),
              0
            ),
            scannedBarcodes: updatedScannedBarcodes,
            lastUpdated: new Date().toISOString(),
            // อัปเดต product group ถ้ามี
            productGroup: directProductGroup || existingItem.productGroup,
          };

          const updatedInventory = inventory.map((item) =>
            item.id === existingItem.id ? updatedItem : item
          );

          console.log("✅ Updated existing item:", updatedItem);
          setInventory(updatedInventory);
          return saveInventory(updatedInventory);
        } else {
          // ✅ CREATE: สร้างรายการใหม่
          console.log("🆕 Creating new item with materialCode:", materialCode);

          // สร้าง scannedBarcodes สำหรับหน่วยที่มีจำนวน
          const scannedBarcodes: { cs?: string; dsp?: string; ea?: string } =
            {};
          Object.keys(quantities).forEach((unit) => {
            if (quantities[unit as keyof MultiUnitQuantities]! > 0) {
              scannedBarcodes[unit as keyof typeof scannedBarcodes] =
                product.barcode;
            }
          });

          const newItem: InventoryItem = {
            id: `inv_${materialCode}_${Date.now()}`,
            materialCode,
            productName: product.name || "ไม่ระบุชื่อ",
            brand: product.brand || "ไม่ระบุแบรนด์",
            category: product.category || "ไม่ระบุ",
            size: product.size?.toString() || "",
            unit: product.unit || "",
            barcode: product.barcode, // บาร์โค้ดหลัก
            quantity: totalQuantity, // จำนวนรวม
            quantities,
            lastUpdated: new Date().toISOString(),
            productData: product,
            productGroup: directProductGroup || product.category,
            thaiDescription: product.name,
            scannedBarcodes,
          };

          const updatedInventory = [...inventory, newItem];

          console.log("✅ Created new item:", newItem);
          setInventory(updatedInventory);
          return saveInventory(updatedInventory);
        }
      } catch (error) {
        console.error("❌ Error in addOrUpdateMultiUnitItem:", error);
        setError("เกิดข้อผิดพลาดในการเพิ่มสินค้า");
        return false;
      }
    },
    [
      inventory,
      setInventory,
      saveInventory,
      setError,
      generateMaterialCode,
      findItemByMaterialCode,
    ]
  );

  // ✅ NEW: Update specific unit quantity
  const updateUnitQuantity = useCallback(
    (
      materialCode: string,
      unit: "cs" | "dsp" | "ea",
      newQuantity: number
    ): boolean => {
      try {
        setError(null);

        if (newQuantity < 0) {
          setError("จำนวนสินค้าต้องไม่เป็นค่าลบ");
          return false;
        }

        const existingItem = findItemByMaterialCode(materialCode);
        if (!existingItem) {
          setError("ไม่พบรายการสินค้า");
          return false;
        }

        const updatedQuantities: MultiUnitQuantities = {
          ...existingItem.quantities,
          [unit]: newQuantity,
        };

        // ถ้าจำนวนเป็น 0 ให้ลบ unit นั้นออก
        if (newQuantity === 0) {
          delete updatedQuantities[unit];
        }

        const updatedItem: InventoryItem = {
          ...existingItem,
          quantities: updatedQuantities,
          quantity: getTotalQuantityAllUnits({
            ...existingItem,
            quantities: updatedQuantities,
          }),
          lastUpdated: new Date().toISOString(),
        };

        const updatedInventory = inventory.map((item) =>
          item.materialCode === materialCode ? updatedItem : item
        );

        console.log(
          `✅ Updated ${unit} quantity for ${materialCode}:`,
          newQuantity
        );
        setInventory(updatedInventory);
        return saveInventory(updatedInventory);
      } catch (error) {
        console.error("❌ Error updating unit quantity:", error);
        setError("เกิดข้อผิดพลาดในการอัพเดทจำนวน");
        return false;
      }
    },
    [inventory, setInventory, saveInventory, setError, findItemByMaterialCode]
  );

  // ✅ LEGACY: รองรับ API เก่า (จะค่อย ๆ เอาออก)
  const addOrUpdateItem = useCallback(
    (
      product: Product,
      quantityInput: number | QuantityDetail,
      barcodeType: "cs" | "dsp" | "ea" = "ea",
      directProductGroup?: string
    ): boolean => {
      console.log(
        "⚠️ Using legacy addOrUpdateItem, consider migrating to addOrUpdateMultiUnitItem"
      );
      return addOrUpdateMultiUnitItem(
        product,
        quantityInput,
        barcodeType,
        directProductGroup
      );
    },
    [addOrUpdateMultiUnitItem]
  );

  // ✅ LEGACY: Update item quantity (จะค่อย ๆ เอาออก)
  const updateItemQuantity = useCallback(
    (itemId: string, newQuantity: number): boolean => {
      try {
        console.log(
          "⚠️ Using legacy updateItemQuantity, consider using updateUnitQuantity"
        );

        const existingItem = inventory.find((item) => item.id === itemId);
        if (!existingItem) {
          setError("ไม่พบรายการสินค้า");
          return false;
        }

        // สำหรับ legacy, อัปเดตใน unit หลักที่มีข้อมูล
        const activeUnits = Object.keys(existingItem.quantities) as Array<
          "cs" | "dsp" | "ea"
        >;
        if (activeUnits.length === 0) return false;

        const primaryUnit = activeUnits[0]; // ใช้ unit แรกที่พบ
        return updateUnitQuantity(
          existingItem.materialCode,
          primaryUnit,
          newQuantity
        );
      } catch (error) {
        console.error("❌ Error in legacy updateItemQuantity:", error);
        setError("เกิดข้อผิดพลาดในการอัพเดทจำนวน");
        return false;
      }
    },
    [inventory, updateUnitQuantity, setError]
  );

  // ✅ Remove item (ไม่เปลี่ยน)
  const removeItem = useCallback(
    (itemId: string): boolean => {
      try {
        setError(null);
        const updatedInventory = inventory.filter((item) => item.id !== itemId);
        setInventory(updatedInventory);
        return saveInventory(updatedInventory);
      } catch (error) {
        console.error("❌ Error removing item:", error);
        setError("เกิดข้อผิดพลาดในการลบรายการ");
        return false;
      }
    },
    [inventory, setInventory, saveInventory, setError]
  );

  // ✅ Search items (อัปเดตให้ค้นหาทั้ง materialCode)
  const searchItems = useCallback(
    (searchTerm: string): InventoryItem[] => {
      const term = searchTerm.toLowerCase().trim();
      if (!term) return inventory;

      return inventory.filter(
        (item) =>
          item.productName.toLowerCase().includes(term) ||
          item.brand.toLowerCase().includes(term) ||
          item.barcode.includes(term) ||
          item.materialCode.toLowerCase().includes(term) ||
          (item.thaiDescription &&
            item.thaiDescription.toLowerCase().includes(term))
      );
    },
    [inventory]
  );

  return {
    // ✅ NEW: Multi-unit operations
    addOrUpdateMultiUnitItem,
    updateUnitQuantity,
    findItemByMaterialCode,

    // ✅ LEGACY: Backward compatibility
    addOrUpdateItem,
    updateItemQuantity,
    findItemByBarcode,

    // ✅ Core operations
    removeItem,
    searchItems,
  };
};
