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
    <Link className="group block text-white" href={`/s/${id}`}>
      <article>
        <div className="transition-transform duration-500 group-hover:scale-[0.98]">
          <Polaroid
            imageSrc={imageSrc}
            alt={`${title} 拍立得`}
            hashtags={hashtags}
          />
        </div>
        {title ? (
          <h2 className="pt-4 text-center text-xl leading-tight text-secondary">
            {title}
          </h2>
        ) : null}
      </article>
    </Link>
  );
}
