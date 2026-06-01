"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export function DiagnosticGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkDiagnosticStatus() {
      if (!supabase) {
        setChecking(false);
        return;
      }

      if (
        pathname.startsWith("/login") ||
        pathname.startsWith("/diagnostic")
      ) {
        setChecking(false);
        return;
      }

      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {
        setChecking(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("diagnostic_completed")
        .eq("id", user.id)
        .single();

      if (error) {
        setChecking(false);
        return;
      }

      if (!data?.diagnostic_completed) {
        router.replace("/diagnostic");
        return;
      }

      setChecking(false);
    }

    checkDiagnosticStatus();
  }, [pathname, router]);

  if (checking) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10 pb-28 sm:px-6 lg:px-8">
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          Checking your IELTS profile...
        </div>
      </main>
    );
  }

  return <>{children}</>;
}