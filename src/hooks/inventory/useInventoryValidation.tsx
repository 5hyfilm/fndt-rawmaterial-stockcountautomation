// Path: src/hooks/inventory/useInventoryValidation.tsx - Cleaned Version (No Legacy Code)
"use client";

import { useCallback, useMemo } from "react";
import {
  InventoryItem,
  QuantityDetail,
  QuantityInput,
  isQuantityDetail,
  isSimpleQuantity,
} from "../../types/inventory";
import { Product } from "../../types/product";

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

interface QuantityValidationRules {
  // Basic quantity rules
  minQuantity: number;
  maxQuantity: number;

  // Unit-specific rules
  minCsQuantity: number;
  maxCsQuantity: number;
  minDspQuantity: number;
  maxDspQuantity: number;
  minEaQuantity: number;
  maxEaQuantity: number;

  // Business rules
  allowZeroCs: boolean;
  allowZeroDsp: boolean;
  allowZeroEa: boolean;
  requireMinimumUnit: boolean;

  // Pack size validation
  validatePackRatio: boolean;
  maxEaPerDsp?: number; // e.g., if 1 DSP = 12 EA, EA should be < 12 when DSP > 0
  maxDspPerCs?: number; // e.g., if 1 CS = 10 DSP, DSP should be < 10 when CS > 0
}

const DEFAULT_VALIDATION_RULES: QuantityValidationRules = {
  minQuantity: 0,
  maxQuantity: 99999,
  minCsQuantity: 0,
  maxCsQuantity: 9999,
  minDspQuantity: 0,
  maxDspQuantity: 9999,
  minEaQuantity: 0,
  maxEaQuantity: 99999,
  allowZeroCs: true,
  allowZeroDsp: true,
  allowZeroEa: true,
  requireMinimumUnit: false,
  validatePackRatio: false,
};

export const useInventoryValidation = (
  customRules: Partial<QuantityValidationRules> = {}
) => {
  // ✅ แก้ไข: ใช้ useMemo เพื่อ memoize rules object
  const rules = useMemo(() => {
    return { ...DEFAULT_VALIDATION_RULES, ...customRules };
  }, [customRules]);

  // ✅ Validate basic product data
  const validateProduct = useCallback((product: Product): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Required fields validation
    if (!product.name || product.name.trim() === "") {
      errors.push("ชื่อสินค้าเป็นข้อมูลที่จำเป็น");
    }

    if (!product.barcode || product.barcode.trim() === "") {
      errors.push("บาร์โค้ดเป็นข้อมูลที่จำเป็น");
    }

    // Brand validation
    if (!product.brand || product.brand.trim() === "") {
      warnings.push("ไม่พบข้อมูลแบรนด์");
      suggestions.push("ควรระบุแบรนด์เพื่อความถูกต้องของข้อมูล");
    }

    // Category validation
    if (!product.category || product.category.trim() === "") {
      warnings.push("ไม่พบข้อมูลหมวดหมู่");
      suggestions.push("ควรระบุหมวดหมู่เพื่อการจัดกลุ่มที่ดี");
    }

    // Barcode format validation
    if (product.barcode && !/^\d+$/.test(product.barcode)) {
      warnings.push("บาร์โค้ดควรเป็นตัวเลขเท่านั้น");
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions,
    };
  }, []);

  // ✅ Validate simple quantity (EA) - ตอนนี้ใช้ stable rules dependency
  const validateSimpleQuantity = useCallback(
    (quantity: number): ValidationResult => {
      const errors: string[] = [];
      const warnings: string[] = [];
      const suggestions: string[] = [];

      if (quantity < rules.minQuantity) {
        errors.push(`จำนวนต้องไม่น้อยกว่า ${rules.minQuantity}`);
      }

      if (quantity > rules.maxQuantity) {
        errors.push(`จำนวนต้องไม่เกิน ${rules.maxQuantity}`);
      }

      if (quantity === 0) {
        warnings.push("จำนวนเป็น 0 อาจไม่ใช่การเพิ่มสินค้าปกติ");
        suggestions.push("ตรวจสอบว่าต้องการเพิ่มจำนวน 0 จริงหรือไม่");
      }

      if (quantity > 1000) {
        warnings.push("จำนวนสูงมาก กรุณาตรวจสอบความถูกต้อง");
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        suggestions,
      };
    },
    [rules]
  );

  // ✅ Validate quantity detail (CS/DSP/EA)
  const validateQuantityDetail = useCallback(
    (quantityDetail: QuantityDetail): ValidationResult => {
      const errors: string[] = [];
      const warnings: string[] = [];
      const suggestions: string[] = [];

      const { cs, dsp, ea, scannedType } = quantityDetail;

      // Basic range validation for CS
      if (cs < rules.minCsQuantity) {
        errors.push(`จำนวนลังต้องไม่น้อยกว่า ${rules.minCsQuantity}`);
      }

      if (cs > rules.maxCsQuantity) {
        errors.push(`จำนวนลังต้องไม่เกิน ${rules.maxCsQuantity}`);
      }

      // Basic range validation for DSP
      if (dsp < rules.minDspQuantity) {
        errors.push(`จำนวนแพ็คต้องไม่น้อยกว่า ${rules.minDspQuantity}`);
      }

      if (dsp > rules.maxDspQuantity) {
        errors.push(`จำนวนแพ็คต้องไม่เกิน ${rules.maxDspQuantity}`);
      }

      // Basic range validation for EA
      if (ea < rules.minEaQuantity) {
        errors.push(`จำนวนชิ้นต้องไม่น้อยกว่า ${rules.minEaQuantity}`);
      }

      if (ea > rules.maxEaQuantity) {
        errors.push(`จำนวนชิ้นต้องไม่เกิน ${rules.maxEaQuantity}`);
      }

      // Business logic validation
      if (!rules.allowZeroCs && cs === 0) {
        warnings.push("จำนวนลังเป็น 0");
      }

      if (!rules.allowZeroDsp && dsp === 0) {
        warnings.push("จำนวนแพ็คเป็น 0");
      }

      if (!rules.allowZeroEa && ea === 0) {
        warnings.push("จำนวนชิ้นเป็น 0");
      }

      // Total quantity validation
      if (cs === 0 && dsp === 0 && ea === 0) {
        errors.push("จำนวนรวมต้องมากกว่า 0");
      }

      // Pack ratio validation (if enabled)
      if (rules.validatePackRatio) {
        // Check if EA count makes sense with DSP count
        if (rules.maxEaPerDsp && dsp > 0 && ea >= rules.maxEaPerDsp) {
          warnings.push(
            `จำนวนชิ้น ${ea} ดูเหมือนสูงกว่าปกติเมื่อมีแพ็ค ${dsp} แล้ว`
          );
          suggestions.push("ตรวจสอบว่าควรเพิ่มจำนวนแพ็คแทน");
        }

        // Check if DSP count makes sense with CS count
        if (rules.maxDspPerCs && cs > 0 && dsp >= rules.maxDspPerCs) {
          warnings.push(
            `จำนวนแพ็ค ${dsp} ดูเหมือนสูงกว่าปกติเมื่อมีลัง ${cs} แล้ว`
          );
          suggestions.push("ตรวจสอบว่าควรเพิ่มจำนวนลังแทน");
        }
      }

      // Type-specific validations based on scanned type
      if (scannedType === "cs" && cs > 100) {
        warnings.push("จำนวนลังสูงมาก กรุณาตรวจสอบความถูกต้อง");
      }

      if (scannedType === "dsp" && dsp > 500) {
        warnings.push("จำนวนแพ็คสูงมาก กรุณาตรวจสอบความถูกต้อง");
      }

      if (scannedType === "ea" && ea > 10000) {
        warnings.push("จำนวนชิ้นสูงมาก กรุณาตรวจสอบความถูกต้อง");
      }

      // Cross-validation with scanned type
      if (scannedType === "cs" && cs === 0 && (dsp > 0 || ea > 0)) {
        warnings.push("สแกนจากลังแต่ไม่มีจำนวนลัง - ตรวจสอบความถูกต้อง");
      }

      if (scannedType === "dsp" && dsp === 0 && (cs > 0 || ea > 0)) {
        warnings.push("สแกนจากแพ็คแต่ไม่มีจำนวนแพ็ค - ตรวจสอบความถูกต้อง");
      }

      if (scannedType === "ea" && ea === 0 && (cs > 0 || dsp > 0)) {
        warnings.push("สแกนจากชิ้นแต่ไม่มีจำนวนชิ้น - ตรวจสอบความถูกต้อง");
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        suggestions,
      };
    },
    [rules]
  );

  // ✅ Validate quantity input (unified validation)
  const validateQuantityInput = useCallback(
    (
      quantityInput: QuantityInput,
      barcodeType: "ea" | "dsp" | "cs" = "ea"
    ): ValidationResult => {
      if (isSimpleQuantity(quantityInput)) {
        // Simple quantity validation
        const result = validateSimpleQuantity(quantityInput);

        // Additional checks for non-EA types with simple quantity
        if (barcodeType !== "ea" && quantityInput > 0) {
          result.warnings.push(
            `สแกนจาก ${barcodeType.toUpperCase()} แต่ใช้จำนวนแบบง่าย - พิจารณาใช้จำนวนแบบรายละเอียด`
          );
          result.suggestions.push("ลองใช้การกรอกจำนวนแบบแยกหน่วย");
        }

        return result;
      }

      if (isQuantityDetail(quantityInput)) {
        // Quantity detail validation
        const result = validateQuantityDetail(quantityInput);

        // Check consistency between scanned type and barcode type
        if (
          quantityInput.scannedType &&
          quantityInput.scannedType !== barcodeType
        ) {
          result.warnings.push(
            `ประเภทที่สแกน (${quantityInput.scannedType}) ไม่ตรงกับประเภทบาร์โค้ด (${barcodeType})`
          );
        }

        return result;
      }

      // Handle unit-specific quantity input
      if (
        typeof quantityInput === "object" &&
        "quantity" in quantityInput &&
        "unit" in quantityInput
      ) {
        const { quantity, unit } = quantityInput;
        const simpleResult = validateSimpleQuantity(quantity);

        // Check consistency
        if (unit !== barcodeType) {
          simpleResult.warnings.push(
            `หน่วยที่ระบุ (${unit}) ไม่ตรงกับประเภทบาร์โค้ด (${barcodeType})`
          );
        }

        return simpleResult;
      }

      // Invalid input type
      return {
        isValid: false,
        errors: ["รูปแบบข้อมูลจำนวนไม่ถูกต้อง"],
        warnings: [],
        suggestions: [
          "กรุณาระบุจำนวนเป็นตัวเลข หรือข้อมูลรายละเอียดที่ถูกต้อง",
        ],
      };
    },
    [validateSimpleQuantity, validateQuantityDetail]
  );

  // ✅ FIXED: Modern duplication validation (ใช้ materialCode และ quantities)
  const validateDuplication = useCallback(
    (
      product: Product,
      barcodeType: "ea" | "dsp" | "cs",
      existingInventory: InventoryItem[]
    ): ValidationResult => {
      const errors: string[] = [];
      const warnings: string[] = [];
      const suggestions: string[] = [];

      const materialCode = product.id || product.barcode;

      // ✅ Check for same material (will be merged by material code)
      const sameProduct = existingInventory.find(
        (item) =>
          item.materialCode === materialCode || item.barcode === product.barcode
      );

      if (sameProduct) {
        warnings.push("พบสินค้าเดียวกันในระบบแล้ว");

        // ✅ Check if the unit already has quantity
        const currentUnitQuantity = sameProduct.quantities[barcodeType] || 0;

        if (currentUnitQuantity > 0) {
          warnings.push(
            `หน่วย ${barcodeType.toUpperCase()} มีจำนวน ${currentUnitQuantity} อยู่แล้ว`
          );
          suggestions.push("จำนวนใหม่จะถูกรวมเข้ากับจำนวนเดิม");
        } else {
          suggestions.push(
            `จะเพิ่มจำนวนใหม่ในหน่วย ${barcodeType.toUpperCase()}`
          );
        }

        // ✅ Show other active units
        const otherActiveUnits = (["cs", "dsp", "ea"] as const)
          .filter(
            (unit) =>
              unit !== barcodeType && (sameProduct.quantities[unit] || 0) > 0
          )
          .map(
            (unit) => `${unit.toUpperCase()}: ${sameProduct.quantities[unit]}`
          );

        if (otherActiveUnits.length > 0) {
          warnings.push(`มีจำนวนในหน่วยอื่น: ${otherActiveUnits.join(", ")}`);
          suggestions.push("สินค้าชิ้นนี้จะมีหลายหน่วยหลังจากเพิ่ม");
        }
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        suggestions,
      };
    },
    []
  );

  // ✅ Comprehensive validation for adding inventory
  const validateAddInventory = useCallback(
    (
      product: Product,
      quantityInput: QuantityInput,
      barcodeType: "ea" | "dsp" | "cs" = "ea",
      existingInventory: InventoryItem[] = []
    ): ValidationResult => {
      const allErrors: string[] = [];
      const allWarnings: string[] = [];
      const allSuggestions: string[] = [];

      // Validate product data
      const productValidation = validateProduct(product);
      allErrors.push(...productValidation.errors);
      allWarnings.push(...productValidation.warnings);
      allSuggestions.push(...productValidation.suggestions);

      // Validate quantity input
      const quantityValidation = validateQuantityInput(
        quantityInput,
        barcodeType
      );
      allErrors.push(...quantityValidation.errors);
      allWarnings.push(...quantityValidation.warnings);
      allSuggestions.push(...quantityValidation.suggestions);

      // Validate duplication
      const duplicationValidation = validateDuplication(
        product,
        barcodeType,
        existingInventory
      );
      allErrors.push(...duplicationValidation.errors);
      allWarnings.push(...duplicationValidation.warnings);
      allSuggestions.push(...duplicationValidation.suggestions);

      return {
        isValid: allErrors.length === 0,
        errors: allErrors,
        warnings: allWarnings,
        suggestions: allSuggestions,
      };
    },
    [validateProduct, validateQuantityInput, validateDuplication]
  );

  return {
    // Individual validation functions
    validateProduct,
    validateSimpleQuantity,
    validateQuantityDetail,
    validateQuantityInput,
    validateDuplication,

    // Comprehensive validation
    validateAddInventory,

    // Configuration
    rules,
  };
};
