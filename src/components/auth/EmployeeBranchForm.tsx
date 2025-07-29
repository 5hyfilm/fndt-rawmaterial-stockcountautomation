// Path: src/components/auth/EmployeeBranchForm.tsx
"use client";

import React, { useState } from "react";
import { User, Building2, MapPin, Save, ArrowRight } from "lucide-react";
import Image from "next/image";
import { EmployeeFormData } from "../../types/auth";

interface EmployeeBranchFormProps {
  onSubmit: (employeeData: EmployeeFormData) => void;
  isLoading?: boolean;
}

// Input sanitization utilities
const sanitizeInput = (input: string): string => {
  return input
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/[<>\"'&]/g, (match) => {
      // Escape dangerous characters
      const escapeMap: { [key: string]: string } = {
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#x27;",
        "&": "&amp;",
      };
      return escapeMap[match] || match;
    })
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, "") // Remove event handlers
    .trim();
};

const sanitizeNameInput = (input: string): string => {
  const sanitized = sanitizeInput(input);
  // Allow only Thai, English, numbers, spaces, dots, hyphens
  return sanitized.replace(/[^ก-๙a-zA-Z0-9\s.\-]/g, "").slice(0, 100);
};

const sanitizeBranchName = (input: string): string => {
  const sanitized = sanitizeInput(input);
  // Allow Thai, English, numbers, spaces, common punctuation
  return sanitized.replace(/[^ก-๙a-zA-Z0-9\s.\-(),]/g, "").slice(0, 150);
};

// Validation utilities
const validateNameInput = (name: string): string | null => {
  const trimmed = name.trim();

  if (!trimmed) return "กรุณากรอกชื่อพนักงาน";
  if (trimmed.length < 2) return "ชื่อพนักงานต้องมีอย่างน้อย 2 ตัวอักษร";
  if (trimmed.length > 100) return "ชื่อพนักงานไม่ควรเกิน 100 ตัวอักษร";

  // Check for suspicious patterns
  if (/script|alert|onerror|onload|javascript/i.test(trimmed)) {
    return "ชื่อพนักงานมีรูปแบบที่ไม่อนุญาต";
  }

  // Must contain at least one letter
  if (!/[ก-๙a-zA-Z]/.test(trimmed)) {
    return "ชื่อพนักงานต้องมีตัวอักษรอย่างน้อย 1 ตัว";
  }

  return null;
};

const validateBranchName = (branchName: string): string | null => {
  const trimmed = branchName.trim();

  if (!trimmed) return "กรุณากรอกชื่อสาขา";
  if (trimmed.length < 2) return "ชื่อสาขาต้องมีอย่างน้อย 2 ตัวอักษร";
  if (trimmed.length > 150) return "ชื่อสาขาไม่ควรเกิน 150 ตัวอักษร";

  // Check for suspicious patterns
  if (/script|alert|onerror|onload|javascript/i.test(trimmed)) {
    return "ชื่อสาขามีรูปแบบที่ไม่อนุญาต";
  }

  // Must contain at least one letter
  if (!/[ก-๙a-zA-Z]/.test(trimmed)) {
    return "ชื่อสาขาต้องมีตัวอักษรอย่างน้อย 1 ตัว";
  }

  return null;
};

const validateBranchCode = (branchCode: string): string | null => {
  const trimmed = branchCode.trim();

  if (!trimmed) return "กรุณากรอกรหัสสาขา";
  if (!/^\d+$/.test(trimmed)) return "รหัสสาขาต้องเป็นตัวเลข 0-9 เท่านั้น";
  if (trimmed.length < 3) return "รหัสสาขาต้องมีอย่างน้อย 3 หลัก";
  if (trimmed.length > 10) return "รหัสสาขาไม่ควรเกิน 10 หลัก";

  return null;
};

export const EmployeeBranchForm: React.FC<EmployeeBranchFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const [name, setName] = useState("");
  const [branchCode, setBranchCode] = useState("");
  const [branchName, setBranchName] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    branchCode?: string;
    branchName?: string;
  }>({});

  const normalizeBranchCode = (value: string): string => {
    return value.replace(/[^0-9]/g, "").slice(0, 10);
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    const nameError = validateNameInput(name);
    if (nameError) newErrors.name = nameError;

    const branchCodeError = validateBranchCode(branchCode);
    if (branchCodeError) newErrors.branchCode = branchCodeError;

    const branchNameError = validateBranchName(branchName);
    if (branchNameError) newErrors.branchName = branchNameError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (): void => {
    if (!validateForm()) return;

    const employeeFormData: EmployeeFormData = {
      name: sanitizeNameInput(name),
      branchCode: normalizeBranchCode(branchCode),
      branchName: sanitizeBranchName(branchName),
    };

    onSubmit(employeeFormData);
  };

  const handleKeyPress = (e: React.KeyboardEvent): void => {
    if (e.key === "Enter") handleSubmit();
  };

  const handleNameChange = (value: string): void => {
    const sanitized = sanitizeNameInput(value);
    setName(sanitized);
    if (errors.name) {
      setErrors((prev) => ({ ...prev, name: undefined }));
    }
  };

  const handleBranchCodeChange = (value: string): void => {
    const normalized = normalizeBranchCode(value);
    setBranchCode(normalized);
    if (errors.branchCode) {
      setErrors((prev) => ({ ...prev, branchCode: undefined }));
    }
  };

  const handleBranchNameChange = (value: string): void => {
    const sanitized = sanitizeBranchName(value);
    setBranchName(sanitized);
    if (errors.branchName) {
      setErrors((prev) => ({ ...prev, branchName: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-fn-green/10 to-fn-red/10 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-md">
        <div className="bg-gradient-to-r from-fn-green to-fn-red/80 text-white p-6 rounded-t-2xl">
          <div className="text-center">
            <Image
              src="/fn-logo.png"
              alt="F&N Logo"
              width={60}
              height={60}
              className="mx-auto mb-3"
              priority
            />
            <h1 className="text-xl font-bold">ระบบจัดการสินค้าคงคลัง</h1>
            <p className="text-sm text-white/90 mt-1">
              กรุณากรอกข้อมูลพนักงานและสาขา
            </p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <User size={16} className="mr-2 text-fn-green" />
              ชื่อพนักงาน
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="กรอกชื่อของคุณ"
              maxLength={100}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-fn-green focus:border-transparent transition-colors ${
                errors.name ? "border-red-300" : "border-gray-300"
              }`}
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Building2 size={16} className="mr-2 text-fn-green" />
              รหัสสาขา
            </label>
            <input
              type="text"
              value={branchCode}
              onChange={(e) => handleBranchCodeChange(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="กรอกรหัสสาขา (เช่น 001, 1234)"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={10}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-fn-green focus:border-transparent transition-colors ${
                errors.branchCode ? "border-red-300" : "border-gray-300"
              }`}
              disabled={isLoading}
            />
            {errors.branchCode && (
              <p className="text-red-500 text-xs mt-1">{errors.branchCode}</p>
            )}
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <MapPin size={16} className="mr-2 text-fn-green" />
              ชื่อสาขา
            </label>
            <input
              type="text"
              value={branchName}
              onChange={(e) => handleBranchNameChange(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="กรอกชื่อสาขา (เช่น สาขาสีลม, สาขาบางนา)"
              maxLength={150}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-fn-green focus:border-transparent transition-colors ${
                errors.branchName ? "border-red-300" : "border-gray-300"
              }`}
              disabled={isLoading}
            />
            {branchName.length > 100 && (
              <p className="text-yellow-600 text-xs mt-1">
                ความยาว: {branchName.length}/150 ตัวอักษร
              </p>
            )}
            {errors.branchName && (
              <p className="text-red-500 text-xs mt-1">{errors.branchName}</p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading || !name || !branchCode || !branchName}
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

        <div className="px-6 pb-6">
          <div className="text-center text-xs text-gray-500">
            <p>© 2025 F&N Inventory Management System</p>
          </div>
        </div>
      </div>
    </div>
  );
};
