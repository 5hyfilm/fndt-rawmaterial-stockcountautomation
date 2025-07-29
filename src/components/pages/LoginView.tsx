// Path: src/components/pages/LoginView.tsx
"use client";

import React from "react";
import { EmployeeBranchForm } from "../auth/EmployeeBranchForm";
// ✅ FIXED: Import EmployeeFormData to maintain compatibility
import { EmployeeFormData } from "../../types/auth";

interface LoginViewProps {
  onSubmit: (employeeFormData: EmployeeFormData) => Promise<void>; // ✅ Use EmployeeFormData for compatibility
  isLoading?: boolean;
  error?: string | null;
}

export function LoginView({
  onSubmit,
  isLoading = false,
  error,
}: LoginViewProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Error Display (if needed) */}
      {error && (
        <div className="fixed top-4 left-4 right-4 z-50">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  เข้าสู่ระบบไม่สำเร็จ
                </h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Login Form */}
      <EmployeeBranchForm onSubmit={onSubmit} isLoading={isLoading} />
    </div>
  );
}
