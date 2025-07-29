// Path: src/hooks/useEmployeeAuth.tsx
"use client";

import { useState, useCallback, useEffect } from "react";
import { Employee, EmployeeFormData, EmployeeSession } from "@/types/auth";

const STORAGE_KEY = "fn_employee_session";
const SESSION_DURATION = 3 * 60 * 60 * 1000; // 8 hours in milliseconds

export const useEmployeeAuth = () => {
  const [session, setSession] = useState<EmployeeSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ตรวจสอบ session ที่มีอยู่
  const checkExistingSession = useCallback(() => {
    try {
      const savedSession = localStorage.getItem(STORAGE_KEY);

      if (savedSession) {
        const parsedSession: EmployeeSession = JSON.parse(savedSession);
        const loginTime = new Date(parsedSession.loginTime).getTime();
        const now = Date.now();

        // ตรวจสอบว่า session ยังไม่หมดอายุ
        if (now - loginTime < SESSION_DURATION) {
          setSession(parsedSession);
          console.log(
            "📋 Existing session loaded:",
            parsedSession.employee.name
          );
        } else {
          // Session หมดอายุ
          localStorage.removeItem(STORAGE_KEY);
          console.log("⏰ Session expired, clearing data");
        }
      }
    } catch (error) {
      console.error("❌ Error loading session:", error);
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // สร้าง session ใหม่
  const login = useCallback((employeeData: EmployeeFormData) => {
    const employee: Employee = {
      name: employeeData.name,
      branchCode: employeeData.branchCode,
      branchName: employeeData.branchName,
      timestamp: new Date().toISOString(),
    };

    const newSession: EmployeeSession = {
      employee,
      sessionId: `session_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      loginTime: new Date().toISOString(),
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
      setSession(newSession);
      console.log("✅ Employee session created:", employee.name);
    } catch (error) {
      console.error("❌ Error saving session:", error);
      throw new Error("ไม่สามารถบันทึกข้อมูลการเข้าสู่ระบบได้");
    }
  }, []);

  // ฟังก์ชันเพื่อ clear localStorage ทั้งหมด
  const clearAllLocalStorage = useCallback(() => {
    try {
      // เก็บรายการ keys ที่มีใน localStorage ก่อน clear
      const keys = Object.keys(localStorage);
      console.log("🗑️ Clearing localStorage keys:", keys);

      // Clear localStorage ทั้งหมด
      localStorage.clear();

      console.log("✅ All localStorage data cleared successfully");
      return true;
    } catch (error) {
      console.error("❌ Error clearing localStorage:", error);

      // Fallback: ลบ key ที่รู้จัก
      try {
        const knownKeys = [
          STORAGE_KEY,
          "fn_inventory_data",
          "fn_inventory_version",
          "fn_product_cache",
          "fn_barcode_cache",
        ];

        knownKeys.forEach((key) => {
          localStorage.removeItem(key);
        });

        console.log("✅ Known keys cleared as fallback");
        return true;
      } catch (fallbackError) {
        console.error("❌ Fallback clear also failed:", fallbackError);
        return false;
      }
    }
  }, []);

  // ออกจากระบบ และ clear localStorage ทั้งหมด
  const logout = useCallback(() => {
    try {
      // Log ข้อมูลก่อน logout สำหรับ debugging
      console.log("👋 Starting logout process for:", session?.employee.name);

      // Clear localStorage ทั้งหมด
      const clearSuccess = clearAllLocalStorage();

      // Clear session state
      setSession(null);

      if (clearSuccess) {
        console.log("✅ Employee logged out and all data cleared successfully");
      } else {
        console.warn(
          "⚠️ Employee logged out but localStorage clearing had issues"
        );
      }
    } catch (error) {
      console.error("❌ Error during logout:", error);

      // ลองล็อคเอาต์แบบ basic ถ้า error
      try {
        localStorage.removeItem(STORAGE_KEY);
        setSession(null);
        console.log("⚠️ Basic logout completed despite error");
      } catch (basicError) {
        console.error("❌ Even basic logout failed:", basicError);
        // ยังคง clear session state แม้ localStorage จะมีปัญหา
        setSession(null);
      }
    }
  }, [session, clearAllLocalStorage]);

  // อัพเดตข้อมูลพนักงาน
  const updateEmployeeInfo = useCallback(
    (updatedInfo: Partial<Employee>) => {
      if (!session) return;

      const updatedSession: EmployeeSession = {
        ...session,
        employee: {
          ...session.employee,
          ...updatedInfo,
        },
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSession));
        setSession(updatedSession);
        console.log("✅ Employee info updated");
      } catch (error) {
        console.error("❌ Error updating employee info:", error);
        throw new Error("ไม่สามารถอัพเดตข้อมูลได้");
      }
    },
    [session]
  );

  // ตรวจสอบว่า session ยังใช้งานได้
  const isSessionValid = useCallback(() => {
    if (!session) return false;

    const loginTime = new Date(session.loginTime).getTime();
    const now = Date.now();

    return now - loginTime < SESSION_DURATION;
  }, [session]);

  // รับข้อมูลสำหรับการส่งออก
  const getSessionInfo = useCallback(() => {
    if (!session) return null;

    return {
      employeeName: session.employee.name, // ✅ Map name → employeeName for backward compatibility
      branchCode: session.employee.branchCode,
      branchName: session.employee.branchName,
      sessionId: session.sessionId,
      loginTime: session.loginTime,
      sessionDuration: Date.now() - new Date(session.loginTime).getTime(),
    };
  }, [session]);

  // ตรวจสอบเวลาคงเหลือของ session
  const getTimeRemaining = useCallback(() => {
    if (!session) return 0;

    const loginTime = new Date(session.loginTime).getTime();
    const now = Date.now();
    const elapsed = now - loginTime;
    const remaining = SESSION_DURATION - elapsed;

    return Math.max(0, remaining);
  }, [session]);

  // Format เวลาคงเหลือ
  const formatTimeRemaining = useCallback(() => {
    const remaining = getTimeRemaining();
    if (remaining <= 0) return "หมดเวลา";

    const hours = Math.floor(remaining / (60 * 60 * 1000));
    const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));

    if (hours > 0) {
      return `${hours} ชม. ${minutes} นาที`;
    } else {
      return `${minutes} นาที`;
    }
  }, [getTimeRemaining]);

  // โหลด session เมื่อ component mount
  useEffect(() => {
    checkExistingSession();
  }, [checkExistingSession]);

  // ตั้งค่าให้ตรวจสอบ session ทุก ๆ 1 นาที
  useEffect(() => {
    if (!session) return;

    const interval = setInterval(() => {
      if (!isSessionValid()) {
        console.log("⏰ Session expired during use");
        logout();
      }
    }, 60000); // ตรวจสอบทุก 1 นาที

    return () => clearInterval(interval);
  }, [session, isSessionValid, logout]);

  return {
    // State
    session,
    isLoading,
    isAuthenticated: !!session && isSessionValid(),

    // Employee info shortcuts
    employee: session?.employee || null,
    employeeName: session?.employee.name || "", // ✅ Map name → employeeName
    branchCode: session?.employee.branchCode || "",
    branchName: session?.employee.branchName || "",

    // Actions
    login,
    logout,
    updateEmployeeInfo,
    clearAllLocalStorage, // Export สำหรับการใช้งานแยก

    // Utilities
    isSessionValid,
    getSessionInfo,
    getTimeRemaining,
    formatTimeRemaining,
    checkExistingSession,
  };
};
