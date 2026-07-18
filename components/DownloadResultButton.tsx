"use client";

import { useState } from "react";

// Mirrors the slot/hashtag-area insets measured in components/Polaroid.tsx,
// so the downloaded PNG matches what's actually shown on the page.
const SLOT = { top: 0.1074, left: 0.0746, right: 0.0645, bottom: 0.3069 };
const HASHTAG_AREA = { top: 0.72, left: 0.09, right: 0.09, bottom: 0.06 };

type DownloadResultButtonProps = {
  frameSrc: string;
  photoSrc: string | null;
  hashtags: string[];
  fileName: string;
};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    // Needed so the backend-hosted photo (a different origin) doesn't taint
    // the canvas - relies on the API's Access-Control-Allow-Origin: *.
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`圖片載入失敗: ${src}`));
    // The plain <img>/next/image on the page already loaded this exact URL
    // WITHOUT crossOrigin - the browser can reuse that non-CORS-validated
    // cache entry for a same-URL crossOrigin request and fail to load it.
    // A cache-busting param forces a fresh, CORS-validated fetch.
    const separator = src.includes("?") ? "&" : "?";
    img.src = `${src}${separator}cb=${Date.now()}`;
  });
}

export function DownloadResultButton({
  frameSrc,
  photoSrc,
  hashtags,
  fileName,
}: DownloadResultButtonProps) {
  const [status, setStatus] = useState<"idle" | "working" | "error">("idle");

  async function handleDownload() {
    setStatus("working");
    try {
      const frame = await loadImage(frameSrc);
      const canvas = document.createElement("canvas");
      canvas.width = frame.naturalWidth;
      canvas.height = frame.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("無法建立 canvas context");

      // Photo goes down first - the frame's slot art is opaque, not a
      // transparent cutout, so it has to be painted on top of the photo.
      if (photoSrc) {
        const photo = await loadImage(photoSrc);
        const slotX = SLOT.left * canvas.width;
        const slotY = SLOT.top * canvas.height;
        const slotW = canvas.width - slotX - SLOT.right * canvas.width;
        const slotH = canvas.height - slotY - SLOT.bottom * canvas.height;

        // object-cover behavior: scale to fill, center-crop the overflow.
        const scale = Math.max(slotW / photo.naturalWidth, slotH / photo.naturalHeight);
        const drawW = photo.naturalWidth * scale;
        const drawH = photo.naturalHeight * scale;

        ctx.save();
        ctx.beginPath();
        ctx.rect(slotX, slotY, slotW, slotH);
        ctx.clip();
        ctx.drawImage(
          photo,
          slotX + (slotW - drawW) / 2,
          slotY + (slotH - drawH) / 2,
          drawW,
          drawH,
        );
        ctx.restore();
      }

      ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);

      if (hashtags.length > 0) {
        const areaX = HASHTAG_AREA.left * canvas.width;
        const areaY = HASHTAG_AREA.top * canvas.height;
        const areaW = canvas.width - areaX - HASHTAG_AREA.right * canvas.width;
        const areaH = canvas.height - areaY - HASHTAG_AREA.bottom * canvas.height;
        ctx.fillStyle = "#525252";
        ctx.font = `600 ${Math.round(canvas.width * 0.028)}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(hashtags.join("   "), areaX + areaW / 2, areaY + areaH / 2, areaW);
      }

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
  );
}
