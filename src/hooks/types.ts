// src/hooks/types.ts
export * from "./camera/types";
export * from "./detection/types";
export * from "./product/types";
export * from "./canvas/types";
export * from "./barcode/types";

import {
  UseCameraControlReturn,
  UseDetectionProcessorReturn,
  // UseProductLookupReturn,
  UseCanvasRendererReturn,
} from "./";

export interface UseBarcodeDetectionReturn
  extends Omit<UseCameraControlReturn, "videoRef">,
    Omit<UseDetectionProcessorReturn, "">,
    // Omit<UseProductLookupReturn, "">,
    Omit<UseCanvasRendererReturn, ""> {
  // Combined refs
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  containerRef: React.RefObject<HTMLDivElement>;

  // Enhanced actions
  manualScan: () => Promise<void>;
  rescanCurrentView: () => Promise<void>;

  // Combined error handling
  errors: string | null;
  clearError: () => void;
}

export interface BarcodeDetectionConfig {
  camera: {
    defaultFacingMode: "environment" | "user";
    resolution: {
      width: number;
      height: number;
    };
    autoStart: boolean;
  };
  detection: {
    autoProcess: boolean;
    processInterval: number;
    maxQueue: number;
    enableDebouncing: boolean;
    debounceDelay: number;
  };
  product: {
    enableCaching: boolean;
    cacheExpiry: number;
    enableFallback: boolean;
    retryAttempts: number;
  };
  canvas: {
    enableDrawing: boolean;
    theme: "light" | "dark";
    showConfidence: boolean;
    showBarcodeType: boolean;
  };
}
