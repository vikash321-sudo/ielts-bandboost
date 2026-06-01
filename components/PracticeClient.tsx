"use client";

import { useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { PracticeQuestion, ProgressRecord } from "@/lib/types";

type Props = {
  questions: PracticeQuestion[];
  selectedSet?: string;
};

function estimateBand(correct: number, total: number) {
  const accuracy = total === 0 ? 0 : correct / total;

  if (accuracy >= 0.9) return 8;
  if (accuracy >= 0.8) return 7;
  if (accuracy >= 0.7) return 6.5;
  if (accuracy >= 0.6) return 6;
  if (accuracy >= 0.5) return 5.5;
  if (accuracy >= 0.4) return 5;

  return 4.5;
}

function findWeakArea(
  items: PracticeQuestion[],
  answers: Record<number, string>
) {
  const wrong = items.filter(
    (question) =>
      answers[question.id] && answers[question.id] !== question.answer
  );

  if (!wrong.length) {
    return "No major weak area detected";
  }

  const counts = wrong.reduce<Record<string, number>>((acc, question) => {
    const key = `${question.skill} - ${question.type}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

export function PracticeClient({ questions, selectedSet }: Props) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const activeQuestions = useMemo(() => {
    if (!selectedSet) return questions;

    return questions.filter(
      (question) => String(question.practiceSetId) === selectedSet
    );
  }, [questions, selectedSet]);

  const answeredCount = activeQuestions.filter(
    (question) => answers[question.id]
  ).length;

  const correct = activeQuestions.filter(
    (question) => answers[question.id] === question.answer
  ).length;

  const band = estimateBand(correct, activeQuestions.length);
  const weakArea = findWeakArea(activeQuestions, answers);

  async function submitPractice() {
    if (activeQuestions.length === 0) return;

    setSubmitted(true);
    setSaveMessage("Saving progress...");

    const record: ProgressRecord = {
      date: new Date().toISOString(),
      skill: activeQuestions[0]?.skill || "Reading",
      score: correct,
      total: activeQuestions.length,
      band,
      weakArea
    };

    const previous = JSON.parse(
      localStorage.getItem("bandboost_progress") || "[]"
    ) as ProgressRecord[];

    localStorage.setItem(
      "bandboost_progress",
      JSON.stringify([record, ...previous].slice(0, 20))
    );

    if (!supabase) {
      setSaveMessage("Saved in browser only. Supabase is not configured.");
      return;
    }

    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setSaveMessage("Saved in browser only. Login to save online.");
      return;
    }

    const { error } = await supabase.from("practice_attempts").insert({
      user_id: user.id,
      skill: record.skill,
      score: record.score,
      total: record.total,
      estimated_band: record.band,
      weak_area: record.weakArea
    });

    if (error) {
      console.error("Supabase progress save failed:", error.message);
      setSaveMessage("Saved in browser, but cloud save failed.");
      return;
    }

    setSaveMessage("Progress saved to your Supabase account.");
  }

  function resetPractice() {
    setAnswers({});
    setSubmitted(false);
    setSaveMessage("");
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-black">Practice Zone</h1>
        <p className="mt-2 text-slate-600">
          Answer the questions. Your result will be saved to the tracker.
        </p>
      </div>

      {activeQuestions.length === 0 ? (
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          No practice questions found for this lesson.
        </div>
      ) : null}

      {activeQuestions.map((question, index) => (
        <section
          key={question.id}
          className="rounded-3xl border bg-white p-6 shadow-sm"
        >
          <div className="mb-3 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
            <span className="rounded-full bg-slate-100 px-3 py-1">
              Question {index + 1}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1">
              {question.skill}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1">
              {question.type}
            </span>
          </div>

          <p className="text-lg font-semibold">{question.prompt}</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {question.options.map((option) => (
              <button
                key={option}
                type="button"
                disabled={submitted}
                onClick={() =>
                  setAnswers((current) => ({
                    ...current,
                    [question.id]: option
                  }))
                }
                className={`rounded-2xl border p-4 text-left font-medium transition disabled:cursor-not-allowed ${
                  answers[question.id] === option
                    ? "border-slate-950 bg-slate-950 text-white"
                    : "bg-white hover:bg-slate-50"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {submitted ? (
            <div
              className={`mt-4 rounded-2xl p-4 text-sm ${
                answers[question.id] === question.answer
                  ? "bg-green-50 text-green-900"
                  : "bg-red-50 text-red-900"
              }`}
            >
              <p className="font-bold">Correct answer: {question.answer}</p>
              <p className="mt-1">{question.explanation}</p>
            </div>
          ) : null}
        </section>
      ))}

      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        {!submitted ? (
          <div>
            <p className="mb-4 text-sm font-semibold text-slate-600">
              Answered {answeredCount}/{activeQuestions.length}
            </p>

            <button
              type="button"
              onClick={submitPractice}
              className="rounded-full bg-slate-950 px-6 py-3 font-semibold text-white disabled:opacity-50"
              disabled={
                activeQuestions.length === 0 ||
                answeredCount < activeQuestions.length
              }
            >
              Submit practice
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-black">Performance Report</h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Score</p>
                <p className="text-2xl font-bold">
                  {correct}/{activeQuestions.length}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Estimated Band</p>
                <p className="text-2xl font-bold">{band}</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Weak Area</p>
                <p className="text-lg font-bold">{weakArea}</p>
              </div>
            </div>

            {saveMessage ? (
              <p className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-700">
                {saveMessage}
              </p>
            ) : null}

            <button
              type="button"
              onClick={resetPractice}
              className="mt-5 rounded-full border px-6 py-3 font-semibold"
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}