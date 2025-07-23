export interface Stats {
  rotation: number;
  method: string;
  confidence: number;
  fps: number;
  lastProcessTime: number;
}

export interface Detection {
  xmin: number;
  ymin: number;
  xmax: number;
  ymax: number;
  confidence: number;
  class: number;
}

export interface VideoConstraints {
  width: { ideal: number };
  height: { ideal: number };
  facingMode: "environment" | "user";
}

export interface BarcodeData {
  data: string;
  type: string;
  timestamp?: string;
  confidence?: number;
  rotation_angle?: number;
  decode_method?: string;
  position?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface APIResponse {
  success: boolean;
  detections?: Detection[];
  barcodes?: BarcodeData[];
  error?: string;
  confidence?: number;
  rotation_angle?: number;
  decode_method?: string;
  filename?: string;
  barcodes_found?: number;
  mock?: boolean;
  results?: Array<{
    type: string;
    data: string;
    confidence?: number;
    rotation_angle?: number;
    decode_method?: string;
    position: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    timestamp: string;
  }>;
}

// Additional utility types
export type CameraFacing = "environment" | "user";

export interface CameraState {
  isStreaming: boolean;
  facingMode: CameraFacing;
  resolution: {
    width: number;
    height: number;
  };
}

export interface ProcessingState {
  isProcessing: boolean;
  queue: number;
  maxQueue: number;
}

export interface DetectionResult {
  success: boolean;
  data?: string;
  confidence: number;
  processingTime: number;
  method: string;
  error?: string;
}

// Error types for better error handling
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

export interface ApiError extends Error {
  status?: number;
  code?: string;
}

// Hook return type for better type safety
export interface UseBarcodeDetectionReturn {
  // Refs
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  containerRef: React.RefObject<HTMLDivElement>;

  // State
  isStreaming: boolean;
  detections: Detection[];
  processingQueue: number;
  lastDetectedCode: string;
  stats: Stats;
  errors: string | null;
  videoConstraints: VideoConstraints;

  // Actions
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  switchCamera: () => void;
  captureAndProcess: () => Promise<void>;
  drawDetections: () => void;
  updateCanvasSize: () => void;
  clearError: () => void;
}
