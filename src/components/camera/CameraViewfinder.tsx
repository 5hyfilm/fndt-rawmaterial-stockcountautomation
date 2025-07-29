// src/components/camera/CameraViewfinder.tsx
// 🎥 Camera viewfinder component with consolidated types

"use client";

import React from "react";
import type { CameraViewfinderProps } from "../../types/camera"; // ✅ Use direct import
import { DetectionIndicator } from "./DetectionIndicator";
import { CameraOffOverlay } from "./CameraOffOverlay";
import { CameraGuideFrame } from "./CameraGuideFrame";

// =========================================
// 🎥 Camera Viewfinder Component
// =========================================

export const CameraViewfinder: React.FC<CameraViewfinderProps> = ({
  videoRef,
  canvasRef,
  containerRef,
  isStreaming,
  detections,
  onLoadedMetadata,
  fullScreen = false,
  showGuideFrame = true,
}) => {
  // =========================================
  // 🎨 Dynamic Styling
  // =========================================

  // Dynamic container classes based on full screen mode
  const containerClasses = fullScreen
    ? "relative w-full overflow-hidden"
    : "relative w-full";

  // Dynamic container styles
  const containerStyle = fullScreen
    ? {
        height: "100%",
        minHeight: "100%",
      }
    : { aspectRatio: "16/9" };

  // =========================================
  // 🖼️ Render
  // =========================================

  return (
    <div ref={containerRef} className={containerClasses} style={containerStyle}>
      {/* 📹 Video Element */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
        onLoadedMetadata={onLoadedMetadata}
      />

      {/* 🎨 Detection Overlay Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      />

      {/* 🎯 Camera Guide Frame - Show when streaming and no detections */}
      {isStreaming && showGuideFrame && detections.length === 0 && (
        <CameraGuideFrame />
      )}

      {/* 🔍 Detection Indicator */}
      <DetectionIndicator detections={detections} isStreaming={isStreaming} />

      {/* 📴 Camera Off Overlay */}
      {!isStreaming && <CameraOffOverlay />}
    </div>
  );
};
