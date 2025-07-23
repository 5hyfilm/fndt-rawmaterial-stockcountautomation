// Path: src/components/ExportSuccessToast.tsx
"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle, X, FileText } from "lucide-react";

interface ExportSuccessToastProps {
  show: boolean;
  onClose: () => void;
  fileName?: string;
  itemCount?: number;
}

export const ExportSuccessToast: React.FC<ExportSuccessToastProps> = ({
  show,
  onClose,
  fileName,
  itemCount,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      // Auto close after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for animation to complete
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  if (!show && !isVisible) return null;

  return (
    <div
      className={`
        fixed z-50 transform transition-all duration-300 
        ${
          isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }
        
        // Mobile: full-width with safe margins
        top-4 left-4 right-4
        
        // Desktop: top-right corner as before
        sm:top-4 sm:left-auto sm:right-4 sm:max-w-sm
      `}
      style={{
        paddingTop: "max(env(safe-area-inset-top), 1rem)",
        paddingLeft: "max(env(safe-area-inset-left), 1rem)",
        paddingRight: "max(env(safe-area-inset-right), 1rem)",
      }}
    >
      <div
        className="
        bg-white border border-green-200 rounded-lg shadow-lg 
        p-3 sm:p-4 w-full
      "
      >
        <div className="flex items-start gap-2 sm:gap-3">
          {/* Success Icon */}
          <div
            className="
            bg-green-100 rounded-full p-1 flex-shrink-0 
            flex items-center justify-center
            min-w-[32px] min-h-[32px] sm:min-w-[28px] sm:min-h-[28px]
          "
          >
            <CheckCircle className="text-green-600 w-4 h-4 sm:w-5 sm:h-5" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-900 mb-1 text-sm sm:text-base">
              ส่งออกข้อมูลสำเร็จ!
            </div>

            <div className="text-gray-600 space-y-1 text-xs sm:text-sm">
              <div className="flex items-center gap-1">
                <FileText className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="truncate">
                  {fileName || "FNDT_inventory.csv"}
                </span>
              </div>

              {itemCount && (
                <div className="text-gray-600">
                  จำนวน {itemCount.toLocaleString()} รายการ
                </div>
              )}

              <div className="text-green-600 font-medium">
                ✓ ไฟล์ถูกดาวน์โหลดแล้ว
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="
              text-gray-400 hover:text-gray-600 transition-colors
              flex-shrink-0 rounded-md p-1 flex items-center justify-center
              min-w-[32px] min-h-[32px] sm:min-w-[24px] sm:min-h-[24px]
              hover:bg-gray-100 active:bg-gray-200
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1
            "
            aria-label="ปิดการแจ้งเตือน"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
