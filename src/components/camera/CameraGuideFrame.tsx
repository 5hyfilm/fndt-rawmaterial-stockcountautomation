// src/components/camera/CameraGuideFrame.tsx
"use client";

import React from "react";

interface CameraGuideFrameProps {
  size?: "small" | "medium" | "large";
}

export const CameraGuideFrame: React.FC<CameraGuideFrameProps> = ({
  size = "medium",
}) => {
  // Define sizes
  const sizeClasses = {
    small: "w-48 h-48",
    medium: "w-64 h-64",
    large: "w-80 h-80",
  };

  const cornerSize = {
    small: "w-6 h-6",
    medium: "w-8 h-8",
    large: "w-10 h-10",
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Main Frame */}
        <div className="relative w-full h-full border-2 border-fn-green/70 rounded-lg">
          {/* Corner Markers */}
          <div
            className={`absolute top-0 left-0 ${cornerSize[size]} border-t-4 border-l-4 border-fn-green`}
          ></div>
          <div
            className={`absolute top-0 right-0 ${cornerSize[size]} border-t-4 border-r-4 border-fn-green`}
          ></div>
          <div
            className={`absolute bottom-0 left-0 ${cornerSize[size]} border-b-4 border-l-4 border-fn-green`}
          ></div>
          <div
            className={`absolute bottom-0 right-0 ${cornerSize[size]} border-b-4 border-r-4 border-fn-green`}
          ></div>
        </div>
      </div>
    </div>
  );
};
