// src/components/modals/LogoutConfirmationModal.tsx
"use client";

import React from "react";
import { LogOut, User, Clock, AlertTriangle, X } from "lucide-react";

interface LogoutConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  employeeName: string;
  branchCode: string;
  branchName: string;
  sessionTimeRemaining?: string;
  hasUnsavedData?: boolean;
  unsavedDataCount?: number;
}

export const LogoutConfirmationModal: React.FC<
  LogoutConfirmationModalProps
> = ({
  isOpen,
  onClose,
  onConfirm,
  employeeName,
  branchCode,
  branchName,
  sessionTimeRemaining,
  hasUnsavedData = false,
  unsavedDataCount = 0,
}) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 max-w-md w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <LogOut size={20} />
              </div>
              <div>
                <h2 className="text-lg font-semibold">ยืนยันการออกจากระบบ</h2>
                <p className="text-red-100 text-sm">
                  กรุณายืนยันก่อนออกจากระบบ
                </p>
              </div>
            </div>
            <button
              onClick={handleCancel}
              className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {/* Employee Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <User className="text-blue-600" size={16} />
              </div>
              <div>
                <div className="font-medium text-gray-900">{employeeName}</div>
                <div className="text-sm text-gray-600">
                  {branchCode} - {branchName}
                </div>
              </div>
            </div>

            {sessionTimeRemaining && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock size={14} />
                <span>เหลือเวลา: {sessionTimeRemaining}</span>
              </div>
            )}
          </div>

          {/* Warning if has unsaved data */}
          {hasUnsavedData && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-amber-600 mt-0.5" size={18} />
                <div>
                  <div className="font-medium text-amber-800">
                    คำเตือนการออกจากระบบ
                  </div>
                  <div className="text-sm text-amber-700 mt-1">
                    คุณมีข้อมูลสินค้า {unsavedDataCount} รายการที่ยังอยู่ใน
                    Inventory หากออกจากระบบตอนนี้ข้อมูลเหล่านี้จะหายไป
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Confirmation message */}
          {/* <div className="text-center text-gray-700 mb-6">
            คุณต้องการออกจากระบบใช่หรือไม่?
            {hasUnsavedData && (
              <div className="text-sm text-red-600 mt-2">
                ข้อมูลที่ยังไม่ได้บันทึกจะหายไป
              </div>
            )}
          </div> */}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors"
            >
              ยกเลิก
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <LogOut size={16} />
              ออกจากระบบ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
