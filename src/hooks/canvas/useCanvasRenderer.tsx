// Path: src/hooks/canvas/useCanvasRenderer.tsx
"use client";

import { useRef, useCallback } from "react";
import { Detection } from "../../types/detection";
import { Product, ProductUnitType } from "../../types/product";
import type { UseCanvasRendererReturn } from "../../types/canvas";

export const useCanvasRenderer = (): UseCanvasRendererReturn => {
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const containerRef = useRef<HTMLDivElement>(null!);

  const updateCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (canvas && container) {
      const containerRect = container.getBoundingClientRect();
      canvas.width = containerRect.width;
      canvas.height = containerRect.height;
    }
  }, []);

  const drawDetections = useCallback(
    (
      detections: Detection[],
      product: Product | null,
      detectedUnitType: ProductUnitType | null, // ✅ Changed parameter name and type
      videoRef: React.RefObject<HTMLVideoElement>
    ) => {
      const canvas = canvasRef.current;
      const video = videoRef.current;

      if (!canvas || !video || detections.length === 0) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const containerRect = canvas.getBoundingClientRect();
      const videoWidth = video.videoWidth || 1;
      const videoHeight = video.videoHeight || 1;

      const scaleX = containerRect.width / videoWidth;
      const scaleY = containerRect.height / videoHeight;

      detections.forEach((detection) => {
        const x = detection.xmin * scaleX;
        const y = detection.ymin * scaleY;
        const width = (detection.xmax - detection.xmin) * scaleX;
        const height = (detection.ymax - detection.ymin) * scaleY;

        // Draw detection box with enhanced styling
        ctx.strokeStyle = product ? "#10B981" : "#EF4444";
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, width, height);

        // Draw confidence label
        ctx.fillStyle = product ? "#10B981" : "#EF4444";
        ctx.font = "bold 14px Arial";
        const confidence = `${(detection.confidence * 100).toFixed(1)}%`;
        ctx.fillText(confidence, x, y - 8);

        // Draw barcode type if available
        if (product && detectedUnitType) {
          ctx.fillStyle = "#059669";
          ctx.font = "10px Arial";
          const typeText = `${detectedUnitType.toUpperCase()}`;
          ctx.fillText(typeText, x + width - 30, y - 8);
        }

        // Draw product name if available
        if (product) {
          ctx.fillStyle = "#059669";
          ctx.font = "12px Arial";
          const maxWidth = width - 10;
          const productName =
            product.name.length > 20
              ? product.name.substring(0, 20) + "..."
              : product.name;
          ctx.fillText(productName, x + 5, y + height - 8, maxWidth);
        }

        // Enhanced corner markers
        const markerSize = 15;
        ctx.fillStyle = product ? "#10B981" : "#EF4444";

        // Top-left
        ctx.fillRect(x - 2, y - 2, markerSize, 3);
        ctx.fillRect(x - 2, y - 2, 3, markerSize);

        // Top-right
        ctx.fillRect(x + width - markerSize + 2, y - 2, markerSize, 3);
        ctx.fillRect(x + width - 1, y - 2, 3, markerSize);

        // Bottom-left
        ctx.fillRect(x - 2, y + height - 1, markerSize, 3);
        ctx.fillRect(x - 2, y + height - markerSize + 2, 3, markerSize);

        // Bottom-right
        ctx.fillRect(x + width - markerSize + 2, y + height - 1, markerSize, 3);
        ctx.fillRect(x + width - 1, y + height - markerSize + 2, 3, markerSize);
      });
    },
    []
  );

  return {
    canvasRef,
    containerRef,
    updateCanvasSize,
    drawDetections,
  };
};
