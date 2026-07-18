import { CardGrid } from "@/components/CardGrid";
import FadeIn from "@/components/fadeIn";
import { getAllWorks } from "@/lib/api/works";

export default async function Home() {
  const works = await getAllWorks();

  const cards = works.map((work) => ({
    slug: work.slug,
    imageSrc: work.cardImage,
    title: work.personality,
    category: work.tags.join(" "),
  }));

  return (
    <div className="min-h-screen bg-primary text-foreground">
      <main>
        <section
          id="works"
          className="bg-primary px-4 py-8 md:px-12 md:py-12"
        >
          <div className="mx-auto max-w-7xl">
            {cards.length > 0 ? (
              <FadeIn>
                <CardGrid items={cards} />
              </FadeIn>
            ) : (
              <p className="py-24 text-center text-white/60">目前尚無作品。</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
