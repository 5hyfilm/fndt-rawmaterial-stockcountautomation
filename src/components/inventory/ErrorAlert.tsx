// Path: src/components/inventory/ErrorAlert.tsx
"use client";

import React from "react";
import { AlertTriangle, X } from "lucide-react";

interface ErrorAlertProps {
  message: string | null; // ✅ เปลี่ยนจาก "error" เป็น "message"
  onDismiss: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  message,
  onDismiss,
}) => {
  if (!message) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <AlertTriangle className="text-red-500" size={20} />
        <span className="text-red-700">{message}</span>
      </div>
      <button onClick={onDismiss} className="text-red-500 hover:text-red-700">
        <X size={16} />
      </button>
    </div>
  );
};
