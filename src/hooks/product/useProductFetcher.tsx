// ./src/hooks/product/useProductFetcher.tsx
"use client";

import { useCallback } from "react";
import { ProductResponse } from "../../types/product";

interface UseProductFetcherProps {
  retryAttempts: number;
  retryDelayMs: number;
  setRetryCount: (count: number) => void;
}

interface UseProductFetcherReturn {
  fetchProduct: (barcode: string) => Promise<ProductResponse>;
}

// Define proper error types instead of using any
interface FetchError {
  name: string;
  message: string;
  cause?: unknown;
}

// Type guard to check if error has standard error properties
const isFetchError = (error: unknown): error is FetchError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    "message" in error &&
    typeof (error as Record<string, unknown>).name === "string" &&
    typeof (error as Record<string, unknown>).message === "string"
  );
};

// Helper function to get error message safely
const getErrorMessage = (error: unknown): string => {
  if (isFetchError(error)) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown error occurred";
};

// Helper function to get error name safely
const getErrorName = (error: unknown): string => {
  if (isFetchError(error)) {
    return error.name;
  }

  if (error instanceof Error) {
    return error.name;
  }

  return "Error";
};

export const useProductFetcher = ({
  retryAttempts,
  retryDelayMs,
  setRetryCount,
}: UseProductFetcherProps): UseProductFetcherReturn => {
  // Sleep function for retry delays
  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  // Fetch with retry mechanism
  const fetchWithRetry = useCallback(
    async (
      url: string,
      options: RequestInit,
      maxRetries: number
    ): Promise<Response> => {
      let lastError: Error | null = null;

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          console.log(
            `🔄 Fetch attempt ${attempt + 1}/${maxRetries + 1} for ${url}`
          );

          const response = await fetch(url, {
            ...options,
            signal: AbortSignal.timeout(10000), // 10 second timeout
          });

          // If response is ok or it's a client error (4xx), don't retry
          if (
            response.ok ||
            (response.status >= 400 && response.status < 500)
          ) {
            return response;
          }

          // Server error (5xx) - retry
          throw new Error(
            `Server error: ${response.status} ${response.statusText}`
          );
        } catch (error: unknown) {
          lastError =
            error instanceof Error ? error : new Error(getErrorMessage(error));
          console.warn(
            `❌ Fetch attempt ${attempt + 1} failed:`,
            getErrorMessage(error)
          );

          const errorName = getErrorName(error);
          const errorMessage = getErrorMessage(error);

          // Don't retry on certain errors
          if (
            errorName === "AbortError" ||
            errorName === "TypeError" ||
            errorMessage.includes("Failed to fetch") ||
            attempt === maxRetries
          ) {
            break;
          }

          // Wait before retrying (with exponential backoff)
          const delay = retryDelayMs * Math.pow(2, attempt);
          console.log(`⏳ Waiting ${delay}ms before retry...`);
          await sleep(delay);

          setRetryCount(attempt + 1);
        }
      }

      throw lastError || new Error("Unknown fetch error");
    },
    [retryDelayMs, setRetryCount]
  );

  // Main fetch function
  const fetchProduct = useCallback(
    async (barcode: string): Promise<ProductResponse> => {
      console.log("🔍 Fetching product for barcode:", barcode);
      console.log("📏 Barcode length:", barcode.length);

      const apiUrl = `/api/products/lookup?barcode=${encodeURIComponent(
        barcode
      )}`;

      try {
        const response = await fetchWithRetry(
          apiUrl,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
            },
          },
          retryAttempts
        );

        console.log("📡 API Response status:", response.status);

        let result: ProductResponse;

        try {
          const responseText = await response.text();
          console.log(
            "📄 Raw response:",
            responseText.substring(0, 200) + "..."
          );
          result = JSON.parse(responseText);
        } catch (parseError) {
          console.error("❌ Failed to parse JSON response:", parseError);
          throw new Error("ไม่สามารถแปลงข้อมูลจาก API ได้");
        }

        console.log("📄 API Result:", {
          success: result.success,
          hasData: !!result.data,
          error: result.error,
          debug: result.debug,
        });

        if (response.ok && result.success && result.data) {
          console.log("✅ Product found:", result.data.name);
          setRetryCount(0);
          return result;
        } else {
          console.log("❌ Product not found or API error:", result.error);

          // Show debug info if available
          if (result.debug) {
            console.log("🐛 Debug info:", result.debug);
          }

          // Handle different error cases
          let errorMessage = result.error || "ไม่พบข้อมูลสินค้า";

          if (response.status === 404) {
            errorMessage = "ไม่พบข้อมูลสินค้าในระบบ";
          } else if (response.status === 500) {
            errorMessage = "เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่อีกครั้ง";
          } else if (response.status === 503) {
            errorMessage = "ระบบข้อมูลสินค้าไม่พร้อมใช้งาน";
          } else if (response.status === 504) {
            errorMessage = "ระบบประมวลผลช้า กรุณารอสักครู่";
          }

          return {
            success: false,
            error: errorMessage,
            debug: result.debug,
          };
        }
      } catch (error: unknown) {
        console.error("❌ Error fetching product:", error);

        const errorName = getErrorName(error);
        const errorMessage = getErrorMessage(error);

        // Handle different types of errors
        let finalErrorMessage = "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ";

        if (errorName === "AbortError") {
          finalErrorMessage = "การเชื่อมต่อใช้เวลานานเกินไป กรุณาลองใหม่";
        } else if (
          errorName === "TypeError" &&
          errorMessage.includes("fetch")
        ) {
          finalErrorMessage = "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้";
        } else if (errorMessage.includes("Server error")) {
          finalErrorMessage = "เซิร์ฟเวอร์มีปัญหา กรุณาลองใหม่ในภายหลัง";
        } else if (errorMessage.includes("Network")) {
          finalErrorMessage = "ปัญหาการเชื่อมต่ออินเทอร์เน็ต";
        } else if (errorMessage) {
          finalErrorMessage = `เกิดข้อผิดพลาด: ${errorMessage}`;
        }

        throw new Error(finalErrorMessage);
      }
    },
    [fetchWithRetry, retryAttempts, setRetryCount]
  );

  return {
    fetchProduct,
  };
};
