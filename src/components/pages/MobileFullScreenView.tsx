// Path: src/components/pages/MobileFullScreenView.tsx
"use client";

import React from "react";
import { Product } from "../../types/product";
import { Detection } from "../../types/detection";
import { QuantityInput } from "../../types/inventory";
import { InventorySummary } from "../../hooks/useInventoryManager";
import { ExportSuccessToast } from "../ExportSuccessToast";
import { AppHeader } from "../headers/AppHeader";
import { MobileScannerLayout } from "../layout/MobileScannerLayout";
import { LogoutConfirmationModal } from "../modals/LogoutConfirmationModal";
import { AddNewProductForm } from "../forms/AddNewProductForm";

interface MobileFullScreenViewProps {
  // Export Success Toast
  showExportSuccess: boolean;
  exportFileName: string;
  inventoryLength: number;
  onCloseExportSuccess: () => void;

  // Employee Data
  employeeName: string;
  branchCode: string;
  branchName: string;
  formatTimeRemaining: () => string;

  // UI State
  activeTab: "scanner" | "inventory";
  isStreaming: boolean;
  lastDetectedCode: string | null;
  product: Product | null;
  summary: InventorySummary;
  isMobile: boolean;

  // Handlers
  onLogout: () => void;
  onTabChange: (tab: "scanner" | "inventory") => void;

  // Camera Props
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  containerRef: React.RefObject<HTMLDivElement>;
  processingQueue: number;
  detections: Detection[];

  // Camera Actions
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  switchCamera: () => void;
  captureAndProcess: () => void;
  drawDetections: () => void;
  updateCanvasSize: () => void;

  // Torch Props
  torchOn: boolean;
  onToggleTorch: () => void;

  // Product Props
  detectedBarcodeType: "ea" | "dsp" | "cs" | null;
  isLoadingProduct: boolean;
  productError: string | null;
  currentInventoryQuantity: number;

  // Product Actions
  onAddToInventory: (
    product: Product,
    quantityInput: QuantityInput,
    barcodeType?: "ea" | "dsp" | "cs",
    directProductGroup?: string
  ) => boolean;
  onAddNewProduct: (barcode: string) => void;
  restartForNextScan: () => void;

  // Logout Confirmation Modal
  isLogoutModalOpen: boolean;
  onCloseLogoutModal: () => void;
  onConfirmLogout: () => void;
  hasUnsavedData: boolean;
  unsavedDataCount: number;

  // Add New Product Form
  showAddProductForm: boolean;
  newProductBarcode: string;
  onCloseAddProductForm: () => void;
  onSaveNewProduct: (productData: {
    barcode: string;
    productName: string;
    productGroup: string;
    description: string;
    countCs: number;
    countDsp: number;
    countPieces: number;
  }) => Promise<boolean>;
}

export function MobileFullScreenView({
  // Export Success Toast
  showExportSuccess,
  exportFileName,
  inventoryLength,
  onCloseExportSuccess,

  // Employee Data
  employeeName,
  branchCode,
  branchName,
  formatTimeRemaining,

  // UI State
  activeTab,
  isStreaming,
  lastDetectedCode,
  product,
  summary,
  isMobile,

  // Handlers
  onLogout,
  onTabChange,

  // Camera Props
  videoRef,
  canvasRef,
  containerRef,
  processingQueue,
  detections,

  // Camera Actions
  startCamera,
  stopCamera,
  switchCamera,
  captureAndProcess,
  drawDetections,
  updateCanvasSize,

  // Torch Props
  torchOn,
  onToggleTorch,

  // Product Props
  detectedBarcodeType,
  isLoadingProduct,
  productError,
  currentInventoryQuantity,

  // Product Actions
  onAddToInventory,
  onAddNewProduct,
  restartForNextScan,

  // Logout Confirmation Modal
  isLogoutModalOpen,
  onCloseLogoutModal,
  onConfirmLogout,
  hasUnsavedData,
  unsavedDataCount,

  // Add New Product Form
  showAddProductForm,
  newProductBarcode,
  onCloseAddProductForm,
  onSaveNewProduct,
}: MobileFullScreenViewProps) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Export Success Toast */}
      <ExportSuccessToast
        show={showExportSuccess}
        onClose={onCloseExportSuccess}
        fileName={exportFileName}
        itemCount={inventoryLength}
      />

      {/* ✅ FIXED: Unified AppHeader without totalSKUs */}
      <AppHeader
        employeeName={employeeName}
        branchCode={branchCode}
        branchName={branchName}
        formatTimeRemaining={formatTimeRemaining}
        activeTab={activeTab}
        isStreaming={isStreaming}
        lastDetectedCode={lastDetectedCode || undefined}
        product={product}
        totalItems={summary.totalItems}
        onLogout={onLogout}
        onTabChange={onTabChange}
        isMobile={isMobile}
      />

      {/* Main Content - Full Screen Scanner */}
      <div className="flex-1">
        <MobileScannerLayout
          // Camera props
          videoRef={videoRef}
          canvasRef={canvasRef}
          containerRef={containerRef}
          isStreaming={isStreaming}
          processingQueue={processingQueue}
          detections={detections}
          // Camera actions
          startCamera={startCamera}
          stopCamera={stopCamera}
          switchCamera={switchCamera}
          captureAndProcess={captureAndProcess}
          drawDetections={drawDetections}
          updateCanvasSize={updateCanvasSize}
          // Torch props
          torchOn={torchOn}
          onToggleTorch={onToggleTorch}
          // Product props
          product={product}
          detectedBarcodeType={detectedBarcodeType}
          isLoadingProduct={isLoadingProduct}
          productError={productError}
          lastDetectedCode={lastDetectedCode || ""}
          scannedBarcode={lastDetectedCode || ""}
          // Product actions
          onAddToInventory={onAddToInventory}
          onAddNewProduct={onAddNewProduct}
          restartForNextScan={restartForNextScan}
          currentInventoryQuantity={currentInventoryQuantity}
          // Layout options
          fullScreen={true}
          showHeader={false}
        />
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={onCloseLogoutModal}
        onConfirm={onConfirmLogout}
        employeeName={employeeName}
        branchCode={branchCode}
        branchName={branchName}
        sessionTimeRemaining={formatTimeRemaining()}
        hasUnsavedData={hasUnsavedData}
        unsavedDataCount={unsavedDataCount}
      />

      {/* Add New Product Form */}
      <AddNewProductForm
        isVisible={showAddProductForm}
        barcode={newProductBarcode}
        onClose={onCloseAddProductForm}
        onSave={onSaveNewProduct}
      />
    </div>
  );
}
