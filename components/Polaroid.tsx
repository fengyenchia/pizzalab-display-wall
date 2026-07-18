import Image from "next/image";

// The polaroid frame PNG is 1488x1815. Its photo slot (the dark rectangle) and
// the white caption strip below it were measured from the asset itself, so the
// LLM clay photo drops exactly into the slot and the hashtags sit on the white
// border - matching the physical polaroid look the design asks for.
const FRAME_SRC = "/images/UI_Polaroid.png";
const FRAME_RATIO = "1488 / 1815";

// Photo slot insets (measured): the dark area is opaque, so the photo is layered
// ON TOP of the frame at these insets rather than behind it.
const SLOT = {
  top: "10.74%",
  left: "7.46%",
  right: "6.45%",
  bottom: "30.69%",
};

type PolaroidProps = {
  imageSrc: string | null;
  alt: string;
  hashtags?: string[];
  sizes?: string;
  priority?: boolean;
};

export function Polaroid({
  imageSrc,
  alt,
  hashtags = [],
  sizes = "(min-width: 768px) 33vw, 100vw",
  priority = false,
}: PolaroidProps) {
  return (
    <div
      className="relative w-full select-none"
      style={{ aspectRatio: FRAME_RATIO }}
    >
      {/* LLM clay photo, dropped into the dark slot (drawn under the frame edges
          via inset positioning; the frame sits above to keep its worn border). */}
      <div
        className="absolute overflow-hidden bg-black"
        style={{ top: SLOT.top, left: SLOT.left, right: SLOT.right, bottom: SLOT.bottom }}
      >
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={alt}
            fill
            className="object-cover object-center"
            sizes={sizes}
            priority={priority}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[10px] tracking-[0.2em] text-white/30">
            NO PHOTO
          </div>
        )}
      </div>

      {/* The frame itself, above the photo so its edges frame the slot cleanly. */}
      <Image
        src={FRAME_SRC}
        alt=""
        aria-hidden
        fill
        className="pointer-events-none object-contain"
        sizes={sizes}
        priority={priority}
      />

      {/* Hashtags on the white caption strip below the slot. */}
      {hashtags.length > 0 ? (
        <div
          className="absolute flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center"
          style={{ top: "72%", left: "9%", right: "9%", bottom: "6%" }}
        >
          {hashtags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-semibold tracking-[0.08em] text-neutral-600 md:text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
