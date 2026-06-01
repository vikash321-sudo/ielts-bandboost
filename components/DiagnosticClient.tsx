"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Target } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { diagnosticQuestions } from "@/data/diagnostic";

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

function findWeakArea(answers: Record<number, string>) {
  const wrongQuestions = diagnosticQuestions.filter(
    (question) =>
      answers[question.id] && answers[question.id] !== question.answer
  );

  if (wrongQuestions.length === 0) {
    return "No major weakness detected";
  }

  const counts = wrongQuestions.reduce<Record<string, number>>((acc, question) => {
    const key = `${question.skill} - ${question.type}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

export function DiagnosticClient() {
  const router = useRouter();

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const answeredCount = diagnosticQuestions.filter(
    (question) => answers[question.id]
  ).length;

  const correct = diagnosticQuestions.filter(
    (question) => answers[question.id] === question.answer
  ).length;

  const band = estimateBand(correct, diagnosticQuestions.length);

  const weakArea = useMemo(() => findWeakArea(answers), [answers]);

  async function submitDiagnostic() {
    setErrorMessage("");

    if (answeredCount < diagnosticQuestions.length) {
      setErrorMessage("Complete all diagnostic questions first.");
      return;
    }

    if (!supabase) {
      setErrorMessage("Supabase is not configured.");
      return;
    }

    setSubmitted(true);
    setSaving(true);

    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setSaving(false);
      setErrorMessage("Please login before taking the diagnostic test.");
      return;
    }

    const { error: insertError } = await supabase
      .from("diagnostic_attempts")
      .insert({
        user_id: user.id,
        score: correct,
        total: diagnosticQuestions.length,
        estimated_band: band,
        weakest_area: weakArea
      });

    if (insertError) {
      setSaving(false);
      setErrorMessage(insertError.message);
      return;
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        current_band: band,
        weakest_area: weakArea,
        diagnostic_completed: true,
        updated_at: new Date().toISOString()
      })
      .eq("id", user.id);

    if (profileError) {
      setSaving(false);
      setErrorMessage(profileError.message);
      return;
    }

    setSaving(false);
  }

  function continueToApp() {
    router.push("/");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-slate-950 p-3 text-white">
            <Target size={24} />
          </div>

          <div>
            <h1 className="text-3xl font-black">Initial IELTS Diagnostic Test</h1>

            <p className="mt-2 max-w-2xl text-slate-600">
              Complete this short test first. It estimates your starting level
              and finds your weakest area. This is not an official IELTS score.
            </p>
          </div>
        </div>
      </section>

      {!submitted ? (
        <>
          {diagnosticQuestions.map((question, index) => (
            <section
              key={question.id}
              className="rounded-3xl border bg-white p-5 shadow-sm sm:p-6"
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

              <p className="text-base font-semibold leading-7 sm:text-lg">
                {question.prompt}
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {question.options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() =>
                      setAnswers((current) => ({
                        ...current,
                        [question.id]: option
                      }))
                    }
                    className={`rounded-2xl border p-4 text-left text-sm font-semibold transition sm:text-base ${
                      answers[question.id] === option
                        ? "border-slate-950 bg-slate-950 text-white"
                        : "bg-white hover:bg-slate-50"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </section>
          ))}

          {errorMessage ? (
            <div className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">
              {errorMessage}
            </div>
          ) : null}

          <section className="sticky bottom-20 rounded-3xl border bg-white p-5 shadow-lg sm:static sm:shadow-sm">
            <p className="mb-4 text-sm font-semibold text-slate-600">
              Answered {answeredCount}/{diagnosticQuestions.length}
            </p>

            <button
              type="button"
              onClick={submitDiagnostic}
              disabled={answeredCount < diagnosticQuestions.length || saving}
              className="w-full rounded-full bg-slate-950 px-6 py-3 font-bold text-white disabled:opacity-50 sm:w-auto"
            >
              {saving ? "Saving..." : "Submit Diagnostic Test"}
            </button>
          </section>
        </>
      ) : (
        <section className="rounded-3xl border bg-white p-6 shadow-sm">
          <CheckCircle2 size={38} />

          <h2 className="mt-4 text-3xl font-black">Your Starting Report</h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Score</p>
              <p className="mt-2 text-3xl font-black">
                {correct}/{diagnosticQuestions.length}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Estimated Band</p>
              <p className="mt-2 text-3xl font-black">{band}</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">Weakest Area</p>
              <p className="mt-2 text-xl font-black">{weakArea}</p>
            </div>
          </div>

          <p className="mt-5 text-sm leading-6 text-slate-600">
            Now your learning path can begin from your actual level instead of
            random lessons.
          </p>

          {errorMessage ? (
            <div className="mt-4 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">
              {errorMessage}
            </div>
          ) : null}

          <button
            type="button"
            onClick={continueToApp}
            disabled={saving}
            className="mt-6 rounded-full bg-slate-950 px-6 py-3 font-bold text-white disabled:opacity-50"
          >
            Continue to Dashboard
          </button>
        </section>
      )}
    </div>
  );
}