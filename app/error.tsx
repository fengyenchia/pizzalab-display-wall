"use client";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#242424] px-6 text-center">
      <div>
        <p className="text-xs tracking-[0.24em] text-white/45">DATA ERROR</p>
        <h1 className="mt-5 text-5xl sm:text-7xl">作品載入失敗</h1>
        <p className="mt-6 text-white/60">請確認後端服務或網路連線後再試一次。</p>
        <button
          type="button"
          onClick={reset}
          className="mt-10 cursor-pointer border-b border-secondary pb-2 text-sm tracking-[0.16em] text-secondary"
        >
          重新載入
        </button>
      </div>
    </main>
  );
}
