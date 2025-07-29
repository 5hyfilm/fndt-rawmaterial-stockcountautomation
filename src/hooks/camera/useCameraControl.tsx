// src/hooks/camera/useCameraControl.tsx

"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import type { VideoConstraints, CameraError } from "../../types/camera";

// =========================================
// 🛡️ Error Handling Utilities
// =========================================

const isErrorWithMessage = (error: unknown): error is CameraError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  );
};

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

  return "เกิดข้อผิดพลาดในการเปิดกล้อง";
};

// =========================================
// 🪝 Camera Control Hook
// =========================================

export const useCameraControl = () => {
  const videoRef = useRef<HTMLVideoElement>(null!);
  const streamRef = useRef<MediaStream | null>(null);

  const [isStreaming, setIsStreaming] = useState(false);
  const [errors, setErrors] = useState<string | null>(null);
  const [torchOn, setTorchOn] = useState(false);
  const [videoConstraints, setVideoConstraints] = useState<VideoConstraints>({
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: "environment",
  });

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsStreaming(false);
    setTorchOn(false);
    setErrors(null);
  }, []);

  const startCamera = useCallback(async () => {
    try {
      setErrors(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: videoConstraints,
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setErrors(errorMessage);
      console.error("Camera access error:", error);
    }
  }, [videoConstraints]);

  const switchCamera = useCallback(() => {
    const newFacingMode =
      videoConstraints.facingMode === "environment" ? "user" : "environment";

    setVideoConstraints((prev) => ({
      ...prev,
      facingMode: newFacingMode,
    }));

    if (isStreaming) {
      stopCamera();
      setTimeout(() => {
        startCamera();
      }, 100);
    }
  }, [videoConstraints.facingMode, isStreaming, stopCamera, startCamera]);

  const toggleTorch = useCallback(async () => {
    if (!streamRef.current) return;

    try {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      const capabilities = videoTrack.getCapabilities?.();

      if (capabilities?.torch) {
        const newTorchState = !torchOn;
        await videoTrack.applyConstraints({
          advanced: [{ torch: newTorchState }],
        });
        setTorchOn(newTorchState);
      }
    } catch (error) {
      console.error("Torch toggle error:", error);
    }
  }, [torchOn]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    videoRef,
    isStreaming,
    errors,
    videoConstraints,
    torchOn,
    startCamera,
    stopCamera,
    switchCamera,
    toggleTorch,
    setVideoConstraints,
  };
};
