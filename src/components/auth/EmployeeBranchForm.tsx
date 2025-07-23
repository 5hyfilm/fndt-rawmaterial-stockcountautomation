// src/components/auth/EmployeeBranchForm.tsx
"use client";

import React, { useState } from "react";
import { User, Building2, MapPin, Save, ArrowRight } from "lucide-react";
import Image from "next/image";

export interface EmployeeInfo {
  employeeName: string;
  branchCode: string;
  branchName: string;
  timestamp: string;
}

interface EmployeeBranchFormProps {
  onSubmit: (employeeInfo: EmployeeInfo) => void;
  isLoading?: boolean;
}

export const EmployeeBranchForm: React.FC<EmployeeBranchFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const [employeeName, setEmployeeName] = useState("");
  const [branchCode, setBranchCode] = useState("");
  const [branchName, setBranchName] = useState("");
  const [errors, setErrors] = useState<{
    employeeName?: string;
    branchCode?: string;
    branchName?: string;
  }>({});

  // ✅ Helper function สำหรับตรวจสอบตัวเลขเท่านั้น
  const isNumericOnly = (value: string): boolean => {
    return /^\d*$/.test(value);
  };

  // ✅ Normalize รหัสสาขา (เอาเฉพาะตัวเลข)
  const normalizeBranchCode = (value: string): string => {
    return value.replace(/[^0-9]/g, "");
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    // ตรวจสอบชื่อพนักงาน
    if (!employeeName.trim()) {
      newErrors.employeeName = "กรุณากรอกชื่อพนักงาน";
    } else if (employeeName.trim().length < 2) {
      newErrors.employeeName = "ชื่อพนักงานต้องมีอย่างน้อย 2 ตัวอักษร";
    }

    // ✅ ตรวจสอบรหัสสาขา - เพิ่ม validation สำหรับตัวเลขเท่านั้น
    if (!branchCode.trim()) {
      newErrors.branchCode = "กรุณากรอกรหัสสาขา";
    } else if (!isNumericOnly(branchCode.trim())) {
      newErrors.branchCode = "รหัสสาขาต้องเป็นตัวเลข 0-9 เท่านั้น";
    } else if (branchCode.trim().length < 3) {
      newErrors.branchCode = "รหัสสาขาต้องมีอย่างน้อย 3 หลัก";
    } else if (branchCode.trim().length > 10) {
      newErrors.branchCode = "รหัสสาขาไม่ควรเกิน 10 หลัก";
    }

    // ตรวจสอบชื่อสาขา
    if (!branchName.trim()) {
      newErrors.branchName = "กรุณากรอกชื่อสาขา";
    } else if (branchName.trim().length < 2) {
      newErrors.branchName = "ชื่อสาขาต้องมีอย่างน้อย 2 ตัวอักษร";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const employeeInfo: EmployeeInfo = {
      employeeName: employeeName.trim(),
      branchCode: branchCode.trim(),
      branchName: branchName.trim(),
      timestamp: new Date().toISOString(),
    };

    onSubmit(employeeInfo);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  // ✅ ปรับปรุง handleBranchCodeChange ให้กรอกได้เฉพาะตัวเลข
  const handleBranchCodeChange = (value: string) => {
    // กรองเอาเฉพาะตัวเลข และจำกัดความยาว
    const numericValue = normalizeBranchCode(value);
    const limitedValue = numericValue.slice(0, 10); // จำกัดไม่เกิน 6 หลัก

    setBranchCode(limitedValue);

    // Clear branch code error when user starts typing
    if (errors.branchCode) {
      setErrors((prev) => ({ ...prev, branchCode: undefined }));
    }
  };

  const handleBranchNameChange = (value: string) => {
    setBranchName(value);
    // Clear branch name error when user starts typing
    if (errors.branchName) {
      setErrors((prev) => ({ ...prev, branchName: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-fn-green/10 to-fn-red/10 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-md">
        {/* Header */}
        <div className="bg-gradient-to-r from-fn-green to-fn-red/80 text-white p-6 rounded-t-2xl">
          <div className="text-center">
            <Image
              src="/fn-logo.png"
              alt="F&N Logo"
              width={64}
              height={64}
              className="mx-auto mb-3 object-contain"
              priority
            />
            <h1 className="text-xl font-bold mb-1">ระบบเช็ค Stock สินค้า</h1>
            <p className="text-white/90 text-sm">F&N Inventory Management</p>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              ข้อมูลพนักงานและสาขา
            </h2>
            <p className="text-gray-600 text-sm">
              กรุณากรอกข้อมูลก่อนเริ่มใช้งานระบบ
            </p>
          </div>

          {/* Employee Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User size={16} className="inline mr-2" />
              ชื่อพนักงาน
            </label>
            <input
              type="text"
              value={employeeName}
              onChange={(e) => {
                setEmployeeName(e.target.value);
                setErrors((prev) => ({ ...prev, employeeName: undefined }));
              }}
              onKeyPress={handleKeyPress}
              placeholder="กรอกชื่อ-นามสกุล"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-fn-green focus:border-fn-green transition-colors ${
                errors.employeeName ? "border-red-300" : "border-gray-300"
              }`}
              disabled={isLoading}
            />
            {errors.employeeName && (
              <p className="text-red-500 text-xs mt-1">{errors.employeeName}</p>
            )}
          </div>

          {/* ✅ Branch Code Input - ปรับปรุงให้กรอกได้เฉพาะตัวเลข */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Building2 size={16} className="inline mr-2" />
              รหัสสาขา
            </label>
            <input
              type="text"
              inputMode="numeric" // ✅ แสดง numeric keyboard บนมือถือ
              pattern="[0-9]*" // ✅ HTML5 pattern สำหรับตัวเลขเท่านั้น
              value={branchCode}
              onChange={(e) => handleBranchCodeChange(e.target.value)}
              onKeyPress={(e) => {
                // ✅ ป้องกันการพิมพ์ตัวอักษรที่ไม่ใช่ตัวเลข
                if (
                  !/[0-9]/.test(e.key) &&
                  e.key !== "Backspace" &&
                  e.key !== "Delete" &&
                  e.key !== "Enter"
                ) {
                  e.preventDefault();
                }
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
              placeholder="กรอกรหัสสาขา เช่น 001, 002"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-fn-green focus:border-fn-green transition-colors ${
                errors.branchCode ? "border-red-300" : "border-gray-300"
              }`}
              disabled={isLoading}
              maxLength={10} // ✅ จำกัดความยาวสูงสุด 6 หลัก
            />
            {errors.branchCode && (
              <p className="text-red-500 text-xs mt-1">{errors.branchCode}</p>
            )}
            {/* ✅ เพิ่มคำแนะนำ */}
            <p className="text-gray-500 text-xs mt-1">
              ใส่ได้เฉพาะตัวเลข 0-9 (3-10 หลัก)
            </p>
          </div>

          {/* Branch Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin size={16} className="inline mr-2" />
              ชื่อสาขา
            </label>
            <input
              type="text"
              value={branchName}
              onChange={(e) => handleBranchNameChange(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="กรอกชื่อสาขา เช่น สาขาสยามพารากอน"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-fn-green focus:border-fn-green transition-colors ${
                errors.branchName ? "border-red-300" : "border-gray-300"
              }`}
              disabled={isLoading}
            />
            {errors.branchName && (
              <p className="text-red-500 text-xs mt-1">{errors.branchName}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading || !employeeName || !branchCode || !branchName}
            className="w-full bg-gradient-to-r from-fn-green to-fn-red/80 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>กำลังบันทึก...</span>
              </>
            ) : (
              <>
                <Save size={20} />
                <span>เริ่มใช้งานระบบ</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <div className="text-center text-xs text-gray-500">
            <p>© 2025 F&N Inventory Management System</p>
          </div>
        </div>
      </div>
    </div>
  );
};
