// Path: ./src/hooks/useBarcodeDetection.tsx
"use client";

import { useCallback } from "react";
import { useCameraControl } from "./camera/useCameraControl";
import { useProductLookup } from "./product/useProductLookup";
import { useDetectionProcessor } from "./detection/useDetectionProcessor";
import { useCanvasRenderer } from "./canvas/useCanvasRenderer";

export const useBarcodeDetection = () => {
  // Sub-hooks
  const camera = useCameraControl();

  // 🔥 สร้าง callback สำหรับปิดกล้องเมื่อเจอสินค้า
  const handleProductFound = useCallback(() => {
    console.log("🎯 Product found! Stopping camera...");
    camera.stopCamera();
  }, [camera]);

  // ส่ง callback ไปยัง productLookup
  const productLookup = useProductLookup({
    onProductFound: handleProductFound,
  });

  const canvas = useCanvasRenderer();

  const detection = useDetectionProcessor({
    videoRef: camera.videoRef,
    lastDetectedCode: productLookup.lastDetectedCode,
    updateBarcode: productLookup.updateBarcode,
  });

  // Combined error handling
  const clearError = useCallback(() => {
    // Clear camera errors through camera hook if needed
    productLookup.clearProduct();
  }, [productLookup]);

  // Enhanced draw detections with all required params
  const drawDetections = useCallback(() => {
    canvas.drawDetections(
      detection.detections,
      productLookup.product,
      productLookup.detectedBarcodeType,
      camera.videoRef
    );
  }, [
    canvas,
    detection.detections,
    productLookup.product,
    productLookup.detectedBarcodeType,
    camera.videoRef,
  ]);

  // Manual scan function for inventory tab
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

  // Force rescan current view
  const rescanCurrentView = useCallback(async () => {
    if (camera.isStreaming) {
      await detection.captureAndProcess();
    }
  }, [camera, detection]);

  // Enhanced stop camera that resets everything
  const stopCamera = useCallback(() => {
    camera.stopCamera();
    detection.resetDetections();
  }, [camera, detection]);

  // 🔥 เพิ่มฟังก์ชันเคลียร์ทั้งหมดและรีสตาร์ทกล้อง (สำหรับสแกนต่อ)
  const restartForNextScan = useCallback(() => {
    console.log("🔄 Restarting for next scan...");
    productLookup.clearCurrentDetection();
    detection.resetDetections();
    // ไม่ต้องเปิดกล้องใหม่ - ให้ user กดเริ่มเอง
  }, [productLookup, detection]);

  return {
    // Refs (from camera and canvas)
    videoRef: camera.videoRef,
    canvasRef: canvas.canvasRef,
    containerRef: canvas.containerRef,

    // Camera state and actions
    isStreaming: camera.isStreaming,
    videoConstraints: camera.videoConstraints,
    startCamera: camera.startCamera,
    stopCamera,
    switchCamera: camera.switchCamera,

    // ⭐ เพิ่ม torch functionality จาก camera hook
    torchOn: camera.torchOn,
    toggleTorch: camera.toggleTorch,

    // Detection state and actions
    detections: detection.detections,
    processingQueue: detection.processingQueue,
    stats: detection.stats,
    captureAndProcess: detection.captureAndProcess,

    // Product state and actions
    product: productLookup.product,
    detectedBarcodeType: productLookup.detectedBarcodeType,
    isLoadingProduct: productLookup.isLoadingProduct,
    productError: productLookup.productError,
    lastDetectedCode: productLookup.lastDetectedCode,
    updateBarcode: productLookup.updateBarcode,
    clearProduct: productLookup.clearProduct,
    clearCurrentDetection: productLookup.clearCurrentDetection,

    // Canvas actions
    drawDetections,
    updateCanvasSize: canvas.updateCanvasSize,

    // Combined actions
    errors: camera.errors || productLookup.productError,
    clearError,
    manualScan,
    rescanCurrentView,
    restartForNextScan, // 🔥 ฟังก์ชันใหม่สำหรับเริ่มสแกนใหม่
  };
};
