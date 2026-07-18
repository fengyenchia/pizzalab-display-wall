import Link from "next/link";
import Image from "next/image";

type CardProps = {
  slug: string;
  imageSrc: string;
  title: string;
  category: string;
};

export function Card({
  slug,
  imageSrc,
  title,
  category,
}: CardProps) {
  return (
    <Link className="group block text-white" href={`/works/${slug}`}>
      <article>
        <div className="relative aspect-square overflow-hidden bg-white/5">
          <Image
            src={imageSrc}
            alt={imageSrc}
            fill
            className="object-cover object-center transition-transform duration-500 group-hover:scale-[0.98]"
            sizes="(min-width: 768px) 33vw, 100vw"
          />
        </div>
        <div className="flex items-center justify-between gap-4 pt-4">
          <h2 className="text-xl leading-tight text-secondary">{title}</h2>
          <span className="shrink-0 text-right text-[10px] tracking-[0.14em] text-white/50">
            {category}
          </span>
        </div>
      </article>
    </Link>
  );
}
