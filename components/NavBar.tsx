import Link from "next/link";
import { BookOpenCheck } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/learn", label: "Learn" },
  { href: "/practice", label: "Practice" },
  { href: "/writing", label: "Writing" },
  { href: "/tracker", label: "Tracker" },
  { href: "/vocabulary", label: "Vocabulary" }
];

export function NavBar() {
  return (
    <header className="border-b bg-white/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-slate-900">
          <span className="rounded-2xl bg-slate-900 p-2 text-white">
            <BookOpenCheck size={20} />
          </span>
          IELTS BandBoost
        </Link>
        <div className="hidden gap-2 sm:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
