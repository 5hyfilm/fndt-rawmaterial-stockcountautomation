// src/hooks/detection/types.ts
export interface Detection {
  xmin: number;
  ymin: number;
  xmax: number;
  ymax: number;
  confidence: number;
  class: number;
}

export interface Stats {
  rotation: number;
  method: string;
  confidence: number;
  fps: number;
  lastProcessTime: number;
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

export interface UseDetectionProcessorProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  lastDetectedCode: string;
  updateBarcode: (barcode: string) => Promise<void>;
}

export interface UseDetectionProcessorReturn {
  // State
  detections: Detection[];
  processingQueue: number;
  stats: Stats;

  // Actions
  captureAndProcess: () => Promise<void>;
  resetDetections: () => void;
}

export interface DetectionSettings {
  autoProcess: boolean;
  processInterval: number;
  maxQueue: number;
  confidence: number;
  enableRotationCorrection: boolean;
}
