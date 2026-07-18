import Image from "next/image";
import Link from "next/link";

type CardProps = {
  id: string;
  imageSrc: string | null;
  title: string;
  hashtags: string[];
};

export function Card({ id, imageSrc, title, hashtags }: CardProps) {
  return (
    <Link className="group block text-white" href={`/s/${id}`}>
      <article>
        <div className="relative aspect-3/4 overflow-hidden bg-white/5">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={`${title} 拍立得`}
              fill
              className="object-cover object-center transition-transform duration-500 group-hover:scale-[0.98]"
              sizes="(min-width: 768px) 33vw, 100vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs tracking-[0.18em] text-white/35">
              IMAGE UNAVAILABLE
            </div>
          )}
        </div>
        <div className="flex items-start justify-between gap-4 pt-4">
          <h2 className="text-xl leading-tight text-secondary">{title}</h2>
          {hashtags.length > 0 ? (
            <span className="max-w-1/2 text-right text-[10px] leading-5 tracking-[0.12em] text-white/50">
              {hashtags.join(" ")}
            </span>
          ) : null}
        </div>
      </article>
    </Link>
  );
}
