import type { Metadata } from "next";
import "./globals.css";
import { NavBar } from "@/components/NavBar";
import { DiagnosticGate } from "@/components/DiagnosticGate";

export const metadata: Metadata = {
  title: "IELTS BandBoost",
  description: "IELTS learning, practice, band tracking, and AI writing feedback."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NavBar />

        <DiagnosticGate>
          <main className="mx-auto max-w-6xl px-4 py-6 pb-28 sm:px-6 sm:py-8 lg:px-8">
            {children}
          </main>
        </DiagnosticGate>
      </body>
    </html>
  );
}