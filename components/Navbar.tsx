import Image from "next/image";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 flex h-16 w-full items-center justify-center border-b border-white/10 bg-primary/80 backdrop-blur-sm">
      <Link className="flex items-center justify-center gap-4" href="/">
        <Image
          src="/images/left_icon.svg"
          alt="PIZZALAB Logo"
          width={48}
          height={48}
        />
        <div className="pl-[0.2em] text-center font-title text-2xl font-bold tracking-[0.2em] text-secondary">
          PIZZALAB
        </div>
        <Image
          src="/images/right_icon.svg"
          alt="PIZZALAB Logo"
          width={48}
          height={48}
        />

      </Link>
    </nav>
  );
}
