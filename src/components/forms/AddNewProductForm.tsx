// ./src/components/forms/AddNewProductForm.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Save,
  Package,
  Tag,
  FileText,
  Hash,
  Scan,
  Edit3,
  Check,
  ChevronDown,
} from "lucide-react";

// ✅ Product Group Options for dropdown
const PRODUCT_GROUP_OPTIONS = [
  "STM", // Sterilized Milk
  "BB Gold", // Bear Brand Gold
  "EVAP", // Evaporated
  "SBC", // Sweetened Beverage Creamer
  "SCM", // Sweetened Condensed Milk
  "Magnolia UHT", // Magnolia UHT
  "NUTRISOY", // Nutriwell
  "Gummy", // Gummy candy
];

interface NewProductData {
  barcode: string;
  productName: string;
  productGroup: string;
  description: string;
  countCs: number;
  countDsp: number; // ✅ เพิ่ม DSP
  countPieces: number;
}

// ✅ FIX: สร้าง interface แยกสำหรับ form errors
interface FormErrors {
  barcode?: string;
  productName?: string;
  productGroup?: string;
  description?: string;
  countCs?: string;
  countDsp?: string; // ✅ เพิ่ม DSP error
  countPieces?: string;
}

interface AddNewProductFormProps {
  isVisible: boolean;
  barcode: string;
  onClose: () => void;
  onSave: (productData: NewProductData) => Promise<boolean>;
}

export const AddNewProductForm: React.FC<AddNewProductFormProps> = ({
  isVisible,
  barcode,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<NewProductData>({
    barcode: barcode,
    productName: "",
    productGroup: "",
    description: "",
    countCs: 0,
    countDsp: 0, // ✅ เพิ่ม DSP
    countPieces: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isBarcodeEditable, setIsBarcodeEditable] = useState(false);
  const barcodeInputRef = useRef<HTMLInputElement>(null);

  // ✅ Update barcode when prop changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      barcode: barcode,
    }));
    setIsBarcodeEditable(false);
  }, [barcode]);

  // Update form data
  const updateField = (field: keyof NewProductData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  // ✅ Helper function สำหรับ format barcode
  const formatBarcode = (value: string): string => {
    const numbersOnly = value.replace(/\D/g, "");
    return numbersOnly.slice(0, 14);
  };

  // ✅ Get barcode validation status
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

  // ✅ Toggle barcode editable state
  const toggleBarcodeEditable = () => {
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

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // ✅ Barcode validation
    if (!formData.barcode.trim()) {
      newErrors.barcode = "กรุณากรอกหมายเลขบาร์โค้ด";
    } else if (!/^\d{8,14}$/.test(formData.barcode.trim())) {
      newErrors.barcode = "บาร์โค้ดต้องเป็นตัวเลข 8-14 หลัก";
    }

    if (!formData.productName.trim()) {
      newErrors.productName = "กรุณากรอกรหัสสินค้า";
    }

    if (!formData.productGroup.trim()) {
      newErrors.productGroup = "กรุณาเลือกหมวดหมู่สินค้า";
    } else if (!PRODUCT_GROUP_OPTIONS.includes(formData.productGroup)) {
      newErrors.productGroup = "กรุณาเลือกหมวดหมู่สินค้าที่ถูกต้อง";
    }

    if (!formData.description.trim()) {
      newErrors.description = "กรุณากรอกรายละเอียด";
    }

    if (formData.countCs < 0) {
      newErrors.countCs = "จำนวนลังต้องไม่ติดลบ";
    }

    // ✅ เพิ่ม validation สำหรับ DSP
    if (formData.countDsp < 0) {
      newErrors.countDsp = "จำนวนแพ็คต้องไม่ติดลบ";
    }

    if (formData.countPieces < 0) {
      newErrors.countPieces = "จำนวนชิ้นต้องไม่ติดลบ";
    }

    // ✅ ตรวจสอบว่าต้องมีอย่างน้อย 1 หน่วย
    if (
      formData.countCs === 0 &&
      formData.countDsp === 0 &&
      formData.countPieces === 0
    ) {
      newErrors.countCs = "กรุณากรอกจำนวนอย่างน้อย 1 ช่อง";
      newErrors.countDsp = "";
      newErrors.countPieces = "";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSave = async () => {
    if (!validateForm()) {
      console.log("❌ Form validation failed");
      return;
    }

    setIsLoading(true);
    try {
      console.log("💾 Submitting form data:", formData);
      const success = await onSave(formData);
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

  // Handle close
  const handleClose = () => {
    setFormData({
      barcode: "",
      productName: "",
      productGroup: "",
      description: "",
      countCs: 0,
      countDsp: 0, // ✅ รีเซ็ต DSP
      countPieces: 0,
    });
    setErrors({});
    setIsBarcodeEditable(false);
    onClose();
  };

  // Don't render if not visible
  if (!isVisible) return null;

  const barcodeValidation = getBarcodeValidationStatus();

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
        <div
          className="bg-white rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
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

          {/* Content - เพิ่ม scroll */}
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

                {/* Barcode validation feedback */}
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

              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Tag size={16} />
                  รหัสสินค้า
                </label>
                <input
                  type="text"
                  value={formData.productName}
                  onChange={(e) => updateField("productName", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-fn-green focus:border-transparent transition-colors text-sm ${
                    errors.productName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="กรอกรหัสสินค้า"
                  disabled={isLoading}
                />
                {errors.productName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.productName}
                  </p>
                )}
              </div>

              {/* Product Group */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Package size={16} />
                  หมวดหมู่สินค้า
                </label>
                <div className="relative">
                  <select
                    value={formData.productGroup}
                    onChange={(e) =>
                      updateField("productGroup", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-fn-green focus:border-transparent transition-colors text-sm appearance-none bg-white ${
                      errors.productGroup ? "border-red-500" : "border-gray-300"
                    }`}
                    disabled={isLoading}
                  >
                    <option value="">เลือกหมวดหมู่สินค้า</option>
                    {PRODUCT_GROUP_OPTIONS.map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
                {errors.productGroup && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.productGroup}
                  </p>
                )}
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
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-fn-green focus:border-transparent transition-colors text-sm resize-none ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="กรอกรายละเอียดสินค้า"
                  disabled={isLoading}
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* ✅ Count Section - ปรับเป็น 3 คอลัมน์ */}
              <div className="grid grid-cols-3 gap-2">
                {/* Count CS */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <Hash size={12} />
                    ลัง (cs)
                  </label>
                  <input
                    type="number"
                    value={formData.countCs}
                    onChange={(e) =>
                      updateField("countCs", parseInt(e.target.value) || 0)
                    }
                    min="0"
                    className={`w-full px-2 py-1.5 border rounded-md focus:ring-1 focus:ring-fn-green focus:border-transparent transition-colors text-xs ${
                      errors.countCs ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="0"
                    disabled={isLoading}
                  />
                  {errors.countCs && (
                    <p className="text-red-500 text-xs mt-0.5">
                      {errors.countCs}
                    </p>
                  )}
                </div>

                {/* ✅ Count DSP - ใหม่ */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <Hash size={12} />
                    แพ็ค (dsp)
                  </label>
                  <input
                    type="number"
                    value={formData.countDsp}
                    onChange={(e) =>
                      updateField("countDsp", parseInt(e.target.value) || 0)
                    }
                    min="0"
                    className={`w-full px-2 py-1.5 border rounded-md focus:ring-1 focus:ring-fn-green focus:border-transparent transition-colors text-xs ${
                      errors.countDsp ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="0"
                    disabled={isLoading}
                  />
                  {errors.countDsp && (
                    <p className="text-red-500 text-xs mt-0.5">
                      {errors.countDsp}
                    </p>
                  )}
                </div>

                {/* Count Pieces */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <Hash size={12} />
                    ชิ้น (ea)
                  </label>
                  <input
                    type="number"
                    value={formData.countPieces}
                    onChange={(e) =>
                      updateField("countPieces", parseInt(e.target.value) || 0)
                    }
                    min="0"
                    className={`w-full px-2 py-1.5 border rounded-md focus:ring-1 focus:ring-fn-green focus:border-transparent transition-colors text-xs ${
                      errors.countPieces ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="0"
                    disabled={isLoading}
                  />
                  {errors.countPieces && (
                    <p className="text-red-500 text-xs mt-0.5">
                      {errors.countPieces}
                    </p>
                  )}
                </div>
              </div>

              {/* ✅ Summary - อัปเดตให้รองรับ DSP */}
              {(formData.countCs > 0 ||
                formData.countDsp > 0 ||
                formData.countPieces > 0) && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">จะเพิ่ม: </span>
                    {[
                      formData.countCs > 0 && `${formData.countCs} ลัง`,
                      formData.countDsp > 0 && `${formData.countDsp} แพ็ค`,
                      formData.countPieces > 0 &&
                        `${formData.countPieces} ชิ้น`,
                    ]
                      .filter(Boolean)
                      .join(" + ")}
                  </p>
                </div>
              )}

              {/* Add some bottom padding for better mobile scrolling */}
              <div className="h-2"></div>
            </div>
          </div>

          {/* Footer */}
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
