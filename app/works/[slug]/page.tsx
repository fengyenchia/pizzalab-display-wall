import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import FadeIn from "@/components/fadeIn";
import { getWork } from "@/lib/api/works";
import { mockWorks } from "@/lib/mock/works";

type WorkPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return mockWorks.map((work) => ({ slug: work.slug }));
}

export async function generateMetadata({
  params,
}: WorkPageProps): Promise<Metadata> {
  const { slug } = await params;
  const work = await getWork(slug);

  return work
    ? {
        title: work.personality,
        description: work.tags.join("、"),
      }
    : { title: "找不到資料" };
}

export default async function WorkPage({ params }: WorkPageProps) {
  const { slug } = await params;
  const work = await getWork(slug);

  if (!work) {
    notFound();
  }

  return (
    <main className="bg-primary">
      <article className="flex flex-col gap-12 mx-auto px-6 md:px-20 py-8">
        <FadeIn>
          <Link
            href="/"
            className="border border-foreground rounded-sm p-2 text-xs tracking-[0.18em] text-foreground transition-all duration-600 hover:border-secondary hover:text-secondary"
          >
            BACK TO ALL WORKS
          </Link>

          <header className="pt-12 text-center">
            
            <div className="w-full mx-auto flex flex-col md:flex-row gap-4 md:gap-12 items-center">
                <Image
                    src={work.cardImage}
                    alt={work.cardImage}
                    width={400}
                    height={400}
                    className="object-cover object-center transition-transform duration-600 hover:scale-[0.98]"
                    sizes="(min-width: 768px) 33vw, 100vw"
                />
                <div className="flex flex-col text-start md:gap-12">
                    <h1 className="w-full text-center md:text-start text-lg md:text-5xl leading-tight">
                    {work.personality}
                    </h1>
                    <ul className="flex md:flex-col gap-4 text-start">
                    {work.tags.map((tag) => (
                        <li
                        key={tag}
                        className="rounded-sm md:px-4 py-2 text-xs md:text-lg text-white/70"
                        >
                        {tag}
                        </li>
                    ))}
                    </ul>
                </div>
                
            </div>

          </header>
        </FadeIn>

        <section className="">
          <h2 className="mb-8 text-2xl md:text-3xl">場景客人照片</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {work.scenePhotos.map((photo, index) => (
              <FadeIn key={`${photo}-${index}`}>
                <div className="relative aspect-square overflow-hidden border">
                  <Image
                    src={photo}
                    alt={`場景客人照片 ${index + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-600"
                    sizes="(min-width: 768px) 50vw, 100vw"
                  />
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        <FadeIn className="">
          <h2 className="mb-8 text-2xl md:text-3xl">老闆紙條</h2>
          <div className="relative w-full mx-auto aspect-video overflow-hidden bg-primary">
            <Image
              src={work.noteImage}
              alt="老闆紙條"
              width={1920}
              height={1080}
              className="object-contain hover:scale-105 transition-transform duration-600"
              sizes="(min-width: 768px) 768px, 100vw"
            />
          </div>
        </FadeIn>

        <FadeIn className="text-center border-t pt-8 border-white/40">
          <p className="mb-2 md:mb-4 text-[8px] md:text-xs tracking-[0.24em] text-white/45">
            KEEP YOUR RESULT
          </p>
          <h2 className="text-md md:text-2xl text-white!">下載你的總結圖片</h2>
          <Link
            href={work.summaryImage}
            download={`${work.slug}-summary`}
            className="mt-4 inline-flex min-h-8 items-center justify-center rounded-sm border border-secondary bg-secondary px-8 text-sm tracking-[0.16em] text-white transition-all duration-600 hover:bg-transparent hover:scale-105"
          >
            DOWNLOAD IMAGE
          </Link>
        </FadeIn>
      </article>
    </main>
  );
}
