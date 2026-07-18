import Link from "next/link";
import { Polaroid } from "@/components/Polaroid";

type CardProps = {
  id: string;
  imageSrc: string | null;
  title: string;
  hashtags: string[];
};

export function Card({ id, imageSrc, title, hashtags }: CardProps) {
  return (
    <Link
      className="group block w-full min-w-0 max-w-sm justify-self-center text-white"
      href={`/s/${id}`}
    >
      <article className="flex h-full min-w-0 flex-col">
        <div className="transition-transform duration-600 group-hover:scale-[0.98]">
          <Polaroid
            imageSrc={imageSrc}
            alt={`${title} 拍立得`}
            hashtags={hashtags}
          />
        </div>
        {/* {title ? (
          <h2 className="flex items-start justify-center px-2 text-center text-lg leading-snug text-secondary wrap-anywhere md:text-xl">
            {title}
          </h2>
        ) : null} */}
      </article>
    </Link>
  );
}
