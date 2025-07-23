// Path: src/components/CameraSection.tsx
"use client";

import React, { useEffect } from "react";
import { Detection } from "../types/detection";
import { CameraHeader } from "./camera/CameraHeader";
import { CameraViewfinder } from "./camera/CameraViewfinder";

interface CameraSectionProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  containerRef: React.RefObject<HTMLDivElement>;
  isStreaming: boolean;
  processingQueue: number;
  detections: Detection[];
  startCamera: () => void;
  stopCamera: () => void;
  switchCamera: () => void;
  captureAndProcess: () => void;
  drawDetections: () => void;
  updateCanvasSize: () => void;
  fullScreen?: boolean; // New prop for full screen mode
  showHeader?: boolean; // New prop to control header visibility
  showGuideFrame?: boolean; // New prop to control guide frame visibility

  // ⭐ เพิ่ม torch props
  torchOn?: boolean;
  onToggleTorch?: () => void;
}

export const CameraSection: React.FC<CameraSectionProps> = ({
  videoRef,
  canvasRef,
  containerRef,
  isStreaming,
  processingQueue,
  detections,
  startCamera,
  stopCamera,
  switchCamera,
  captureAndProcess,
  drawDetections,
  updateCanvasSize,
  fullScreen = false,
  showHeader = true,
  showGuideFrame = true, // Show guide frame by default

  // ⭐ รับ torch props
  torchOn = false,
  onToggleTorch,
}) => {
  // Draw detections when detections change
  useEffect(() => {
    if (detections.length > 0) {
      drawDetections();
    }
  }, [detections, drawDetections]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      updateCanvasSize();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateCanvasSize]);

  // Full screen container (no card styling)
  if (fullScreen) {
    return (
      <div className="relative w-full h-full bg-black">
        {/* Floating Header (optional) */}
        {showHeader && (
          <div className="absolute top-0 left-0 right-0 z-20 safe-area-top">
            <div className="bg-black/50 backdrop-blur-sm border-b border-white/10">
              <CameraHeader
                isStreaming={isStreaming}
                processingQueue={processingQueue}
                onStartCamera={startCamera}
                onStopCamera={stopCamera}
                onSwitchCamera={switchCamera}
                onCaptureAndProcess={captureAndProcess}
                compact={true} // Use compact mode for overlay
                transparent={true} // Make header transparent
                // ⭐ ส่ง torch props
                torchOn={torchOn}
                onToggleTorch={onToggleTorch}
              />
            </div>
          </div>
        )}

        {/* Full Screen Camera Viewfinder */}
        <CameraViewfinder
          videoRef={videoRef}
          canvasRef={canvasRef}
          containerRef={containerRef}
          isStreaming={isStreaming}
          detections={detections}
          onLoadedMetadata={updateCanvasSize}
          fullScreen={true}
          showGuideFrame={showGuideFrame}
        />
      </div>
    );
  }

  // Regular card layout (existing behavior)
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header Section */}
      {showHeader && (
        <CameraHeader
          isStreaming={isStreaming}
          processingQueue={processingQueue}
          onStartCamera={startCamera}
          onStopCamera={stopCamera}
          onSwitchCamera={switchCamera}
          onCaptureAndProcess={captureAndProcess}
          // ⭐ ส่ง torch props
          torchOn={torchOn}
          onToggleTorch={onToggleTorch}
        />
      )}

      {/* Camera Viewfinder Section */}
      <div className="relative bg-gray-900">
        <CameraViewfinder
          videoRef={videoRef}
          canvasRef={canvasRef}
          containerRef={containerRef}
          isStreaming={isStreaming}
          detections={detections}
          onLoadedMetadata={updateCanvasSize}
          fullScreen={false}
          showGuideFrame={showGuideFrame}
        />
      </div>
    </div>
  );
};
