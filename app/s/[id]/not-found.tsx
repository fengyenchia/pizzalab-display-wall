import Link from "next/link";

export default function SessionNotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-primary px-6 text-center">
      <div className="flex flex-col items-center gap-8">
        <p className="text-xs tracking-[0.24em] text-white/45">404 / NOT FOUND</p>
        <h1 className="text-5xl sm:text-7xl">找不到這個遊玩成果</h1>
        <p className="text-white/60">成果可能不存在，或網址不正確。</p>
        <Link
          href="/"
          className="mt-10 inline-block border-b border-secondary pb-2 text-sm tracking-[0.16em] text-secondary"
        >
          返回拍立得牆
        </Link>
      </div>
    </main>
  );
}
