import { CardGrid } from "@/components/CardGrid";
import FadeIn from "@/components/fadeIn";
import { getAllSessions, getImageUrl } from "@/lib/api/sessions";

export default async function Home() {
  const sessions = await getAllSessions();

  const cards = sessions.map((session) => ({
    id: session.id,
    imageSrc: getImageUrl(session.cardImage),
    title: session.persona,
    hashtags: session.hashtags,
  }));

  return (
    <main className="min-h-screen bg-primary text-foreground">
      <section id="sessions" className="px-4 py-8 md:px-12 md:py-12">
        <div className="mx-auto max-w-7xl">
          {cards.length > 0 ? (
            <FadeIn>
              <CardGrid items={cards} />
            </FadeIn>
          ) : (
            <p className="py-24 text-center text-white/60">目前尚無遊玩紀錄。</p>
          )}
        </div>
      </section>
    </main>
  );
}
