// ./src/components/forms/AddNewProductForm.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Save,
  Package,
  FileText,
  Hash,
  Scan,
  Edit3,
  Check,
} from "lucide-react";

interface NewProductData {
  barcode: string;
  description: string;
  countPieces: number;
}

interface FormErrors {
  barcode?: string;
  description?: string;
  countPieces?: string;
}

interface AddNewProductFormProps {
  isVisible: boolean;
  barcode: string;
  onClose: () => void;
  onSave: (productData: NewProductData) => Promise<boolean>;
}

// Input sanitization utilities
const sanitizeInput = (input: string): string => {
  return input
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/[<>\"'&]/g, (match) => {
      // Escape dangerous characters
      const escapeMap: { [key: string]: string } = {
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#x27;",
        "&": "&amp;",
      };
      return escapeMap[match] || match;
    })
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, "") // Remove event handlers
    .trim();
};

const sanitizeDescription = (input: string): string => {
  const sanitized = sanitizeInput(input);
  // Allow more characters for description but still safe
  return sanitized.replace(/[^a-zA-Z0-9ก-๙\s.\-(),\/]/g, "").slice(0, 500);
};

// Validation utilities
const validateDescription = (description: string): string | null => {
  const trimmed = description.trim();

  if (!trimmed) return "กรุณากรอกรายละเอียด";
  if (trimmed.length < 3) return "รายละเอียดต้องมีอย่างน้อย 3 ตัวอักษร";
  if (trimmed.length > 500) return "รายละเอียดไม่ควรเกิน 500 ตัวอักษร";

  // Check for suspicious patterns
  if (/script|alert|onerror|onload|javascript/i.test(trimmed)) {
    return "รายละเอียดมีรูปแบบที่ไม่อนุญาต";
  }

  return null;
};

const validateBarcode = (barcode: string): string | null => {
  const trimmed = barcode.trim();

  if (!trimmed) return "กรุณากรอกหมายเลขบาร์โค้ด";
  if (!/^\d{8,14}$/.test(trimmed)) return "บาร์โค้ดต้องเป็นตัวเลข 8-14 หลัก";

  return null;
};

const validateCount = (count: number): string | null => {
  if (count <= 0) return "จำนวนต้องมากกว่า 0";
  if (count > 99999) return "จำนวนไม่ควรเกิน 99,999";

  return null;
};

export const AddNewProductForm: React.FC<AddNewProductFormProps> = ({
  isVisible,
  barcode,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<NewProductData>({
    barcode: barcode,
    description: "",
    countPieces: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isBarcodeEditable, setIsBarcodeEditable] = useState(false);
  const barcodeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      barcode: barcode,
    }));
    setIsBarcodeEditable(false);
  }, [barcode]);

  const updateField = (
    field: keyof NewProductData,
    value: string | number
  ): void => {
    let sanitizedValue = value;

    if (typeof value === "string") {
      switch (field) {
        case "description":
          sanitizedValue = sanitizeDescription(value);
          break;
        case "barcode":
          sanitizedValue = value.replace(/\D/g, "").slice(0, 14);
          break;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [field]: sanitizedValue,
    }));

    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const formatBarcode = (value: string): string => {
    const numbersOnly = value.replace(/\D/g, "");
    return numbersOnly.slice(0, 14);
  };

  const getBarcodeValidationStatus = (): {
    isValid: boolean;
    message: string;
  } => {
    const barcode = formData.barcode.trim();
    if (!barcode) {
      return { isValid: false, message: "กรุณากรอกหมายเลขบาร์โค้ด" };
    }
    if (barcode.length < 8) {
      return {
        isValid: false,
        message: `ต้องการอีก ${8 - barcode.length} หลัก`,
      };
    }
    if (barcode.length > 14) {
      return { isValid: false, message: "ยาวเกินไป" };
    }
    if (!/^\d+$/.test(barcode)) {
      return { isValid: false, message: "ต้องเป็นตัวเลขเท่านั้น" };
    }
    return { isValid: true, message: "รูปแบบถูกต้อง" };
  };

  const toggleBarcodeEditable = (): void => {
    const newEditableState = !isBarcodeEditable;
    setIsBarcodeEditable(newEditableState);

    if (newEditableState && errors.barcode) {
      setErrors((prev) => ({
        ...prev,
        barcode: undefined,
      }));
    }

    if (newEditableState) {
      setTimeout(() => {
        barcodeInputRef.current?.focus();
        barcodeInputRef.current?.select();
      }, 100);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const barcodeError = validateBarcode(formData.barcode);
    if (barcodeError) newErrors.barcode = barcodeError;

    const descriptionError = validateDescription(formData.description);
    if (descriptionError) newErrors.description = descriptionError;

    const countPiecesError = validateCount(formData.countPieces);
    if (countPiecesError) newErrors.countPieces = countPiecesError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (): Promise<void> => {
    if (!validateForm()) {
      console.log("❌ Form validation failed");
      return;
    }

    setIsLoading(true);
    try {
      // Final sanitization before saving
      const sanitizedData: NewProductData = {
        ...formData,
        description: sanitizeDescription(formData.description),
        barcode: formData.barcode.trim(),
      };

      console.log("💾 Submitting sanitized form data:", sanitizedData);
      const success = await onSave(sanitizedData);
      if (success) {
        console.log("✅ Product saved successfully");
        handleClose();
      } else {
        console.error("❌ Failed to save product");
      }
    } catch (error) {
      console.error("❌ Error saving product:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = (): void => {
    setFormData({
      barcode: "",
      description: "",
      countPieces: 0,
    });
    setErrors({});
    setIsBarcodeEditable(false);
    onClose();
  };

  const handleCountChange = (value: string): void => {
    const numValue = parseInt(value) || 0;
    const clampedValue = Math.max(0, Math.min(99999, numValue));
    updateField("countPieces", clampedValue);
  };

  if (!isVisible) return null;

  const barcodeValidation = getBarcodeValidationStatus();

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300"
        onClick={handleClose}
      />

      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
        <div
          className="bg-white rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-4 py-3 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Package size={20} className="text-fn-green" />
                เพิ่มสินค้าใหม่
              </h2>
              <button
                onClick={handleClose}
                disabled={isLoading}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-4">
              {/* Barcode Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Scan size={16} />
                  หมายเลขบาร์โค้ด
                </label>
                <div className="flex gap-2">
                  <input
                    ref={barcodeInputRef}
                    type="text"
                    value={formData.barcode}
                    onChange={(e) =>
                      updateField("barcode", formatBarcode(e.target.value))
                    }
                    readOnly={!isBarcodeEditable}
                    maxLength={14}
                    className={`flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-fn-green focus:border-transparent transition-colors text-sm ${
                      errors.barcode
                        ? "border-red-500"
                        : barcodeValidation.isValid
                        ? "border-green-500"
                        : "border-gray-300"
                    } ${
                      !isBarcodeEditable
                        ? "bg-gray-50 text-gray-600"
                        : "bg-white"
                    }`}
                    placeholder="กรอกหมายเลขบาร์โค้ด"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={toggleBarcodeEditable}
                    disabled={isLoading}
                    className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                    {isBarcodeEditable ? (
                      <Check size={16} className="text-green-600" />
                    ) : (
                      <Edit3 size={16} className="text-gray-600" />
                    )}
                  </button>
                </div>

                <p
                  className={`text-xs mt-1 ${
                    errors.barcode
                      ? "text-red-500"
                      : barcodeValidation.isValid
                      ? "text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  {errors.barcode || barcodeValidation.message}
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FileText size={16} />
                  รายละเอียดสินค้า
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  rows={3}
                  maxLength={500}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-fn-green focus:border-transparent transition-colors text-sm resize-none ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="กรอกรายละเอียดสินค้า"
                  disabled={isLoading}
                />
                {formData.description.length > 400 && (
                  <p className="text-yellow-600 text-xs mt-1">
                    ความยาว: {formData.description.length}/500 ตัวอักษร
                  </p>
                )}
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Count Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Hash size={16} />
                  จำนวน (กิโลกรัม)
                </label>
                <input
                  type="number"
                  value={formData.countPieces}
                  onChange={(e) => handleCountChange(e.target.value)}
                  min="1"
                  max="99999"
                  step="0.1"
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-fn-green focus:border-transparent transition-colors text-sm ${
                    errors.countPieces ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="กรอกจำนวนกิโลกรัม"
                  disabled={isLoading}
                />
                {errors.countPieces && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.countPieces}
                  </p>
                )}
              </div>

              {/* Summary */}
              {formData.countPieces > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">จะเพิ่ม: </span>
                    {formData.countPieces} กิโลกรัม
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    บาร์โค้ด: {formData.barcode}
                  </p>
                </div>
              )}

              <div className="h-2"></div>
            </div>
          </div>

          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex-shrink-0">
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm font-medium"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-fn-green text-white rounded-md hover:bg-fn-green/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm font-medium"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    กำลังบันทึก...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    บันทึก
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
