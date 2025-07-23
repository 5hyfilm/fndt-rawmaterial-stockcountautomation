// src/hooks/useLogoutConfirmation.tsx
"use client";

import { useState, useCallback } from "react";

interface UseLogoutConfirmationProps {
  onLogout: () => void;
  hasUnsavedData?: () => boolean;
  getUnsavedDataCount?: () => number;
}

interface UseLogoutConfirmationReturn {
  isModalOpen: boolean;
  showLogoutConfirmation: () => void;
  hideLogoutConfirmation: () => void;
  confirmLogout: () => void;
  hasUnsavedData: boolean;
  unsavedDataCount: number;
}

export const useLogoutConfirmation = ({
  onLogout,
  hasUnsavedData = () => false,
  getUnsavedDataCount = () => 0,
}: UseLogoutConfirmationProps): UseLogoutConfirmationReturn => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showLogoutConfirmation = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const hideLogoutConfirmation = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const confirmLogout = useCallback(() => {
    try {
      onLogout();
    } catch (error) {
      console.error("❌ Error during logout:", error);
    } finally {
      setIsModalOpen(false);
    }
  }, [onLogout]);

  return {
    isModalOpen,
    showLogoutConfirmation,
    hideLogoutConfirmation,
    confirmLogout,
    hasUnsavedData: hasUnsavedData(),
    unsavedDataCount: getUnsavedDataCount(),
  };
};
