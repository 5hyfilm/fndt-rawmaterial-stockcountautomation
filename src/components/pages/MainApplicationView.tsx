// Path: src/components/pages/MainApplicationView.tsx
"use client";

import React from "react";
import { Product } from "../../types/product";
import { Detection } from "../../types/detection";
import { QuantityInput, QuantityDetail } from "../../types/inventory";
import { InventorySummary, InventoryItem } from "../../types/inventory";
import { ExportSuccessToast } from "../ExportSuccessToast";
import { AppHeader } from "../headers/AppHeader";
import { AppFooter } from "../footer/AppFooter";
import { MobileScannerLayout } from "../layout/MobileScannerLayout";
import { ErrorDisplay } from "../ErrorDisplay";
import { CameraSection } from "../CameraSection";
import { ProductInfoSection } from "../sections/ProductInfoSection";
import { QuickStats } from "../stats/QuickStats";
import { InventoryDisplay } from "../inventory/InventoryDisplay";
import { LogoutConfirmationModal } from "../modals/LogoutConfirmationModal";
import { AddNewProductForm } from "../forms/AddNewProductForm";

interface MainApplicationViewProps {
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

  // Inventory Management
  inventory: InventoryItem[];
  isLoadingInventory: boolean;
  inventoryError: string | null;
  exportError: string | null;

  // Inventory Actions
  onLegacyAddOrUpdateItem: (
    product: Product,
    quantityInput: number,
    barcodeType?: "ea" | "dsp" | "cs",
    directProductGroup?: string
  ) => boolean;
  onLegacyUpdateItemQuantity: (itemId: string, newQuantity: number) => boolean;
  onUpdateItemQuantityDetail: (
    materialCode: string,
    quantityDetail: QuantityDetail
  ) => boolean;
  onRemoveItem: (itemId: string) => boolean;
  onClearInventory: () => boolean;
  onExportInventory: () => Promise<void>;
  onClearInventoryError: () => void;
  onSearchItems: (query: string) => InventoryItem[];

  // Error Handling
  errors: string | null;
  onClearAllErrors: () => void;
  onRetryFromError: () => void;

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

export function MainApplicationView({
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

  // Inventory Management
  inventory,
  isLoadingInventory,
  inventoryError,
  exportError,

  // Inventory Actions
  onLegacyAddOrUpdateItem,
  onLegacyUpdateItemQuantity,
  onUpdateItemQuantityDetail,
  onRemoveItem,
  onClearInventory,
  onExportInventory,
  onClearInventoryError,
  onSearchItems,

  // Error Handling
  errors,
  onClearAllErrors,
  onRetryFromError,

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
}: MainApplicationViewProps) {
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
        lastDetectedCode={lastDetectedCode || ""}
        product={product}
        totalItems={summary.totalItems}
        onLogout={onLogout}
        onTabChange={onTabChange}
        isMobile={isMobile}
      />

      {/* Main Content */}
      <div className="flex-1">
        {/* Scanner Tab */}
        {activeTab === "scanner" && (
          <>
            {isMobile ? (
              /* Mobile Layout - Regular Scanner with Header (when not in full screen) */
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
                fullScreen={false}
                showHeader={true}
              />
            ) : (
              /* Desktop Layout - Side by Side */
              <div className="container mx-auto px-4 py-4 sm:py-6">
                {/* Error Display - Desktop Only */}
                {(errors || productError || inventoryError || exportError) && (
                  <div className="mb-4">
                    <ErrorDisplay
                      error={
                        errors ||
                        productError ||
                        inventoryError ||
                        exportError ||
                        ""
                      }
                      onDismiss={onClearAllErrors}
                      onRetry={onRetryFromError}
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 lg:gap-6">
                  {/* Camera Section */}
                  <div className="xl:col-span-3">
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
                      fullScreen={false}
                      showHeader={true}
                      // Torch props
                      torchOn={torchOn}
                      onToggleTorch={onToggleTorch}
                    />
                  </div>

                  {/* Product Info Sidebar */}
                  <div className="xl:col-span-2 space-y-4">
                    <ProductInfoSection
                      product={product}
                      barcode={lastDetectedCode || ""}
                      barcodeType={detectedBarcodeType || undefined}
                      isLoading={isLoadingProduct}
                      error={productError || undefined}
                      currentInventoryQuantity={currentInventoryQuantity}
                      isMobile={false}
                      onAddToInventory={onAddToInventory}
                    />
                  </div>
                </div>

                {/* Quick Stats - Desktop Only */}
                <div className="mt-6">
                  <QuickStats
                    totalProducts={summary.totalProducts}
                    totalItems={summary.totalItems}
                    categories={summary.categories}
                    product={product}
                    currentInventoryQuantity={currentInventoryQuantity}
                  />
                </div>
              </div>
            )}
          </>
        )}

        {/* Inventory Tab */}
        {activeTab === "inventory" && (
          <div
            className={`${
              isMobile ? "px-2 py-3" : "container mx-auto px-4 py-4 sm:py-6"
            }`}
          >
            {/* Error Display for Inventory */}
            {(inventoryError || exportError) && !isMobile && (
              <div className="mb-4">
                <ErrorDisplay
                  error={inventoryError || exportError || ""}
                  onDismiss={onClearInventoryError}
                  onRetry={onClearInventoryError}
                />
              </div>
            )}

            <div className="space-y-6">
              <InventoryDisplay
                inventory={inventory}
                summary={summary}
                isLoading={isLoadingInventory}
                error={inventoryError || exportError}
                // ✅ FIXED: ใช้ legacy adapters แทน direct legacy methods
                onAddOrUpdateItem={onLegacyAddOrUpdateItem}
                onUpdateItemQuantity={onLegacyUpdateItemQuantity}
                onUpdateItemQuantityDetail={onUpdateItemQuantityDetail}
                onRemoveItem={onRemoveItem}
                onClearInventory={onClearInventory}
                onExport={onExportInventory}
                onClearError={() => {
                  onClearInventoryError();
                }}
                onSearch={onSearchItems}
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer - Hidden on mobile */}
      {!isMobile && (
        <AppFooter
          employeeName={employeeName}
          branchName={branchName}
          product={product}
          totalItems={summary.totalItems}
          lastUpdate={summary.lastUpdate}
        />
      )}

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
