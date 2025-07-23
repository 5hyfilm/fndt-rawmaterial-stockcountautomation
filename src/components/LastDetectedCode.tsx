// ./src/components/LastDetectedCode.tsx
"use client";

import React from "react";
import { Copy, CheckCircle, QrCode } from "lucide-react";

interface LastDetectedCodeProps {
  code: string;
}

export const LastDetectedCode: React.FC<LastDetectedCodeProps> = ({ code }) => {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers - removed unused 'err' parameter
      const textArea = document.createElement("textarea");
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!code) return null;

  return (
    <div className="bg-gradient-to-r from-green-900 to-green-800 border border-green-500/50 rounded-xl p-4 lg:p-6 shadow-2xl">
      <h3 className="text-lg font-semibold mb-3 text-green-400 flex items-center gap-2">
        <QrCode size={20} />
        ผลลัพธ์ล่าสุด
      </h3>

      <div
        className="bg-black/70 rounded-lg p-3 lg:p-4 cursor-pointer hover:bg-black/80 transition-all duration-200 border border-green-500/30 hover:border-green-400/50"
        onClick={copyToClipboard}
      >
        <code className="text-green-300 text-sm lg:text-base font-mono break-all block leading-relaxed">
          {code}
        </code>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="text-xs text-green-300 flex items-center gap-1">
          {copied ? (
            <>
              <CheckCircle size={12} />
              คัดลอกแล้ว!
            </>
          ) : (
            <>
              <Copy size={12} />
              คลิกเพื่อคัดลอก
            </>
          )}
        </div>
        <div className="text-xs text-green-400 opacity-70">
          {code.length} ตัวอักษร
        </div>
      </div>
    </div>
  );
};
