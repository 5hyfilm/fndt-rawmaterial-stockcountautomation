// src/components/layout/MobileScannerLayout.tsx
"use client";

import React, { useEffect, useState } from "react";
import { CameraSection } from "../CameraSection";
import { MobileProductSlide } from "./MobileProductSlide";
import { Detection } from "../../types/detection";
import { Product } from "../../types/product";
import { QuantityInput } from "../../types/inventory";

interface MobileScannerLayoutProps {
  // Camera props
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  containerRef: React.RefObject<HTMLDivElement>;
  isStreaming: boolean;
  processingQueue: number;
  detections: Detection[];

  // Camera actions
  startCamera: () => void;
  stopCamera: () => void;
  switchCamera: () => void;
  captureAndProcess: () => void;
  drawDetections: () => void;
  updateCanvasSize: () => void;

  // Torch props
  torchOn?: boolean;
  onToggleTorch?: () => void;

  // Product props
  product: Product | null;
  detectedBarcodeType?: "ea" | "dsp" | "cs" | null;
  isLoadingProduct: boolean;
  productError: string | null;
  lastDetectedCode: string;
  scannedBarcode?: string;

  // Product actions
  onAddToInventory: (
    product: Product,
    quantityInput: QuantityInput,
    barcodeType?: "ea" | "dsp" | "cs"
  ) => boolean;
  onAddNewProduct?: (barcode: string) => void;
  restartForNextScan: () => void;
  currentInventoryQuantity: number;

  // Layout options
  fullScreen?: boolean;
  showHeader?: boolean;
}

export const MobileScannerLayout: React.FC<MobileScannerLayoutProps> = ({
  // Camera props
  videoRef,
  canvasRef,
  containerRef,
  isStreaming,
  processingQueue,
  detections,

  // Camera actions
  startCamera,
  stopCamera,
  switchCamera,
  captureAndProcess,
  drawDetections,
  updateCanvasSize,

  // Torch props
  torchOn = false,
  onToggleTorch,

  // Product props
  product,
  detectedBarcodeType,
  isLoadingProduct,
  productError,
  lastDetectedCode,
  scannedBarcode,

  // Product actions
  onAddToInventory,
  onAddNewProduct,
  restartForNextScan,
  currentInventoryQuantity,

  // Layout options
  fullScreen = true,
  showHeader = true,
}) => {
  const [showProductSlide, setShowProductSlide] = useState(false);

  // แสดง slide เมื่อมี barcode detection (ไม่ว่าจะเจอสินค้าหรือไม่)
  useEffect(() => {
    // แสดง slide เมื่อ:
    // 1. มี lastDetectedCode (detect barcode ได้)
    // 2. กล้องหยุดทำงานแล้ว (!isStreaming)
    // 3. ไม่อยู่ในสถานะ loading
    if (lastDetectedCode && !isStreaming && !isLoadingProduct) {
      console.log("📱 Showing product slide for barcode:", lastDetectedCode);
      setShowProductSlide(true);
    } else {
      setShowProductSlide(false);
    }
  }, [lastDetectedCode, isStreaming, isLoadingProduct]);

  // Handle close product slide and restart scanning
  const handleCloseProductSlide = () => {
    console.log("🔄 Closing product slide and restarting scan");
    setShowProductSlide(false);
    restartForNextScan();
    setTimeout(() => {
      startCamera();
    }, 300);
  };

  // Container styles
  const containerClasses = fullScreen
    ? "relative bg-black overflow-hidden"
    : "relative h-screen bg-gray-900 overflow-hidden";

  const containerStyle = fullScreen
    ? {
        height: "100vh",
        width: "100vw",
        position: "fixed" as const,
        top: 0,
        left: 0,
        zIndex: 30,
      }
    : {
        height: "100vh",
      };

  return (
    <div className={containerClasses} style={containerStyle}>
      {/* Header - Only show if not fullscreen or explicitly requested */}
      {showHeader && !fullScreen && (
        <div className="absolute top-0 left-0 right-0 z-40 bg-black/50 text-white p-3">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-semibold">สแกนบาร์โค้ด</h1>
            <div className="flex gap-2">
              {detections.length > 0 && (
                <span className="text-xs bg-green-500 px-2 py-1 rounded">
                  Detected: {detections.length}
                </span>
              )}
              {processingQueue > 0 && (
                <span className="text-xs bg-orange-500 px-2 py-1 rounded">
                  Queue: {processingQueue}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Camera Section */}
      <CameraSection
        videoRef={videoRef}
        canvasRef={canvasRef}
        containerRef={containerRef}
        isStreaming={isStreaming}
        processingQueue={processingQueue}
        detections={detections}
        startCamera={startCamera}
        stopCamera={stopCamera}
        switchCamera={switchCamera}
        captureAndProcess={captureAndProcess}
        drawDetections={drawDetections}
        updateCanvasSize={updateCanvasSize}
        fullScreen={fullScreen}
        showHeader={showHeader}
        torchOn={torchOn}
        onToggleTorch={onToggleTorch}
      />

      {/* Control Buttons - Only show when camera is streaming */}
      {isStreaming && (
        <div className="absolute bottom-6 right-4 z-30 flex flex-col gap-3">
          {/* ปุ่มไฟฉาย */}
          {onToggleTorch && (
            <button
              onClick={onToggleTorch}
              className={`p-3 rounded-full shadow-lg transition-colors ${
                torchOn
                  ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                  : "bg-gray-800/70 hover:bg-gray-700 text-white"
              }`}
              title={torchOn ? "ปิดไฟฉาย" : "เปิดไฟฉาย"}
            >
              <svg
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M6 14l3 3v5h6v-5l3-3V9H6v5zm5-12h2v3h-2V2zM3.5 6L2 4.5 3.5 3l1.5 1.5L3.5 6zm13 0L18 4.5 16.5 3 18 4.5 19.5 6zm-13 6L2 10.5 3.5 12 2 13.5 3.5 15zm13 0L18 10.5 16.5 12 18 13.5 16.5 15z" />
              </svg>
            </button>
          )}

          {/* ปุ่มปิดกล้อง */}
          <button
            onClick={stopCamera}
            className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transition-colors"
            title="หยุดกล้อง"
          >
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h12v12H6V6z" />
            </svg>
          </button>
        </div>
      )}

      {/* ปุ่มเปิดกล้องใหญ่ ตรงกลาง - เมื่อกล้องปิด */}
      {!showHeader && !isStreaming && (
        <div className="absolute inset-0 flex items-center justify-center z-30">
          <div className="text-center">
            <button
              onClick={startCamera}
              className="bg-[rgb(162,193,82)] hover:bg-[rgb(142,173,62)] text-white px-8 py-4 rounded-full text-lg font-medium shadow-xl transition-colors mb-4"
            >
              <div className="flex items-center gap-3">
                <svg
                  width="32"
                  height="32"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 2h6v6h4v2h2v8c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2v-8h2V8h4V2zm2 2v4h2V4h-2z" />
                </svg>
                เปิดกล้อง
              </div>
            </button>
            <p className="text-white/70 text-sm">แตะเพื่อเริ่มสแกนบาร์โค้ด</p>
          </div>
        </div>
      )}

      {/* Product Slide Overlay - แสดงทั้งเจอและไม่เจอสินค้า */}
      <MobileProductSlide
        isVisible={showProductSlide}
        product={product}
        detectedBarcodeType={detectedBarcodeType || undefined}
        currentInventoryQuantity={currentInventoryQuantity}
        scannedBarcode={scannedBarcode || lastDetectedCode}
        productError={productError || undefined}
        onClose={handleCloseProductSlide}
        onAddToInventory={onAddToInventory}
        onAddNewProduct={onAddNewProduct}
      />
    </div>
  );
};
