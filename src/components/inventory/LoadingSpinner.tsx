// src/components/inventory/LoadingSpinner.tsx
"use client";

import React from "react";
import { RefreshCw } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "กำลังโหลด...",
  size = "md",
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <div className="text-center py-8">
        <RefreshCw
          className={`animate-spin ${sizeClasses[size]} text-fn-green mx-auto mb-3`}
        />
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};
