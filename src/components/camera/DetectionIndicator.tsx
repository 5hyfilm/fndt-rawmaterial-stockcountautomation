// src/components/camera/DetectionIndicator.tsx
"use client";

import React from "react";
import { Scan, Zap } from "lucide-react";
import { Detection } from "../../types/detection";

interface DetectionIndicatorProps {
  detections: Detection[];
  isStreaming: boolean;
}

export const DetectionIndicator: React.FC<DetectionIndicatorProps> = ({
  detections,
  isStreaming,
}) => {
  if (!isStreaming) return null;

  return (
    <div className="absolute top-4 left-4 space-y-2">
      {/* Detection Counter */}
      {detections.length > 0 && (
        <div className="bg-fn-green/90 backdrop-blur-sm px-3 py-2 rounded-lg text-white border border-fn-green shadow-lg">
          <div className="flex items-center gap-2">
            <Zap size={16} className="animate-pulse" />
            <span className="text-sm font-medium">
              พบ {detections.length} บาร์โค้ด
            </span>
          </div>
        </div>
      )}

      {/* Scanning Status */}
      <div className="bg-black/60 backdrop-blur-sm px-3 py-2 rounded-lg text-white border border-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
          <Scan size={14} />
          <span className="text-xs">กำลังสแกน...</span>
        </div>
      </div>
    </div>
  );
};
