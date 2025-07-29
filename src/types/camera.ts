// src/types/camera.ts
// 🎯 Consolidated Camera Type Definitions - Single Source of Truth

import React from "react";

// =========================================
// 🎥 Core Camera Types
// =========================================

/**
 * Video constraints for camera setup
 */
export interface VideoConstraints {
  width: { ideal: number };
  height: { ideal: number };
  facingMode: "environment" | "user";
}

/**
 * Camera facing mode type
 */
export type CameraFacing = "environment" | "user";

/**
 * Current camera state
 */
export interface CameraState {
  isStreaming: boolean;
  facingMode: CameraFacing;
  resolution: {
    width: number;
    height: number;
  };
}

/**
 * Camera capabilities from device
 */
export interface CameraCapabilities {
  facingMode?: string[];
  width?: {
    min: number;
    max: number;
  };
  height?: {
    min: number;
    max: number;
  };
  frameRate?: {
    min: number;
    max: number;
  };
}

/**
 * Camera settings configuration
 */
export interface CameraSettings {
  resolution: {
    width: number;
    height: number;
  };
  facingMode: CameraFacing;
  frameRate: number;
  autoFocus: boolean;
  torch?: boolean; // For devices that support flashlight
}

// =========================================
// 🚨 Error Types
// =========================================

/**
 * Camera-specific error types
 */
export interface CameraError extends Error {
  name:
    | "NotAllowedError"
    | "NotFoundError"
    | "NotReadableError"
    | "OverconstrainedError"
    | "SecurityError"
    | "TypeError"
    | "AbortError";
}

// =========================================
// 📝 Note: Media Device Extensions
// =========================================
// Global media device type extensions are defined in src/types/global.d.ts
// to avoid declaration conflicts and maintain proper global scope

// =========================================
// 🪝 Hook Return Types
// =========================================

/**
 * Return type for useCameraControl hook
 */
export interface UseCameraControlReturn {
  // Refs
  videoRef: React.RefObject<HTMLVideoElement>;

  // State
  isStreaming: boolean;
  errors: string | null;
  videoConstraints: VideoConstraints;
  torchOn: boolean; // ✅ Fixed: Required instead of optional

  // Actions
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  switchCamera: () => void;
  toggleTorch: () => void; // ✅ Fixed: Required instead of optional
  setVideoConstraints: React.Dispatch<React.SetStateAction<VideoConstraints>>;
}

// =========================================
// 📱 Component Props Types
// =========================================

/**
 * Detection interface for camera viewfinder
 */
interface Detection {
  xmin: number;
  ymin: number;
  xmax: number;
  ymax: number;
  confidence: number;
  class: number;
}

/**
 * Camera viewfinder component props
 */
export interface CameraViewfinderProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  containerRef: React.RefObject<HTMLDivElement>;
  isStreaming: boolean;
  detections: Detection[]; // ✅ Fixed: Use proper Detection type instead of any[]
  onLoadedMetadata: () => void;
  fullScreen?: boolean;
  showGuideFrame?: boolean;
}

/**
 * Camera control panel props
 */
export interface CameraControlsProps {
  isStreaming: boolean;
  torchOn?: boolean;
  facingMode: CameraFacing;
  onStartCamera: () => Promise<void>;
  onStopCamera: () => void;
  onSwitchCamera: () => void;
  onToggleTorch?: () => void;
  disabled?: boolean;
}

// =========================================
// 🔧 Utility Types
// =========================================

/**
 * Camera permission state
 */
export type CameraPermissionState = "granted" | "denied" | "prompt" | "unknown";

/**
 * Camera initialization options
 */
export interface CameraInitOptions {
  autoStart?: boolean;
  defaultFacingMode?: CameraFacing;
  defaultResolution?: {
    width: number;
    height: number;
  };
  enableTorch?: boolean;
}

/**
 * Camera status info
 */
export interface CameraStatus {
  isSupported: boolean;
  isStreaming: boolean;
  permissionState: CameraPermissionState;
  activeDevice?: MediaDeviceInfo;
  availableDevices: MediaDeviceInfo[];
  currentResolution?: {
    width: number;
    height: number;
  };
}

// =========================================
// 📊 Performance & Stats Types
// =========================================

/**
 * Camera performance statistics
 */
export interface CameraStats {
  frameRate: number;
  resolution: {
    width: number;
    height: number;
  };
  bytesPerSecond: number;
  lastUpdateTime: number;
}

// Export everything for easy importing
export type {
  // Re-export core types for backwards compatibility
  VideoConstraints as CameraVideoConstraints,
  CameraState as CameraStreamState,
  CameraError as CameraAccessError,
};
