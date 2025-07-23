// src/hooks/product/useProductValidator.tsx
"use client";

import { useCallback } from "react";

interface BarcodeValidationResult {
  isValid: boolean;
  normalizedBarcode: string;
  detectedFormat?: string;
  errors: string[];
  suggestions?: string[];
}

interface UseProductValidatorReturn {
  normalizeBarcode: (barcode: string) => string;
  validateBarcode: (barcode: string) => BarcodeValidationResult;
  isValidBarcodeFormat: (barcode: string) => boolean;
  suggestBarcodeCorrections: (barcode: string) => string[];
}

export const useProductValidator = (): UseProductValidatorReturn => {
  // Normalize barcode for consistency
  const normalizeBarcode = useCallback((barcode: string): string => {
    if (!barcode || typeof barcode !== "string") return "";
    return barcode.trim().replace(/[^0-9]/g, "");
  }, []);

  // Check if barcode format is valid
  const isValidBarcodeFormat = useCallback(
    (barcode: string): boolean => {
      if (!barcode || typeof barcode !== "string") return false;

      const cleanBarcode = normalizeBarcode(barcode);

      // Common barcode lengths: UPC-A (12), EAN-13 (13), EAN-8 (8)
      const validLengths = [8, 12, 13, 14];
      return (
        validLengths.includes(cleanBarcode.length) && cleanBarcode.length > 0
      );
    },
    [normalizeBarcode]
  );

  // Detect barcode format
  const detectBarcodeFormat = useCallback(
    (barcode: string): string | undefined => {
      const cleanBarcode = normalizeBarcode(barcode);

      switch (cleanBarcode.length) {
        case 8:
          return "EAN-8";
        case 12:
          return "UPC-A";
        case 13:
          return "EAN-13";
        case 14:
          return "ITF-14";
        default:
          return undefined;
      }
    },
    [normalizeBarcode]
  );

  // Suggest barcode corrections
  const suggestBarcodeCorrections = useCallback(
    (barcode: string): string[] => {
      const suggestions: string[] = [];
      const cleanBarcode = normalizeBarcode(barcode);

      if (!cleanBarcode) {
        suggestions.push("กรุณากรอกหมายเลขบาร์โค้ด");
        return suggestions;
      }

      // Too short
      if (cleanBarcode.length < 8) {
        suggestions.push("บาร์โค้ดสั้นเกินไป (ต้องมีอย่างน้อย 8 หลัก)");

        // Suggest padding with zeros
        if (cleanBarcode.length >= 4) {
          const paddedTo12 = cleanBarcode.padStart(12, "0");
          const paddedTo13 = cleanBarcode.padStart(13, "0");
          suggestions.push(
            `ลองเพิ่ม 0 ข้างหน้า: ${paddedTo12} หรือ ${paddedTo13}`
          );
        }
      }

      // Too long
      if (cleanBarcode.length > 14) {
        suggestions.push("บาร์โค้ดยาวเกินไป (ไม่ควรเกิน 14 หลัก)");

        // Suggest trimming
        const trimmedFromStart = cleanBarcode.substring(
          cleanBarcode.length - 13
        );
        const trimmedFromEnd = cleanBarcode.substring(0, 13);
        suggestions.push(
          `ลองตัดส่วนเกิน: ${trimmedFromStart} หรือ ${trimmedFromEnd}`
        );
      }

      // Odd lengths that might need adjustment
      if ([9, 10, 11].includes(cleanBarcode.length)) {
        suggestions.push("ความยาวไม่ใช่รูปแบบมาตรฐาน");

        const paddedTo12 = cleanBarcode.padStart(12, "0");
        const paddedTo13 = cleanBarcode.padStart(13, "0");
        suggestions.push(`ลองเพิ่ม 0: ${paddedTo12} หรือ ${paddedTo13}`);
      }

      return suggestions;
    },
    [normalizeBarcode]
  );

  // Main validation function
  const validateBarcode = useCallback(
    (barcode: string): BarcodeValidationResult => {
      const normalizedBarcode = normalizeBarcode(barcode);
      const errors: string[] = [];
      const suggestions: string[] = [];

      // Basic validation
      if (!barcode) {
        errors.push("กรุณากรอกหมายเลขบาร์โค้ด");
        return {
          isValid: false,
          normalizedBarcode: "",
          errors,
          suggestions: ["กรุณาสแกนบาร์โค้ดหรือกรอกหมายเลข"],
        };
      }

      if (!normalizedBarcode) {
        errors.push("บาร์โค้ดต้องเป็นตัวเลขเท่านั้น");
        return {
          isValid: false,
          normalizedBarcode: "",
          errors,
          suggestions: ["กรุณากรอกเฉพาะตัวเลข 0-9"],
        };
      }

      // Format validation
      const detectedFormat = detectBarcodeFormat(normalizedBarcode);
      const isValidFormat = isValidBarcodeFormat(normalizedBarcode);

      if (!isValidFormat) {
        errors.push("รูปแบบบาร์โค้ดไม่ถูกต้อง");
        suggestions.push(...suggestBarcodeCorrections(normalizedBarcode));
      }

      // Advanced validations
      if (normalizedBarcode.length > 0) {
        // Check for suspicious patterns
        const allSameDigit = /^(\d)\1+$/.test(normalizedBarcode);
        if (allSameDigit) {
          errors.push("บาร์โค้ดที่มีเลขเดียวกันทั้งหมดอาจไม่ถูกต้อง");
        }

        // Check for sequential numbers
        const isSequential =
          normalizedBarcode ===
          normalizedBarcode
            .split("")
            .map((_, i) =>
              ((parseInt(normalizedBarcode[0]) + i) % 10).toString()
            )
            .join("");
        if (isSequential && normalizedBarcode.length > 4) {
          errors.push("บาร์โค้ดที่เป็นเลขเรียงกันอาจไม่ถูกต้อง");
        }
      }

      const isValid = errors.length === 0;

      return {
        isValid,
        normalizedBarcode,
        detectedFormat,
        errors,
        suggestions: isValid ? [] : suggestions,
      };
    },
    [
      normalizeBarcode,
      detectBarcodeFormat,
      isValidBarcodeFormat,
      suggestBarcodeCorrections,
    ]
  );

  return {
    normalizeBarcode,
    validateBarcode,
    isValidBarcodeFormat,
    suggestBarcodeCorrections,
  };
};
