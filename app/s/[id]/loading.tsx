export default function Loading() {
  return (
    <main className="min-h-screen animate-pulse bg-primary">
      <div className="mx-auto max-w-7xl px-6 py-10 md:px-12 md:py-16">
        <div className="h-3 w-32 rounded bg-white/10" />
        <div className="mx-auto mt-14 h-20 max-w-3xl rounded bg-white/10" />
        <div className="mx-auto mt-12 aspect-square max-w-2xl rounded bg-white/10" />
        <div className="mt-20 grid gap-6 md:grid-cols-2">
          <div className="aspect-[4/3] rounded bg-white/10" />
          <div className="aspect-[4/3] rounded bg-white/10" />
        </div>
      </div>
    </main>
  );
}
