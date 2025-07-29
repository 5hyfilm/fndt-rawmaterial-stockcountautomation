// Path: src/hooks/useBarcodeDetection.tsx
"use client";

import { useCallback } from "react";
import { useCameraControl } from "./camera/useCameraControl";
import { useProductLookup } from "./product/useProductLookup";
import { useDetectionProcessor } from "./detection/useDetectionProcessor";
import { useCanvasRenderer } from "./canvas/useCanvasRenderer";
import type { UseBarcodeDetectionReturn } from "./types";

export const useBarcodeDetection = (): UseBarcodeDetectionReturn => {
  // =========================================
  // 🎥 Camera Control
  // =========================================
  const camera = useCameraControl();

  // =========================================
  // 🛒 Product Lookup with Callback
  // =========================================
  const handleProductFound = useCallback(() => {
    console.log("🎯 Product found! Stopping camera...");
    camera.stopCamera();
  }, [camera]);

  const productLookup = useProductLookup({
    onProductFound: handleProductFound,
  });

  // =========================================
  // 🎨 Canvas Rendering
  // =========================================
  const canvas = useCanvasRenderer();

  // =========================================
  // 🔍 Detection Processing
  // =========================================
  const detection = useDetectionProcessor({
    videoRef: camera.videoRef,
    lastDetectedCode: productLookup.lastDetectedCode,
    updateBarcode: productLookup.updateBarcode,
  });

  // =========================================
  // 🎛️ Combined Actions
  // =========================================
  const clearError = useCallback(() => {
    productLookup.clearProduct();
  }, [productLookup]);

  // ✅ FIXED: Updated parameter name to match new canvas interface
  const drawDetections = useCallback(() => {
    canvas.drawDetections(
      detection.detections,
      productLookup.product,
      productLookup.detectedBarcodeType, // This is ProductUnitType, not BarcodeType
      camera.videoRef
    );
  }, [
    canvas,
    detection.detections,
    productLookup.product,
    productLookup.detectedBarcodeType,
    camera.videoRef,
  ]);

  const manualScan = useCallback(async () => {
    if (!camera.isStreaming) {
      await camera.startCamera();
      setTimeout(() => {
        detection.captureAndProcess();
      }, 1000);
    } else {
      await detection.captureAndProcess();
    }
  }, [camera, detection]);

  const rescanCurrentView = useCallback(async () => {
    if (camera.isStreaming) {
      await detection.captureAndProcess();
    }
  }, [camera, detection]);

  const stopCamera = useCallback(() => {
    camera.stopCamera();
    detection.resetDetections();
  }, [camera, detection]);

  const restartForNextScan = useCallback(() => {
    console.log("🔄 Restarting for next scan...");
    productLookup.clearCurrentDetection();
    detection.resetDetections();
  }, [productLookup, detection]);

  // =========================================
  // 📤 Return Combined Interface
  // =========================================
  return {
    // 📚 Refs
    videoRef: camera.videoRef,
    canvasRef: canvas.canvasRef,
    containerRef: canvas.containerRef,

    // 🎥 Camera state and actions
    isStreaming: camera.isStreaming,
    videoConstraints: camera.videoConstraints,
    startCamera: camera.startCamera,
    stopCamera,
    switchCamera: camera.switchCamera,
    setVideoConstraints: camera.setVideoConstraints,

    // 🔦 Torch control
    torchOn: camera.torchOn,
    toggleTorch: camera.toggleTorch,

    // 🔍 Detection state and actions
    detections: detection.detections,
    processingQueue: detection.processingQueue,
    stats: detection.stats,
    captureAndProcess: detection.captureAndProcess,
    resetDetections: detection.resetDetections,
    lastDetectedCode: productLookup.lastDetectedCode,

    // 🛒 Product lookup state
    product: productLookup.product,
    detectedBarcodeType: productLookup.detectedBarcodeType, // ProductUnitType
    isLoadingProduct: productLookup.isLoadingProduct,
    productError: productLookup.productError,
    clearProduct: productLookup.clearProduct, // ✅ FIXED: Added missing property

    // 🎨 Canvas actions
    drawDetections,
    updateCanvasSize: canvas.updateCanvasSize,

    // 🎛️ Enhanced actions
    manualScan,
    rescanCurrentView,
    restartForNextScan,

    // 🚨 Combined error handling
    errors: camera.errors || productLookup.productError,
    clearError,
  };
};
