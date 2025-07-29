// src/hooks/detection/useDetectionProcessor.tsx
"use client";

import { useState, useCallback } from "react";
import {
  Detection,
  Stats,
  APIResponse,
  UseDetectionProcessorProps,
  UseDetectionProcessorReturn,
} from "../../types/detection";

export const useDetectionProcessor = ({
  videoRef,
  lastDetectedCode,
  updateBarcode,
}: UseDetectionProcessorProps): UseDetectionProcessorReturn => {
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

  // Validate video readiness
  const isVideoReady = useCallback((video: HTMLVideoElement): boolean => {
    return (
      video.readyState >= 2 && // HAVE_CURRENT_DATA or higher
      video.videoWidth > 0 &&
      video.videoHeight > 0 &&
      !video.paused &&
      !video.ended
    );
  }, []);

  // Capture and process frame
  const captureAndProcess = useCallback(async () => {
    const video = videoRef.current;
    if (!video || processingQueue >= 3) return;

    // Enhanced video validation
    if (!isVideoReady(video)) {
      console.warn("Video not ready for capture:", {
        readyState: video.readyState,
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight,
        paused: video.paused,
        ended: video.ended,
      });
      return;
    }

    try {
      setProcessingQueue((prev) => prev + 1);
      const startTime = performance.now();

      // Create canvas and capture frame
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("ไม่สามารถสร้าง canvas context ได้");

      // Set canvas size with validation
      const width = video.videoWidth;
      const height = video.videoHeight;

      if (width <= 0 || height <= 0) {
        throw new Error(`Invalid video dimensions: ${width}x${height}`);
      }

      canvas.width = width;
      canvas.height = height;

      // Draw image to canvas
      ctx.drawImage(video, 0, 0, width, height);

      // Validate canvas has content
      const imageData = ctx.getImageData(
        0,
        0,
        Math.min(10, width),
        Math.min(10, height)
      );
      const hasContent = imageData.data.some((pixel) => pixel > 0);

      if (!hasContent) {
        throw new Error("Canvas appears to be empty");
      }

      // Convert to blob with enhanced error handling
      const blob = await new Promise<Blob>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Canvas toBlob timeout"));
        }, 5000); // 5 second timeout

        canvas.toBlob(
          (blob) => {
            clearTimeout(timeout);
            if (blob && blob.size > 0) {
              resolve(blob);
            } else {
              reject(
                new Error("ไม่สามารถแปลงเป็น blob ได้ - blob is null or empty")
              );
            }
          },
          "image/jpeg",
          0.8
        );
      });

      // Validate blob
      if (blob.size === 0) {
        throw new Error("Generated blob is empty");
      }

      // Prepare FormData
      const formData = new FormData();
      formData.append("image", blob, "frame.jpg");

      // Send to API
      const response = await fetch("/api/detect-barcode", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const result: APIResponse = await response.json();
      const processingTime = performance.now() - startTime;

      // Update stats
      setStats({
        rotation: result.rotation_angle || 0,
        method: result.decode_method || "unknown",
        confidence: result.confidence || 0,
        fps: Math.round(1000 / processingTime),
        lastProcessTime: processingTime,
      });

      // Update detections
      if (result.detections) {
        setDetections(result.detections);
      }

      // Handle barcode detection
      if (result.success && result.barcodes && result.barcodes.length > 0) {
        const barcode = result.barcodes[0];
        if (barcode.data !== lastDetectedCode) {
          await updateBarcode(barcode.data);
        }
      }
    } catch (error) {
      console.error("Detection error:", error);

      // Enhanced error logging
      if (error instanceof Error) {
        console.error("Error details:", {
          message: error.message,
          stack: error.stack,
          video: {
            readyState: video?.readyState,
            dimensions: `${video?.videoWidth}x${video?.videoHeight}`,
            currentTime: video?.currentTime,
          },
        });
      }

      setStats((prev) => ({ ...prev, fps: 0, lastProcessTime: 0 }));
    } finally {
      setProcessingQueue((prev) => Math.max(0, prev - 1));
    }
  }, [
    videoRef,
    processingQueue,
    lastDetectedCode,
    updateBarcode,
    isVideoReady,
  ]);

  // Reset detections
  const resetDetections = useCallback(() => {
    setDetections([]);
    setStats({
      rotation: 0,
      method: "",
      confidence: 0,
      fps: 0,
      lastProcessTime: 0,
    });
  }, []);

  // Update stats function
  const updateStats = useCallback((newStats: Partial<Stats>) => {
    setStats((prev) => ({ ...prev, ...newStats }));
  }, []);

  return {
    // State
    detections,
    processingQueue,
    lastDetectedCode,
    stats,
    isProcessing: processingQueue > 0,

    // Actions
    captureAndProcess,
    resetDetections,
    updateStats,
  };
};
