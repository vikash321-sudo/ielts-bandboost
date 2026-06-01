"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BookOpenCheck,
  Home,
  BookOpen,
  Dumbbell,
  PencilLine,
  TrendingUp,
  BookMarked
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const desktopLinks = [
  { href: "/", label: "Home" },
  { href: "/learn", label: "Learn" },
  { href: "/practice", label: "Practice" },
  { href: "/writing", label: "Writing" },
  { href: "/tracker", label: "Tracker" },
  { href: "/vocabulary", label: "Vocabulary" }
];

const mobileLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/learn", label: "Learn", icon: BookOpen },
  { href: "/practice", label: "Practice", icon: Dumbbell },
  { href: "/writing", label: "Writing", icon: PencilLine },
  { href: "/tracker", label: "Tracker", icon: TrendingUp },
  { href: "/vocabulary", label: "Vocab", icon: BookMarked }
];

export function NavBar() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setEmail(session?.user.email ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    if (!supabase) return;

    await supabase.auth.signOut();
    setEmail(null);
    window.location.href = "/login";
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-slate-900"
          >
            <span className="rounded-2xl bg-slate-900 p-2 text-white">
              <BookOpenCheck size={20} />
            </span>

            <span className="text-sm sm:text-base">IELTS BandBoost</span>
          </Link>

          <div className="hidden items-center gap-2 lg:flex">
            {desktopLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              >
                {link.label}
              </Link>
            ))}

            {email ? (
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white"
              >
                Login
              </Link>
            )}
          </div>

          <div className="lg:hidden">
            {email ? (
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full bg-slate-950 px-4 py-2 text-xs font-bold text-white"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="rounded-full bg-slate-950 px-4 py-2 text-xs font-bold text-white"
              >
                Login
              </Link>
            )}
          </div>
        </nav>
      </header>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white/95 px-2 py-2 shadow-lg backdrop-blur lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-6 gap-1">
          {mobileLinks.map((link) => {
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex flex-col items-center justify-center rounded-2xl px-1 py-2 text-[10px] font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-950"
              >
                <Icon size={18} />
                <span className="mt-1">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}