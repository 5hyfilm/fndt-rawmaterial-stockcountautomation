// Path: src/app/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useBarcodeDetection } from "../hooks/useBarcodeDetection";
import { useInventoryManager } from "../hooks/useInventoryManager";
import { useEmployeeAuth } from "../hooks/useEmployeeAuth";
import { useInventoryExport } from "../hooks";
// ✅ FIXED: Import EmployeeFormData from types/auth instead of EmployeeInfo
import { EmployeeFormData } from "@/types/auth";
import { Product, ProductStatus } from "../types/product";
import {
  getProductCategoryFromGroup,
  isValidProductGroup,
} from "../data/types/csvTypes";
import { QuantityInput, QuantityDetail } from "../types/inventory";
import { useLogoutConfirmation } from "../hooks/useLogoutConfirmation";

// ✅ Import Page Components
import { LoadingView } from "../components/pages/LoadingView";
import { LoginView } from "../components/pages/LoginView";
import { MobileFullScreenView } from "../components/pages/MobileFullScreenView";
import { MainApplicationView } from "../components/pages/MainApplicationView";

export default function BarcodeDetectionPage() {
  const [activeTab, setActiveTab] = useState<"scanner" | "inventory">(
    "scanner"
  );
  const [showExportSuccess, setShowExportSuccess] = useState(false);
  const [exportFileName, setExportFileName] = useState<string>("");
  const [isMobile, setIsMobile] = useState(false);
  const [fullScreenMode, setFullScreenMode] = useState(false);
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [newProductBarcode, setNewProductBarcode] = useState<string>("");
  const [exportError, setExportError] = useState<string | null>(null);

  // Detect mobile viewport and set full screen mode
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile && activeTab === "scanner") {
        setFullScreenMode(true);
      } else {
        setFullScreenMode(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [activeTab]);

  useEffect(() => {
    if (isMobile && activeTab === "scanner") {
      setFullScreenMode(true);
    } else {
      setFullScreenMode(false);
    }
  }, [isMobile, activeTab]);

  // Employee Authentication
  const {
    isAuthenticated,
    isLoading: isAuthLoading,
    employee,
    employeeName,
    branchCode,
    branchName,
    login,
    logout,
    formatTimeRemaining,
  } = useEmployeeAuth();

  // Barcode Detection
  const {
    videoRef,
    canvasRef,
    containerRef,
    isStreaming,
    detections,
    processingQueue,
    lastDetectedCode,
    errors,
    product,
    detectedBarcodeType,
    isLoadingProduct,
    productError,
    startCamera,
    stopCamera,
    switchCamera,
    captureAndProcess,
    drawDetections,
    updateCanvasSize,
    clearError,
    restartForNextScan,
    torchOn,
    toggleTorch,
  } = useBarcodeDetection();

  // Inventory Management
  const {
    inventory,
    isLoading: isLoadingInventory,
    error: inventoryError,
    addOrUpdateMultiUnitItem,
    updateUnitQuantity,
    updateItemQuantityDetail,
    findItemByMaterialCode,
    findItemByBarcode,
    removeItem,
    clearInventory,
    searchItems,
    clearError: clearInventoryError,
    resetInventoryState,
    summary,
  } = useInventoryManager();

  // Inventory Export
  const { exportInventory: performRealExport } = useInventoryExport({
    inventory,
    employeeContext: employee
      ? {
          name: employee.name, // ✅ FIXED: Include name property (required by Pick<Employee>)
          employeeName: employee.name, // ✅ FIXED: Include employeeName (backward compatibility)
          branchCode: employee.branchCode,
          branchName: employee.branchName,
        }
      : undefined,
    setError: setExportError,
  });

  // Stop camera when switching away from scanner tab
  useEffect(() => {
    if (activeTab !== "scanner" && isStreaming) {
      console.log("🔄 Switching away from scanner tab, stopping camera...");
      stopCamera();
    }
  }, [activeTab, isStreaming, stopCamera]);

  // Auto process real-time
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isStreaming && activeTab === "scanner" && isAuthenticated) {
      interval = setInterval(() => {
        captureAndProcess();
      }, 300);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isStreaming, activeTab, captureAndProcess, isAuthenticated]);

  // Current inventory quantity calculation
  const currentInventoryQuantity = React.useMemo(() => {
    if (!lastDetectedCode || !product) return 0;
    const materialCode = product.id || product.barcode;
    const itemByMaterialCode = findItemByMaterialCode?.(materialCode);
    if (itemByMaterialCode) {
      const detectedUnit = detectedBarcodeType || "ea";
      return itemByMaterialCode.quantities[detectedUnit] || 0;
    }
    const itemByBarcode = findItemByBarcode(lastDetectedCode);
    return itemByBarcode?.quantity || 0;
  }, [
    lastDetectedCode,
    product,
    detectedBarcodeType,
    findItemByMaterialCode,
    findItemByBarcode,
  ]);

  // Handlers
  const handleEmployeeLogin = async (employeeData: EmployeeFormData) => {
    try {
      await login(employeeData);
      console.log("✅ Employee logged in:", employeeData.name); // ✅ FIXED: Use employeeData.name
    } catch (error) {
      console.error("❌ Login failed:", error);
    }
  };

  const handleLogout = () => {
    try {
      if (isStreaming) stopCamera();
      resetInventoryState();
      logout();
    } catch (error) {
      console.error("❌ Error during logout process:", error);
      resetInventoryState();
      logout();
    }
  };

  const handleAddToInventory = (
    product: Product,
    quantityInput: QuantityInput,
    barcodeType?: "ea" | "dsp" | "cs",
    directProductGroup?: string
  ): boolean => {
    const finalBarcodeType = barcodeType || detectedBarcodeType || "ea";
    if (addOrUpdateMultiUnitItem) {
      return addOrUpdateMultiUnitItem(
        product,
        quantityInput,
        finalBarcodeType,
        directProductGroup || product.category
      );
    }
    return false;
  };

  const handleAddNewProduct = (barcode: string) => {
    setNewProductBarcode(barcode);
    setShowAddProductForm(true);
  };

  const handleSaveNewProduct = async (productData: {
    barcode: string;
    productName: string;
    productGroup: string;
    description: string;
    countCs: number;
    countDsp: number;
    countPieces: number;
  }): Promise<boolean> => {
    try {
      if (!isValidProductGroup(productData.productGroup)) return false;

      const newProduct: Product = {
        id: `NEW_${Date.now()}`,
        barcode: productData.barcode,
        name: productData.productName,
        brand: "สินค้าใหม่",
        category: getProductCategoryFromGroup(productData.productGroup),
        description: productData.description,
        price: 0,
        status: ProductStatus.ACTIVE,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (addOrUpdateMultiUnitItem) {
        const allUnitsQuantity: QuantityDetail = {
          cs: productData.countCs || 0,
          dsp: productData.countDsp || 0,
          ea: productData.countPieces || 0,
        };

        const success = addOrUpdateMultiUnitItem(
          newProduct,
          allUnitsQuantity,
          "ea",
          productData.productGroup
        );

        if (success) {
          setShowAddProductForm(false);
          setNewProductBarcode("");
          restartForNextScan();
        }
        return success;
      }
      return false;
    } catch (error) {
      console.error("💥 ERROR in handleSaveNewProduct:", error);
      return false;
    }
  };

  const handleExportInventory = async (): Promise<void> => {
    if (!employee) return;
    try {
      const success = await performRealExport();
      if (success) {
        const now = new Date();
        const dateStr = now.toISOString().split("T")[0];
        const timeStr = now.toTimeString().split(" ")[0].replace(/:/g, "-");
        const fileName = `FNDTinventory_${employee.branchCode}_${dateStr}_${timeStr}.csv`;
        setExportFileName(fileName);
        setShowExportSuccess(true);
      }
    } catch (error) {
      console.error("❌ Export error:", error);
    }
  };

  // Legacy adapters for compatibility
  const handleLegacyAddOrUpdateItem = (
    product: Product,
    quantityInput: number,
    barcodeType?: "ea" | "dsp" | "cs",
    directProductGroup?: string
  ): boolean => {
    return handleAddToInventory(
      product,
      quantityInput,
      barcodeType,
      directProductGroup
    );
  };

  const handleLegacyUpdateItemQuantity = (
    itemId: string,
    newQuantity: number
  ): boolean => {
    const item = inventory.find((item) => item.id === itemId);
    if (!item) return false;
    const activeUnits = (["cs", "dsp", "ea"] as const).filter(
      (unit) => (item.quantities[unit] || 0) > 0
    );
    const primaryUnit = activeUnits.length > 0 ? activeUnits[0] : "ea";
    return updateUnitQuantity(item.materialCode, primaryUnit, newQuantity);
  };

  const handleUpdateItemQuantityDetail = (
    materialCode: string,
    quantityDetail: QuantityDetail
  ): boolean => {
    if (updateItemQuantityDetail) {
      return updateItemQuantityDetail(materialCode, quantityDetail);
    }
    return false;
  };

  const clearAllErrors = () => {
    clearError();
    clearInventoryError();
    setExportError(null);
  };

  // Logout confirmation
  const {
    isModalOpen,
    showLogoutConfirmation,
    hideLogoutConfirmation,
    confirmLogout,
    hasUnsavedData,
    unsavedDataCount,
  } = useLogoutConfirmation({
    onLogout: handleLogout,
    hasUnsavedData: () => inventory.length > 0,
    getUnsavedDataCount: () => inventory.length,
  });

  // ✅ Render appropriate view based on state
  if (isAuthLoading) {
    return <LoadingView message="กำลังโหลดระบบ..." />;
  }

  if (!isAuthenticated) {
    return <LoginView onSubmit={handleEmployeeLogin} />;
  }

  if (isMobile && activeTab === "scanner" && fullScreenMode) {
    return (
      <MobileFullScreenView
        // Export Success Toast
        showExportSuccess={showExportSuccess}
        exportFileName={exportFileName}
        inventoryLength={inventory.length}
        onCloseExportSuccess={() => setShowExportSuccess(false)}
        // Employee Data
        employeeName={employeeName}
        branchCode={branchCode}
        branchName={branchName}
        formatTimeRemaining={formatTimeRemaining}
        // UI State
        activeTab={activeTab}
        isStreaming={isStreaming}
        lastDetectedCode={lastDetectedCode}
        product={product}
        summary={summary}
        isMobile={isMobile}
        // Handlers
        onLogout={showLogoutConfirmation}
        onTabChange={setActiveTab}
        // Camera Props
        videoRef={videoRef}
        canvasRef={canvasRef}
        containerRef={containerRef}
        processingQueue={processingQueue}
        detections={detections}
        // Camera Actions
        startCamera={startCamera}
        stopCamera={stopCamera}
        switchCamera={switchCamera}
        captureAndProcess={captureAndProcess}
        drawDetections={drawDetections}
        updateCanvasSize={updateCanvasSize}
        // Torch Props
        torchOn={torchOn}
        onToggleTorch={toggleTorch}
        // Product Props
        detectedBarcodeType={detectedBarcodeType}
        isLoadingProduct={isLoadingProduct}
        productError={productError}
        currentInventoryQuantity={currentInventoryQuantity}
        // Product Actions
        onAddToInventory={handleAddToInventory}
        onAddNewProduct={handleAddNewProduct}
        restartForNextScan={restartForNextScan}
        // Logout Confirmation Modal
        isLogoutModalOpen={isModalOpen}
        onCloseLogoutModal={hideLogoutConfirmation}
        onConfirmLogout={confirmLogout}
        hasUnsavedData={hasUnsavedData}
        unsavedDataCount={unsavedDataCount}
        // Add New Product Form
        showAddProductForm={showAddProductForm}
        newProductBarcode={newProductBarcode}
        onCloseAddProductForm={() => {
          setShowAddProductForm(false);
          setNewProductBarcode("");
        }}
        onSaveNewProduct={handleSaveNewProduct}
      />
    );
  }

  return (
    <MainApplicationView
      // Export Success Toast
      showExportSuccess={showExportSuccess}
      exportFileName={exportFileName}
      inventoryLength={inventory.length}
      onCloseExportSuccess={() => setShowExportSuccess(false)}
      // Employee Data
      employeeName={employeeName}
      branchCode={branchCode}
      branchName={branchName}
      formatTimeRemaining={formatTimeRemaining}
      // UI State
      activeTab={activeTab}
      isStreaming={isStreaming}
      lastDetectedCode={lastDetectedCode}
      product={product}
      summary={summary}
      isMobile={isMobile}
      // Handlers
      onLogout={showLogoutConfirmation}
      onTabChange={setActiveTab}
      // Camera Props
      videoRef={videoRef}
      canvasRef={canvasRef}
      containerRef={containerRef}
      processingQueue={processingQueue}
      detections={detections}
      // Camera Actions
      startCamera={startCamera}
      stopCamera={stopCamera}
      switchCamera={switchCamera}
      captureAndProcess={captureAndProcess}
      drawDetections={drawDetections}
      updateCanvasSize={updateCanvasSize}
      // Torch Props
      torchOn={torchOn}
      onToggleTorch={toggleTorch}
      // Product Props
      detectedBarcodeType={detectedBarcodeType}
      isLoadingProduct={isLoadingProduct}
      productError={productError}
      currentInventoryQuantity={currentInventoryQuantity}
      // Product Actions
      onAddToInventory={handleAddToInventory}
      onAddNewProduct={handleAddNewProduct}
      restartForNextScan={restartForNextScan}
      // Inventory Management
      inventory={inventory}
      isLoadingInventory={isLoadingInventory}
      inventoryError={inventoryError}
      exportError={exportError}
      // Inventory Actions
      onLegacyAddOrUpdateItem={handleLegacyAddOrUpdateItem}
      onLegacyUpdateItemQuantity={handleLegacyUpdateItemQuantity}
      onUpdateItemQuantityDetail={handleUpdateItemQuantityDetail}
      onRemoveItem={removeItem}
      onClearInventory={() => {
        clearInventory();
        return true;
      }}
      onExportInventory={handleExportInventory}
      onClearInventoryError={() => {
        clearInventoryError();
        setExportError(null);
      }}
      onSearchItems={searchItems}
      // Error Handling
      errors={errors}
      onClearAllErrors={clearAllErrors}
      onRetryFromError={() => {
        clearAllErrors();
        if (!isStreaming && activeTab === "scanner") startCamera();
      }}
      // Logout Confirmation Modal
      isLogoutModalOpen={isModalOpen}
      onCloseLogoutModal={hideLogoutConfirmation}
      onConfirmLogout={confirmLogout}
      hasUnsavedData={hasUnsavedData}
      unsavedDataCount={unsavedDataCount}
      // Add New Product Form
      showAddProductForm={showAddProductForm}
      newProductBarcode={newProductBarcode}
      onCloseAddProductForm={() => {
        setShowAddProductForm(false);
        setNewProductBarcode("");
      }}
      onSaveNewProduct={handleSaveNewProduct}
    />
  );
}
