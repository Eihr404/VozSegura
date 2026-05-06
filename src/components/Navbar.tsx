import Link from "next/link";
import Image from "next/image";

type NavbarProps = {
  ctaHref?: string;
  ctaLabel?: string;
};

export function Navbar({ ctaHref = "/login", ctaLabel = "Acceso admin" }: NavbarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#140c2e]/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.svg" alt="Logo de VozSegura" width={42} height={42} />
          <div>
            <p className="text-lg font-semibold tracking-wide text-white">VozSegura</p>
            <p className="text-sm text-slate-300">Plataforma escolar segura</p>
          </div>
        </Link>

        <Link
          href={ctaHref}
          className="rounded-full border border-emerald-400/60 bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
        >
          {ctaLabel}
        </Link>
      </div>
    </header>
  );
}
