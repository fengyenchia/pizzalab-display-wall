"use client";

import { useRef, useState } from "react";
import html2canvas from "html2canvas-pro";
import FadeIn from "@/components/fadeIn";

// Matches --primary in app/globals.css - html2canvas needs an explicit
// background since it rasterizes the DOM, it doesn't inherit page bg.
const PAGE_BACKGROUND = "#2b2b2b";

type ResultCaptureProps = {
  children: React.ReactNode;
  fileName: string;
};

export function ResultCapture({ children, fileName }: ResultCaptureProps) {
  const captureRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"idle" | "working" | "error">("idle");

  async function handleDownload() {
    if (!captureRef.current) return;
    setStatus("working");
    try {
      const canvas = await html2canvas(captureRef.current, {
        backgroundColor: PAGE_BACKGROUND,
        useCORS: true,
        scale: Math.min(2, window.devicePixelRatio || 1),
      });

      const blob: Blob | null = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png"),
      );
      if (!blob) throw new Error("canvas.toBlob 回傳空值");

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${fileName}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setStatus("idle");
    } catch (error) {
      console.error("下載總結圖片失敗", error);
      setStatus("error");
    }
  }

  return (
    <>
      <div ref={captureRef} className="flex flex-col gap-12">
        {children}
      </div>

      <FadeIn className="border-t border-white/40 pt-8 text-center">
        <p className="mb-2 text-[8px] tracking-[0.24em] text-white/45 md:mb-4 md:text-xs">
          KEEP YOUR RESULT
        </p>
        <h2 className="text-md text-white! md:text-2xl">下載你的總結圖片</h2>
        <button
          type="button"
          onClick={handleDownload}
          disabled={status === "working"}
          className="mt-4 inline-flex min-h-12 items-center justify-center rounded-sm border border-secondary bg-secondary px-8 text-sm tracking-[0.16em] text-white transition-opacity disabled:opacity-60"
        >
          {status === "working"
            ? "產生中..."
            : status === "error"
              ? "下載失敗,再試一次"
              : "DOWNLOAD IMAGE"}
        </button>
      </FadeIn>
    </>
  );
}
