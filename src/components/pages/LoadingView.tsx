// Path: src/components/pages/LoadingView.tsx
"use client";

import React from "react";

interface LoadingViewProps {
  message?: string;
}

export function LoadingView({
  message = "กำลังโหลดระบบ...",
}: LoadingViewProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-8 shadow-lg">
        <div className="animate-spin w-8 h-8 border-4 border-fn-green border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600 text-center">{message}</p>
      </div>
    </div>
  );
}
