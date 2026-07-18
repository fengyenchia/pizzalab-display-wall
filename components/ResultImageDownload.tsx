"use client";

import { useState } from "react";
import FadeIn from "@/components/fadeIn";

// Same slot measured off UI_Polaroid.png (see components/Polaroid.tsx) - the
// frame's photo slot is opaque art, not a transparent hole, so the photo has
// to be painted first and the frame drawn on top of it.
const FRAME_SRC = "/images/UI_Polaroid.png";
const FRAME_ASPECT = 1815 / 1488; // height / width
const SLOT = { top: 0.1074, left: 0.0746, right: 0.0645, bottom: 0.3069 };
const CAPTION_AREA = { top: 0.72, left: 0.09, right: 0.09, bottom: 0.06 };

const BOSS_NOTE_SRC = "/images/UI_bossreview.png";
const BOSS_NOTE_ASPECT = 897 / 2174; // height / width

// Same brand mark as components/Navbar.tsx: pizza-slice icons flanking
// "PIZZALAB" set in the site's pixel title font.
const LEFT_ICON_SRC = "/images/left_icon.svg";
const RIGHT_ICON_SRC = "/images/right_icon.svg";
const ICON_ASPECT = 42 / 54; // height / width
const TITLE_FONT = '"LoRes9OTWide", "Cubic 11", sans-serif';

const CANVAS_WIDTH = 1200;
const PADDING = 60;
const CONTENT_WIDTH = CANVAS_WIDTH - PADDING * 2;
const SECTION_GAP = 56;
const TITLE_HEIGHT = 64;
const PAGE_BACKGROUND = "#2b2b2b"; // matches --primary in app/globals.css
const ACCENT = "#ff4f4f"; // matches --secondary

type Photo = { image: string; caption: string };

type ResultImageDownloadProps = {
  cardImage: string | null;
  persona: string;
  hashtags: string[];
  photos: Photo[];
  bossComment: string;
  fileName: string;
};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`圖片載入失敗: ${src}`));
    // Cache-busting: a plain <img>/next/image on the page may already have
    // loaded this exact URL without crossOrigin, and the browser can reuse
    // that non-CORS-validated cache entry and fail (or taint the canvas).
    const sep = src.includes("?") ? "&" : "?";
    img.src = `${src}${sep}cb=${Date.now()}`;
  });
}

// Sample data has sessions whose JSON references a photo file that never
// actually made it into Data/photos/ (recorded but not copied over). One
// missing photo shouldn't sink the whole download - skip it instead.
async function safeLoadImage(src: string): Promise<HTMLImageElement | null> {
  try {
    return await loadImage(src);
  } catch (error) {
    console.warn("下載圖片時略過一張載入失敗的照片", error);
    return null;
  }
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const attempt = current ? `${current} ${word}` : word;
    if (ctx.measureText(attempt).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = attempt;
    }
  }
  if (current) lines.push(current);
  return lines;
}

// Draws one polaroid (frame + photo + caption text) at (x, y) with the given
// width; height follows the frame's own aspect ratio. Returns that height.
function drawPolaroid(
  ctx: CanvasRenderingContext2D,
  frame: HTMLImageElement,
  photo: HTMLImageElement | null,
  caption: string,
  x: number,
  y: number,
  width: number,
): number {
  const height = width * FRAME_ASPECT;
  const slotX = x + SLOT.left * width;
  const slotY = y + SLOT.top * height;
  const slotW = width - SLOT.left * width - SLOT.right * width;
  const slotH = height - SLOT.top * height - SLOT.bottom * height;

  // Same mistake as the live DOM Polaroid the first time around: the frame's
  // slot art is opaque, not a transparent hole, so it MUST be drawn first -
  // drawing it after the photo just paints over it and the photo vanishes.
  ctx.drawImage(frame, x, y, width, height);

  if (photo) {
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
  } else {
    // Mirrors the "NO PHOTO" placeholder in components/Polaroid.tsx, so a
    // missing/failed photo reads the same way here as it does on the page.
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.font = `${Math.round(width * 0.028)}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("NO PHOTO", slotX + slotW / 2, slotY + slotH / 2);
  }

  if (caption) {
    const areaX = x + CAPTION_AREA.left * width;
    const areaY = y + CAPTION_AREA.top * height;
    const areaW = width - CAPTION_AREA.left * width - CAPTION_AREA.right * width;
    const areaH = height - CAPTION_AREA.top * height - CAPTION_AREA.bottom * height;
    ctx.fillStyle = "#525252";
    ctx.font = `600 ${Math.round(width * 0.052)}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const lines = wrapText(ctx, caption, areaW);
    const lineHeight = width * 0.062;
    const startY = areaY + areaH / 2 - ((lines.length - 1) * lineHeight) / 2;
    lines.slice(0, 2).forEach((line, i) => {
      ctx.fillText(line, areaX + areaW / 2, startY + i * lineHeight, areaW);
    });
  }

  return height;
}

export function ResultImageDownload({
  cardImage,
  persona,
  hashtags,
  photos,
  bossComment,
  fileName,
}: ResultImageDownloadProps) {
  const [status, setStatus] = useState<"idle" | "working" | "error">("idle");

  async function handleDownload() {
    setStatus("working");
    try {
      const [frame, leftIcon, rightIcon, mainPhoto, bossNote, highlightPhotos] =
        await Promise.all([
          // These four are local static assets - a real failure here means
          // something is fundamentally broken, so they're allowed to reject
          // and fail the whole download instead of degrading silently.
          loadImage(FRAME_SRC),
          loadImage(LEFT_ICON_SRC),
          loadImage(RIGHT_ICON_SRC),
          cardImage ? safeLoadImage(cardImage) : Promise.resolve(null),
          bossComment ? safeLoadImage(BOSS_NOTE_SRC) : Promise.resolve(null),
          Promise.all(photos.map((p) => safeLoadImage(p.image))),
        ]);

      // Canvas text needs the font ready before the first fillText - a plain
      // CSS @font-face import doesn't get picked up otherwise.
      await document.fonts.load(`700 ${TITLE_HEIGHT}px ${TITLE_FONT}`);

      // ── layout math (top to bottom) ──
      const headerPolaroidWidth = 400;
      const headerHeight = headerPolaroidWidth * FRAME_ASPECT;

      const miniPerRow = 3;
      const miniGap = 32;
      const miniWidth = (CONTENT_WIDTH - miniGap * (miniPerRow - 1)) / miniPerRow;
      const miniHeight = miniWidth * FRAME_ASPECT;
      const miniRows = photos.length > 0 ? Math.ceil(photos.length / miniPerRow) : 0;
      const photosHeight =
        miniRows > 0 ? miniRows * miniHeight + (miniRows - 1) * miniGap : 0;

      const bossNoteHeight = bossNote ? CONTENT_WIDTH * BOSS_NOTE_ASPECT : 0;

      const canvasHeight =
        PADDING +
        TITLE_HEIGHT +
        SECTION_GAP +
        headerHeight +
        (photosHeight > 0 ? SECTION_GAP + photosHeight : 0) +
        (bossNoteHeight > 0 ? SECTION_GAP + bossNoteHeight : 0) +
        PADDING;

      const canvas = document.createElement("canvas");
      canvas.width = CANVAS_WIDTH;
      canvas.height = Math.round(canvasHeight);
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("無法建立 canvas context");

      ctx.fillStyle = PAGE_BACKGROUND;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // ── title: pizza icon · PIZZALAB · pizza icon, same mark as Navbar.tsx ──
      ctx.font = `700 32px ${TITLE_FONT}`;
      const titleText = "PIZZALAB";
      const titleTextWidth = ctx.measureText(titleText).width;
      const iconHeight = 40;
      const iconWidth = iconHeight / ICON_ASPECT;
      const iconGap = 20;
      const titleBlockWidth = iconWidth * 2 + iconGap * 2 + titleTextWidth;
      const titleStartX = (CANVAS_WIDTH - titleBlockWidth) / 2;
      const titleCenterY = PADDING + TITLE_HEIGHT / 2;

      ctx.drawImage(leftIcon, titleStartX, titleCenterY - iconHeight / 2, iconWidth, iconHeight);
      ctx.fillStyle = ACCENT;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(titleText, titleStartX + iconWidth + iconGap, titleCenterY);
      ctx.drawImage(
        rightIcon,
        titleStartX + iconWidth + iconGap + titleTextWidth + iconGap,
        titleCenterY - iconHeight / 2,
        iconWidth,
        iconHeight,
      );

      // ── header: main polaroid + persona/hashtags ──
      const headerY = PADDING + TITLE_HEIGHT + SECTION_GAP;
      drawPolaroid(ctx, frame, mainPhoto, "", PADDING, headerY, headerPolaroidWidth);

      const textX = PADDING + headerPolaroidWidth + 50;
      const textWidth = CANVAS_WIDTH - PADDING - textX;
      let textY = headerY + headerHeight * 0.32;

      ctx.fillStyle = ACCENT;
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";
      ctx.font = "700 44px sans-serif";
      for (const line of wrapText(ctx, persona, textWidth)) {
        ctx.fillText(line, textX, textY);
        textY += 52;
      }

      textY += 20;
      ctx.font = "600 26px sans-serif";
      for (const tag of hashtags) {
        ctx.fillText(tag, textX, textY);
        textY += 42;
      }

      // ── highlight photos, in polaroid frames ──
      let cursorY = headerY + headerHeight;
      if (miniRows > 0) {
        cursorY += SECTION_GAP;
        photos.forEach((photo, i) => {
          const row = Math.floor(i / miniPerRow);
          const col = i % miniPerRow;
          const px = PADDING + col * (miniWidth + miniGap);
          const py = cursorY + row * (miniHeight + miniGap);
          drawPolaroid(ctx, frame, highlightPhotos[i], photo.caption, px, py, miniWidth);
        });
        cursorY += photosHeight;
      }

      // ── boss note ──
      if (bossNote) {
        cursorY += SECTION_GAP;
        ctx.drawImage(bossNote, PADDING, cursorY, CONTENT_WIDTH, bossNoteHeight);

        ctx.fillStyle = "#2b2b2b";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "22px sans-serif";
        const noteTextWidth = CONTENT_WIDTH * 0.72;
        const lines = wrapText(ctx, bossComment, noteTextWidth);
        const lineHeight = 30;
        const startY = cursorY + bossNoteHeight / 2 - ((lines.length - 1) * lineHeight) / 2;
        lines.forEach((line, i) => {
          ctx.fillText(line, PADDING + CONTENT_WIDTH / 2, startY + i * lineHeight);
        });
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
    <FadeIn className="border-t border-white/40 pt-8 text-center">
      <p className="mb-2 text-[8px] tracking-[0.24em] text-white/45 md:mb-4 md:text-xs">
        KEEP YOUR RESULT
      </p>
      <h2 className="text-md text-white! md:text-2xl">下載成果圖片</h2>
      <button
        type="button"
        onClick={handleDownload}
        disabled={status === "working"}
        className="mt-4 inline-flex min-h-12 items-center justify-center rounded-sm border border-secondary bg-secondary px-8 text-sm tracking-[0.16em] text-white transition-all duration-600 disabled:opacity-60 cursor-pointer hover:scale-102"
      >
        {status === "working"
          ? "產生中..."
          : status === "error"
            ? "下載失敗,再試一次"
            : "DOWNLOAD IMAGE"}
      </button>
    </FadeIn>
  );
}
