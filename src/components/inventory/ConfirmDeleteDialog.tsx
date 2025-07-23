// Path: src/components/inventory/ConfirmDeleteDialog.tsx
"use client";

import React from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";

interface ConfirmDeleteDialogProps {
  isOpen: boolean;
  itemCount?: number; // ✅ เพิ่ม optional สำหรับ backward compatibility
  onConfirm: () => void;
  onCancel: () => void;
  // ✅ เพิ่ม props ใหม่ที่ InventoryDisplay.tsx ใช้
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
}

export const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({
  isOpen,
  itemCount,
  onConfirm,
  onCancel,
  // ✅ รับ props ใหม่พร้อม default values
  title = "ยืนยันการลบข้อมูล",
  message,
  confirmText = "ยืนยัน",
  cancelText = "ยกเลิก",
  type = "danger",
}) => {
  if (!isOpen) return null;

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  // ✅ สร้าง default message ถ้าไม่มี
  const defaultMessage =
    itemCount !== undefined
      ? `คุณกำลังจะลบข้อมูล inventory ทั้งหมด (${itemCount} รายการ) การดำเนินการนี้ไม่สามารถย้อนกลับได้`
      : "คุณแน่ใจหรือไม่ที่จะดำเนินการนี้?";

  const displayMessage = message || defaultMessage;

  // ✅ สร้าง color scheme ตาม type
  const colorScheme = {
    danger: {
      headerBg: "bg-gradient-to-r from-red-500 to-red-600",
      buttonBg: "bg-red-600 hover:bg-red-700",
      warningBg: "bg-red-50 border-red-200",
      warningText: "text-red-800",
      warningIcon: "text-red-600",
    },
    warning: {
      headerBg: "bg-gradient-to-r from-red-500 to-red-600",
      buttonBg: "bg-red-600 hover:bg-red-700",
      warningBg: "bg-red-50 border-red-200",
      warningText: "text-red-800",
      warningIcon: "text-red-600",
    },
    info: {
      headerBg: "bg-gradient-to-r from-blue-500 to-blue-600",
      buttonBg: "bg-blue-600 hover:bg-blue-700",
      warningBg: "bg-blue-50 border-blue-200",
      warningText: "text-blue-800",
      warningIcon: "text-blue-600",
    },
  };

  const colors = colorScheme[type];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className={`${colors.headerBg} text-white px-6 py-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Trash2 size={20} />
              </div>
              <div>
                <h2 className="text-lg font-semibold">{title}</h2>
                <p className="text-white/90 text-sm">
                  กรุณายืนยันก่อนดำเนินการ
                </p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {/* Warning message */}
          <div className={`${colors.warningBg} border rounded-lg p-4 mb-4`}>
            <div className="flex items-start gap-3">
              <AlertTriangle
                className={`${colors.warningIcon} mt-0.5`}
                size={18}
              />
              <div>
                <div className={`font-medium ${colors.warningText}`}>
                  {itemCount !== undefined ? "ข้อมูลที่จะถูกลบ" : "การยืนยัน"}
                </div>
                <div
                  className={`text-sm ${colors.warningText.replace(
                    "800",
                    "700"
                  )} mt-1`}
                >
                  {displayMessage}
                </div>
              </div>
            </div>
          </div>

          {/* Confirmation message */}
          <div className="text-center text-gray-700 mb-6">
            {itemCount !== undefined
              ? "คุณต้องการลบข้อมูล inventory ทั้งหมดใช่หรือไม่?"
              : "คุณต้องการดำเนินการต่อหรือไม่?"}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-2 ${colors.buttonBg} text-white rounded-lg transition-colors font-medium`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
