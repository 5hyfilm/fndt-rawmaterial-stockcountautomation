// src/components/camera/CameraViewfinder.tsx
"use client";

import React from "react";
import { Detection } from "../../types/detection";
import { DetectionIndicator } from "./DetectionIndicator";
import { CameraOffOverlay } from "./CameraOffOverlay";
import { CameraGuideFrame } from "./CameraGuideFrame";

interface CameraViewfinderProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  containerRef: React.RefObject<HTMLDivElement>;
  isStreaming: boolean;
  detections: Detection[];
  onLoadedMetadata: () => void;
  fullScreen?: boolean; // New prop for full screen mode
  showGuideFrame?: boolean; // New prop to control guide frame visibility
}

export const CameraViewfinder: React.FC<CameraViewfinderProps> = ({
  videoRef,
  canvasRef,
  containerRef,
  isStreaming,
  detections,
  onLoadedMetadata,
  fullScreen = false,
  showGuideFrame = true, // Show guide frame by default
}) => {
  // Dynamic container classes based on full screen mode
  const containerClasses = fullScreen
    ? "relative w-full overflow-hidden" // ลบ h-screen ออก
    : "relative w-full";

  // Dynamic container styles
  const containerStyle = fullScreen
    ? {
        height: "100%", // ใช้ 100% ของ parent container
        minHeight: "100%",
      }
    : { aspectRatio: "16/9" }; // Keep aspect ratio for normal mode

  return (
    <div ref={containerRef} className={containerClasses} style={containerStyle}>
      {/* Video Element */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
        onLoadedMetadata={onLoadedMetadata}
      />

      {/* Detection Overlay Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      />

      {/* Camera Guide Frame - แสดงเฉพาะเมื่อกล้องเปิดและไม่มีการตรวจจับบาร์โค้ด */}
      {isStreaming && showGuideFrame && detections.length === 0 && (
        <CameraGuideFrame />
      )}

      {/* Detection Indicator */}
      <DetectionIndicator detections={detections} isStreaming={isStreaming} />

      {/* Camera Off Overlay */}
      {!isStreaming && <CameraOffOverlay />}
    </div>
  );
};
