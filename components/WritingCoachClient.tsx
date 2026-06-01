"use client";

import { FormEvent, useState } from "react";
import { Sparkles, Send, FileText } from "lucide-react";

const sampleQuestions = [
  {
    type: "Writing Task 2",
    question:
      "Some people believe that online learning is better than classroom learning. To what extent do you agree or disagree?"
  },
  {
    type: "Writing Task 2",
    question:
      "Many students choose to study abroad. What are the advantages and disadvantages of this trend?"
  },
  {
    type: "Writing Task 1",
    question:
      "The chart shows the number of students studying English in three different countries from 2010 to 2020. Summarize the main features and make comparisons where relevant."
  }
];

export function WritingCoachClient() {
  const [taskType, setTaskType] = useState("Writing Task 2");
  const [question, setQuestion] = useState(sampleQuestions[0].question);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const wordCount = answer
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setFeedback("");
    setErrorMessage("");

    if (!answer.trim()) {
      setErrorMessage("Write your answer first.");
      return;
    }

    if (wordCount < 50) {
      setErrorMessage("Your answer is too short. Write at least 50 words for useful feedback.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/ai-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          skill: taskType,
          question,
          answer
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || "AI feedback failed.");
        return;
      }

      setFeedback(data.feedback || "No feedback generated.");
    } catch {
      setErrorMessage("Something went wrong while requesting AI feedback.");
    } finally {
      setLoading(false);
    }
  }

  function useSample(index: number) {
    const sample = sampleQuestions[index];
    setTaskType(sample.type);
    setQuestion(sample.question);
    setFeedback("");
    setErrorMessage("");
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-slate-950 p-3 text-white">
            <Sparkles size={24} />
          </div>

          <div>
            <h1 className="text-3xl font-black">AI Writing Coach</h1>
            <p className="mt-2 max-w-2xl text-slate-600">
              Write an IELTS answer and get short feedback on weakness,
              structure, grammar, and improvement. This is practice feedback,
              not an official IELTS score.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-3xl border bg-white p-6 shadow-sm lg:col-span-2"
        >
          <div>
            <label className="text-sm font-bold">Task Type</label>
            <select
              value={taskType}
              onChange={(event) => setTaskType(event.target.value)}
              className="mt-2 w-full rounded-2xl border px-4 py-3 outline-none focus:border-slate-950"
            >
              <option>Writing Task 1</option>
              <option>Writing Task 2</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-bold">Question</label>
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              rows={4}
              className="mt-2 w-full rounded-2xl border px-4 py-3 outline-none focus:border-slate-950"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold">Your Answer</label>
              <span className="text-sm font-semibold text-slate-500">
                {wordCount} words
              </span>
            </div>

            <textarea
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              rows={12}
              placeholder="Write your IELTS answer here..."
              className="mt-2 w-full rounded-2xl border px-4 py-3 outline-none focus:border-slate-950"
            />
          </div>

          {errorMessage ? (
            <div className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">
              {errorMessage}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 font-bold text-white disabled:opacity-60"
          >
            <Send size={18} />
            {loading ? "Checking..." : "Get AI Feedback"}
          </button>
        </form>

        <aside className="space-y-4">
          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black">Sample Questions</h2>

            <div className="mt-4 space-y-3">
              {sampleQuestions.map((sample, index) => (
                <button
                  key={sample.question}
                  type="button"
                  onClick={() => useSample(index)}
                  className="w-full rounded-2xl bg-slate-50 p-4 text-left text-sm font-semibold hover:bg-slate-100"
                >
                  <span className="block text-xs uppercase tracking-wider text-slate-400">
                    {sample.type}
                  </span>
                  <span className="mt-1 block">{sample.question}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <FileText />
            <h2 className="mt-3 text-xl font-black">Minimum Target</h2>
            <p className="mt-2 text-sm text-slate-600">
              Task 1 usually needs at least 150 words. Task 2 usually needs at
              least 250 words. For testing the app, 50+ words is enough.
            </p>
          </div>
        </aside>
      </section>

      {feedback ? (
        <section className="rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black">AI Feedback</h2>

          <div className="mt-4 whitespace-pre-wrap rounded-2xl bg-slate-50 p-5 text-sm leading-7 text-slate-700">
            {feedback}
          </div>
        </section>
      ) : null}
    </div>
  );
}