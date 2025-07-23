// src/components/activity/EmptyActivityState.tsx
"use client";

import React from "react";
import { Clock } from "lucide-react";

interface EmptyActivityStateProps {
  compact?: boolean;
}

export const EmptyActivityState: React.FC<EmptyActivityStateProps> = ({
  compact = false,
}) => {
  if (compact) {
    return (
      <div className="text-center py-4">
        <Clock className="w-6 h-6 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500 text-sm">ยังไม่มีกิจกรรม</p>
      </div>
    );
  }

  return (
    <div className="text-center py-8">
      <Clock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
      <p className="text-gray-500 text-sm">ยังไม่มีกิจกรรม</p>
      <p className="text-gray-400 text-xs">เริ่มสแกนสินค้าเพื่อดูกิจกรรม</p>
    </div>
  );
};
