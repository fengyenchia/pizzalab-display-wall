export default function Loading() {
  return (
    <main className="min-h-screen animate-pulse bg-[#242424]">
      <div className="mx-auto max-w-7xl px-6 py-10 md:px-12 md:py-16">
        <div className="h-3 w-32 rounded bg-white/10" />
        <div className="mt-14 h-20 max-w-3xl rounded bg-white/10" />
        <div className="mt-12 aspect-[16/9] rounded bg-white/10" />
        <div className="mx-auto mt-20 h-32 max-w-3xl rounded bg-white/10" />
      </div>
    </main>
  );
}
