// ./src/hooks/detection/useDetectionProcessor.tsx
"use client";

import { useState, useCallback } from "react";
import { Detection, Stats, APIResponse } from "../../types/detection";

interface UseDetectionProcessorProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  lastDetectedCode: string;
  updateBarcode: (barcode: string) => Promise<void>;
}

// Define proper error type instead of using any
interface ProcessingError {
  message: string;
  name?: string;
  code?: string;
  cause?: unknown;
}

// Type guard to check if error has message property
const isErrorWithMessage = (error: unknown): error is ProcessingError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  );
};

// Helper function to get error message
const getErrorMessage = (error: unknown): string => {
  if (isErrorWithMessage(error)) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "เกิดข้อผิดพลาดในการประมวลผลเฟรม";
};

export const useDetectionProcessor = ({
  videoRef,
  lastDetectedCode,
  updateBarcode,
}: UseDetectionProcessorProps) => {
  // State
  const [detections, setDetections] = useState<Detection[]>([]);
  const [processingQueue, setProcessingQueue] = useState(0);
  const [stats, setStats] = useState<Stats>({
    rotation: 0,
    method: "",
    confidence: 0,
    fps: 0,
    lastProcessTime: 0,
  });

  // Capture and process frame
  const captureAndProcess = useCallback(async () => {
    const video = videoRef.current;
    if (!video || processingQueue >= 3) return;

    try {
      setProcessingQueue((prev) => prev + 1);
      const startTime = Date.now();

      const captureCanvas = document.createElement("canvas");
      const ctx = captureCanvas.getContext("2d");

      if (!ctx) return;

      captureCanvas.width = video.videoWidth || 640;
      captureCanvas.height = video.videoHeight || 480;

      ctx.drawImage(video, 0, 0);

      const blob = await new Promise<Blob>((resolve, reject) => {
        captureCanvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Failed to create blob"));
            }
          },
          "image/jpeg",
          0.8
        );
      });

      const formData = new FormData();
      formData.append("image", blob, "frame.jpg");

      const response = await fetch("/api/detect-barcode", {
        method: "POST",
        body: formData,
      });

      const result: APIResponse = await response.json();

      if (result.success) {
        if (result.detections) {
          setDetections(result.detections);
        }

        if (result.barcodes && result.barcodes.length > 0) {
          const latestBarcode = result.barcodes[0];
          const barcodeData = latestBarcode.data;

          // Only update if it's a new barcode to prevent unnecessary API calls
          if (barcodeData && barcodeData !== lastDetectedCode) {
            console.log("🔍 New barcode detected:", barcodeData);
            await updateBarcode(barcodeData);
          }
        }

        setStats({
          rotation: result.rotation_angle || 0,
          method: result.decode_method || "",
          confidence: result.confidence || 0,
          fps: Math.round(1000 / 300),
          lastProcessTime: Date.now() - startTime,
        });
      } else {
        console.error("Detection failed:", result.error);
      }
    } catch (error: unknown) {
      // ✅ Fixed: Changed from 'any' to 'unknown'
      const errorMessage = getErrorMessage(error);
      console.error("Error processing frame:", error);
      throw new Error(`ข้อผิดพลาดในการประมวลผล: ${errorMessage}`);
    } finally {
      setProcessingQueue((prev) => Math.max(0, prev - 1));
    }
  }, [processingQueue, lastDetectedCode, updateBarcode, videoRef]);

  // Reset detections
  const resetDetections = useCallback(() => {
    setDetections([]);
    setProcessingQueue(0);
  }, []);

  return {
    // State
    detections,
    processingQueue,
    stats,

    // Actions
    captureAndProcess,
    resetDetections,
  };
};
