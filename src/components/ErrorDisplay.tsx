"use client";

import React from "react";
import { AlertTriangle, X, RefreshCw } from "lucide-react";

interface ErrorDisplayProps {
  error: string;
  onDismiss: () => void;
  onRetry?: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onDismiss,
  onRetry,
}) => {
  if (!error) return null;

  return (
    <div className="bg-red-50 border border-fn-red/30 rounded-xl p-4 shadow-lg animate-in slide-in-from-top duration-300">
      <div className="flex items-start gap-3">
        <div className="bg-fn-red/10 p-2 rounded-lg border border-fn-red/20">
          <AlertTriangle className="fn-red flex-shrink-0" size={20} />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="fn-red font-semibold mb-1">เกิดข้อผิดพลาด</h3>
          <p className="text-gray-700 text-sm leading-relaxed break-words">
            {error}
          </p>

          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 bg-fn-red hover:bg-fn-red/90 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm transition-colors border border-fn-red shadow-sm"
            >
              <RefreshCw size={14} />
              ลองใหม่
            </button>
          )}
        </div>

        <button
          onClick={onDismiss}
          className="fn-red hover:text-red-600 flex-shrink-0 p-1 hover:bg-fn-red/10 rounded transition-colors"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};
