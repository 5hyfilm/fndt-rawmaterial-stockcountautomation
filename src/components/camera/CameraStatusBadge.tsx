// src/components/camera/CameraStatusBadge.tsx
interface CameraStatusBadgeProps {
  isStreaming: boolean;
}

export const CameraStatusBadge: React.FC<CameraStatusBadgeProps> = ({
  isStreaming,
}) => {
  return (
    <p className="text-xs text-gray-600 flex items-center gap-1">
      <span
        className={`w-2 h-2 rounded-full ${
          isStreaming ? "bg-green-500" : "bg-red-500"
        }`}
      ></span>
      {isStreaming ? "กำลังทำงาน" : "หยุดทำงาน"}
    </p>
  );
};
