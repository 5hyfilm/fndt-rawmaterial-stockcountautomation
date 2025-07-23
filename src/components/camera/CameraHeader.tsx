// Path: src/components/camera/CameraHeader.tsx
"use client";

import React from "react";
import { Camera, CameraOff, Scan, Flashlight } from "lucide-react";

interface CameraHeaderProps {
  isStreaming: boolean;
  processingQueue: number;
  onStartCamera: () => void;
  onStopCamera: () => void;
  onSwitchCamera: () => void;
  onCaptureAndProcess: () => void;
  compact?: boolean; // New prop for compact mode
  transparent?: boolean; // New prop for transparent background

  // ⭐ เพิ่ม torch props
  torchOn?: boolean;
  onToggleTorch?: () => void;
}

export const CameraStatusBadge: React.FC<{
  isStreaming: boolean;
  processingQueue: number;
  compact?: boolean;
}> = ({ isStreaming, processingQueue, compact = false }) => {
  if (processingQueue > 0) {
    return (
      <div
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 ${
          compact ? "text-xs" : "text-sm"
        }`}
      >
        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
        ประมวลผล ({processingQueue})
      </div>
    );
  }

  if (isStreaming) {
    return (
      <div
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-800 ${
          compact ? "text-xs" : "text-sm"
        }`}
      >
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        กำลังทำงาน
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-600 ${
        compact ? "text-xs" : "text-sm"
      }`}
    >
      <div className="w-2 h-2 bg-gray-400 rounded-full" />
      ปิดกล้อง
    </div>
  );
};

export const CameraHeader: React.FC<CameraHeaderProps> = ({
  isStreaming,
  processingQueue,
  onStartCamera,
  onStopCamera,
  onCaptureAndProcess,
  compact = false,
  transparent = false,

  // ⭐ รับ torch props
  torchOn = false,
  onToggleTorch,
}) => {
  // Dynamic styles based on props
  const headerClasses = `
    ${compact ? "px-3 py-2" : "px-4 py-3"}
    ${transparent ? "bg-transparent" : "bg-gray-50 border-b border-gray-200"}
    flex items-center justify-between
  `;

  const buttonSize = compact ? "p-1.5" : "p-2";
  const iconSize = compact ? 16 : 20;

  return (
    <div className={headerClasses}>
      {/* Title and Status */}
      <div className="flex items-center gap-3">
        <h3
          className={`${compact ? "text-sm" : "text-lg"} font-semibold ${
            transparent ? "text-white" : "text-gray-900"
          } flex items-center gap-2`}
        >
          <Camera size={compact ? 16 : 20} />
          สแกนบาร์โค้ด
        </h3>
        <CameraStatusBadge
          isStreaming={isStreaming}
          processingQueue={processingQueue}
          compact={compact}
        />
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-2">
        {/* Start/Stop Camera */}
        {isStreaming ? (
          <button
            onClick={onStopCamera}
            className={`${buttonSize} ${
              transparent
                ? "bg-white/20 hover:bg-white/30 text-white border border-white/30"
                : "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
            } rounded-lg transition-colors flex items-center justify-center`}
            title="หยุดกล้อง"
          >
            <CameraOff size={iconSize} />
          </button>
        ) : (
          <button
            onClick={onStartCamera}
            className={`${buttonSize} ${
              transparent
                ? "bg-white/20 hover:bg-white/30 text-white border border-white/30"
                : "bg-green-50 hover:bg-green-100 text-green-600 border border-green-200"
            } rounded-lg transition-colors flex items-center justify-center`}
            title="เปิดกล้อง"
          >
            <Camera size={iconSize} />
          </button>
        )}

        {/* ⭐ Torch Button - only show when streaming and torch function available */}
        {isStreaming && onToggleTorch && (
          <button
            onClick={onToggleTorch}
            className={`${buttonSize} ${
              torchOn
                ? transparent
                  ? "bg-yellow-500/80 hover:bg-yellow-500 text-white border border-yellow-400"
                  : "bg-yellow-500 hover:bg-yellow-600 text-white border border-yellow-500"
                : transparent
                ? "bg-white/20 hover:bg-white/30 text-white border border-white/30"
                : "bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200"
            } rounded-lg transition-colors flex items-center justify-center`}
            title={torchOn ? "ปิดไฟฉาย" : "เปิดไฟฉาย"}
          >
            <Flashlight size={iconSize} />
          </button>
        )}

        {/* Capture Button - only show when streaming */}
        {isStreaming && (
          <button
            onClick={onCaptureAndProcess}
            disabled={processingQueue > 0}
            className={`${buttonSize} ${
              transparent
                ? "bg-green-500/80 hover:bg-green-500 text-white border border-green-400 disabled:bg-white/10 disabled:text-white/50"
                : "bg-green-50 hover:bg-green-100 text-green-600 border border-green-200 disabled:bg-gray-50 disabled:text-gray-400"
            } rounded-lg transition-colors flex items-center justify-center disabled:cursor-not-allowed`}
            title="สแกนบาร์โค้ด"
          >
            <Scan size={iconSize} />
          </button>
        )}
      </div>
    </div>
  );
};
