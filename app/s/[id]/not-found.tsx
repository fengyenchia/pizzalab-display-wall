import Link from "next/link";

export default function SessionNotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-primary px-6 text-center">
      <div>
        <p className="text-xs tracking-[0.24em] text-white/45">404 / NOT FOUND</p>
        <h1 className="mt-5 text-5xl sm:text-7xl">找不到這個場次</h1>
        <p className="mt-6 text-white/60">場次可能不存在，或網址不正確。</p>
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
