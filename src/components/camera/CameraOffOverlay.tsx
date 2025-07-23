// src/components/camera/CameraOffOverlay.tsx
"use client";

import React from "react";

export const CameraOffOverlay: React.FC = () => {
  return (
    <div className="absolute inset-0 bg-gray-100/95 backdrop-blur-sm flex items-center justify-center">
      <div className="text-center max-w-sm mx-auto p-6">
        {/* Visual Guide */}
      </div>
    </div>
  );
};
