// src/types/global.d.ts
// 🌐 Global type declarations (No ESLint Errors)

declare global {
  // =========================================
  // 📹 Media Device & Camera Extensions
  // =========================================

  interface Navigator {
    mediaDevices: MediaDevices;
  }

  interface MediaDevices {
    getUserMedia(constraints: MediaStreamConstraints): Promise<MediaStream>;
  }

  interface HTMLVideoElement {
    srcObject: MediaStream | null;
    videoWidth: number;
    videoHeight: number;
  }

  interface MediaStreamTrack {
    stop(): void;
    getCapabilities(): MediaTrackCapabilities;
    applyConstraints(constraints: MediaTrackConstraints): Promise<void>;
  }

  interface MediaStream {
    getTracks(): MediaStreamTrack[];
    getVideoTracks(): MediaStreamTrack[];
  }

  // ⭐ Enhanced Media Track Capabilities for Torch/Focus
  interface MediaTrackCapabilities {
    torch?: boolean;
    focusMode?: string[];
    exposureMode?: string[];
    whiteBalanceMode?: string[];
  }

  interface MediaTrackConstraintSet {
    torch?: boolean;
    focusMode?: string;
    exposureMode?: string;
    whiteBalanceMode?: string;
  }

  interface MediaTrackConstraints extends MediaTrackConstraintSet {
    advanced?: MediaTrackConstraintSet[];
  }

  // =========================================
  // 🎨 Canvas & Rendering Types
  // =========================================

  interface HTMLCanvasElement {
    getContext(contextId: "2d"): CanvasRenderingContext2D | null;
  }

  interface CanvasRenderingContext2D {
    drawImage(
      image: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement,
      dx: number,
      dy: number
    ): void;
    drawImage(
      image: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement,
      dx: number,
      dy: number,
      dw: number,
      dh: number
    ): void;
  }

  // =========================================
  // 🌐 Browser Compatibility Types
  // =========================================

  interface Window {
    webkitRequestAnimationFrame?: (callback: FrameRequestCallback) => number;
    mozRequestAnimationFrame?: (callback: FrameRequestCallback) => number;
    msRequestAnimationFrame?: (callback: FrameRequestCallback) => number;

    // =========================================
    // 📁 File System API Types (for artifacts)
    // =========================================
    fs?: {
      readFile: (
        filepath: string,
        options?: { encoding?: string }
      ) => Promise<Uint8Array | string>;
    };
  }
}

// =========================================
// ⚙️ Environment Variables
// =========================================

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare namespace NodeJS {
  interface ProcessEnv {
    PYTHON_BACKEND_URL?: string;
    NODE_ENV: "development" | "production" | "test";
  }
}

// =========================================
// 📦 Module Declarations
// =========================================

// For CSV parsing - ✅ Fixed all any types
declare module "papaparse" {
  interface ParseResult<T> {
    data: T[];
    errors: ParseError[];
    meta: {
      fields?: string[];
      delimiter: string;
      linebreak: string;
      aborted: boolean;
      truncated: boolean;
      cursor: number;
    };
  }

  interface ParseError {
    type: string;
    code: string;
    message: string;
    row: number;
  }

  interface ParseConfig {
    header?: boolean;
    dynamicTyping?: boolean;
    skipEmptyLines?: boolean;
    delimitersToGuess?: string[];
  }

  function parse<T = unknown>(
    input: string,
    config?: ParseConfig
  ): ParseResult<T>;
}

// =========================================
// 🎯 Export Types
// =========================================

export {};
