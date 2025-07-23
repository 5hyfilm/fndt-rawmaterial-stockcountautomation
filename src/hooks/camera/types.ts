// src/hooks/camera/types.ts
export interface VideoConstraints {
  width: { ideal: number };
  height: { ideal: number };
  facingMode: "environment" | "user";
}

export interface CameraState {
  isStreaming: boolean;
  facingMode: "environment" | "user";
  resolution: {
    width: number;
    height: number;
  };
}

export interface CameraError extends Error {
  name:
    | "NotAllowedError"
    | "NotFoundError"
    | "NotReadableError"
    | "OverconstrainedError"
    | "SecurityError"
    | "TypeError"
    | "AbortError";
}

export interface CameraCapabilities {
  facingMode?: string[];
  width?: {
    min: number;
    max: number;
  };
  height?: {
    min: number;
    max: number;
  };
  frameRate?: {
    min: number;
    max: number;
  };
}

export interface CameraSettings {
  resolution: {
    width: number;
    height: number;
  };
  facingMode: "environment" | "user";
  frameRate: number;
  autoFocus: boolean;
  torch?: boolean; // For devices that support flashlight
}

export type CameraFacing = "environment" | "user";

export interface UseCameraControlReturn {
  // Refs
  videoRef: React.RefObject<HTMLVideoElement>;

  // State
  isStreaming: boolean;
  errors: string | null;
  videoConstraints: VideoConstraints;

  // Actions
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  switchCamera: () => void;
  setVideoConstraints: React.Dispatch<React.SetStateAction<VideoConstraints>>;
}
