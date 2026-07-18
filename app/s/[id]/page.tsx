import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import FadeIn from "@/components/fadeIn";
import { Polaroid } from "@/components/Polaroid";
import { ResultImageDownload } from "@/components/ResultImageDownload";
import { getImageUrl, getSession } from "@/lib/api/sessions";

export const dynamic = "force-dynamic";

type SessionPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({
  params,
}: SessionPageProps): Promise<Metadata> {
  const { id } = await params;
  const session = await getSession(id);

  return session
    ? {
        title: session.card.persona,
        description: session.card.hashtags.join("、"),
      }
    : { title: "找不到資料" };
}

export default async function SessionPage({ params }: SessionPageProps) {
  const { id } = await params;
  const session = await getSession(id);

  if (!session) {
    notFound();
  }

  const cardImage = getImageUrl(session.card.image);

  return (
    <main className="bg-primary">
      <article className="mx-auto flex flex-col gap-12 px-6 py-8 md:px-20">
        <FadeIn>
          <Link
            href="/"
            className="rounded-sm border border-foreground p-2 text-xs tracking-[0.18em] text-foreground transition-all duration-600 hover:border-secondary hover:text-secondary"
          >
            BACK TO ALL WORKS
          </Link>
        </FadeIn>

        <FadeIn>
          <header className="md:pt-12 text-center">
            <div className="mx-auto flex w-full flex-col items-center gap-4 md:flex-row md:gap-20">
              <div className="w-full max-w-100 transition-transform duration-600 hover:scale-[0.98]">
                <Polaroid
                  imageSrc={cardImage}
                  alt={session.card.persona}
                  hashtags={session.card.hashtags}
                  priority
                />
              </div>
              <div className="flex flex-col text-start md:gap-20">
                <h1 className="w-full text-center text-lg leading-tight md:text-start md:text-5xl">
                  {session.card.persona}
                </h1>
                <ul className="flex gap-4 text-start md:flex-col">
                  {session.card.hashtags.map((hashtag) => (
                    <li
                      key={hashtag}
                      className="py-2 text-xs text-white/70 md:text-xl"
                    >
                      {hashtag}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </header>
        </FadeIn>

        <section>
          <h2 className="mb-8 text-2xl md:text-3xl">場景與客人照片</h2>
          {session.photos.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-3">
              {session.photos.map((photo, index) => {
                const photoUrl = getImageUrl(photo.image);

                return (
                  <FadeIn key={`${photo.image}-${photo.gameTime}-${index}`}>
                    <div className="relative aspect-square overflow-hidden border">
                      {photoUrl ? (
                        <Image
                          src={photoUrl}
                          alt={photo.caption || `場景與客人照片 ${index + 1}`}
                          fill
                          className="object-cover transition-transform duration-600 hover:scale-105"
                          sizes="(min-width: 768px) 50vw, 100vw"
                        />
                      ) : null}
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          ) : (
            <p className="border border-white/20 py-12 text-center text-white/50">
              這場沒有照片
            </p>
          )}
        </section>

        {session.bossComment ? (
          <FadeIn>
            <h2 className="text-2xl md:text-3xl">老闆紙條</h2>
            <div className="relative mx-auto aspect-video w-full overflow-hidden bg-primary transition-all duration-600 hover:scale-98">
              <Image
                src="/images/UI_bossreview.png"
                alt="老闆紙條"
                fill
                className="object-contain"
                sizes="(min-width: 768px) 768px, 100vw"
              />
              <div className="absolute inset-0 flex items-center justify-center p-[12%] text-center">
                <p className="max-w-3xl text-[8px] leading-4 text-primary md:text-xl md:leading-10 mt-6 md:mt-8">
                  {session.bossComment}
                </p>
              </div>
            </div>
          </FadeIn>
        ) : null}

        <ResultImageDownload
          cardImage={cardImage}
          persona={session.card.persona}
          hashtags={session.card.hashtags}
          photos={session.photos.map((p) => ({
            image: getImageUrl(p.image) ?? "",
            caption: p.caption,
          }))}
          bossComment={session.bossComment}
          fileName={`pizzalab_${session.id}`}
        />
      </article>
    </main>
  );
}
