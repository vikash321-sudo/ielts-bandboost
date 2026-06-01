"use client";

import { useEffect, useState } from "react";
import type { VocabularyWord } from "@/lib/types";

export function VocabularyClient({ words }: { words: VocabularyWord[] }) {
  const [savedIds, setSavedIds] = useState<number[]>([]);

  useEffect(() => {
    setSavedIds(JSON.parse(localStorage.getItem("bandboost_words") || "[]") as number[]);
  }, []);

  function toggleWord(id: number) {
    const next = savedIds.includes(id) ? savedIds.filter((item) => item !== id) : [...savedIds, id];
    setSavedIds(next);
    localStorage.setItem("bandboost_words", JSON.stringify(next));
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-black">Vocabulary Bank</h1>
        <p className="mt-2 text-slate-600">Save useful IELTS words and examples for revision.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {words.map((word) => (
          <article key={word.id} className="rounded-3xl border bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{word.category}</p>
                <h2 className="mt-2 text-2xl font-black">{word.word}</h2>
              </div>
              <button
                type="button"
                onClick={() => toggleWord(word.id)}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${savedIds.includes(word.id) ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-700"}`}
              >
                {savedIds.includes(word.id) ? "Saved" : "Save"}
              </button>
            </div>
            <p className="mt-4 text-slate-700">{word.meaning}</p>
            <p className="mt-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">{word.example}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
