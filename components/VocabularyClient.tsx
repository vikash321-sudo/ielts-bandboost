"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { VocabularyWord } from "@/lib/types";

type SavedWordRow = {
  word: string;
  meaning: string | null;
  example: string | null;
};

export function VocabularyClient({ words }: { words: VocabularyWord[] }) {
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [source, setSource] = useState<"browser" | "cloud">("browser");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadSavedWords() {
      const localIds = JSON.parse(
        localStorage.getItem("bandboost_words") || "[]"
      ) as number[];

      setSavedIds(localIds);

      if (!supabase) {
        setSource("browser");
        setLoading(false);
        return;
      }

      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setSource("browser");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("saved_words")
        .select("word, meaning, example")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to load cloud vocabulary:", error.message);
        setSource("browser");
        setLoading(false);
        return;
      }

      const cloudRows = data as SavedWordRow[];

      const cloudIds = words
        .filter((item) =>
          cloudRows.some(
            (saved) => saved.word.toLowerCase() === item.word.toLowerCase()
          )
        )
        .map((item) => item.id);

      setSavedIds(cloudIds);
      localStorage.setItem("bandboost_words", JSON.stringify(cloudIds));
      setSource("cloud");
      setLoading(false);
    }

    loadSavedWords();
  }, [words]);

  async function toggleWord(word: VocabularyWord) {
    const isAlreadySaved = savedIds.includes(word.id);

    const nextIds = isAlreadySaved
      ? savedIds.filter((item) => item !== word.id)
      : [...savedIds, word.id];

    setSavedIds(nextIds);
    localStorage.setItem("bandboost_words", JSON.stringify(nextIds));

    if (!supabase) {
      setMessage("Saved in browser only. Supabase is not configured.");
      return;
    }

    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setMessage("Saved in browser only. Login to save vocabulary online.");
      return;
    }

    if (isAlreadySaved) {
      const { error } = await supabase
        .from("saved_words")
        .delete()
        .eq("user_id", user.id)
        .eq("word", word.word);

      if (error) {
        console.error("Cloud vocabulary delete failed:", error.message);
        setMessage("Removed in browser, but cloud delete failed.");
        return;
      }

      setMessage("Word removed from your Supabase vocabulary bank.");
      return;
    }

    const { error } = await supabase.from("saved_words").insert({
      user_id: user.id,
      word: word.word,
      meaning: word.meaning,
      example: word.example
    });

    if (error) {
      console.error("Cloud vocabulary save failed:", error.message);
      setMessage("Saved in browser, but cloud save failed.");
      return;
    }

    setMessage("Word saved to your Supabase vocabulary bank.");
  }

  const savedWords = words.filter((word) => savedIds.includes(word.id));

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-black">Vocabulary Bank</h1>

        <p className="mt-2 text-slate-600">
          {loading
            ? "Loading saved words..."
            : source === "cloud"
              ? "Vocabulary is loaded from your Supabase account."
              : "Vocabulary is stored in this browser. Login to save online."}
        </p>

        {message ? (
          <p className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-700">
            {message}
          </p>
        ) : null}
      </div>

      <section className="rounded-3xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black">Saved Words</h2>

        {savedWords.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {savedWords.map((word) => (
              <span
                key={word.id}
                className="rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white"
              >
                {word.word}
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-500">
            No saved words yet. Save useful IELTS words from the list below.
          </p>
        )}
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        {words.map((word) => {
          const isSaved = savedIds.includes(word.id);

          return (
            <article
              key={word.id}
              className="rounded-3xl border bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    {word.category}
                  </p>

                  <h2 className="mt-2 text-2xl font-black">{word.word}</h2>
                </div>

                <button
                  type="button"
                  onClick={() => toggleWord(word)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    isSaved
                      ? "bg-slate-950 text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {isSaved ? "Saved" : "Save"}
                </button>
              </div>

              <p className="mt-4 text-slate-700">{word.meaning}</p>

              <p className="mt-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                {word.example}
              </p>
            </article>
          );
        })}
      </div>
    </div>
  );
}