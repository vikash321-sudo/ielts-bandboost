"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Target, TrendingUp, AlertTriangle } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { lessons } from "@/data/lessons";
import type { ProgressRecord } from "@/lib/types";

export default function HomePage() {
  const [records, setRecords] = useState<ProgressRecord[]>([]);

  useEffect(() => {
    const saved = JSON.parse(
      localStorage.getItem("bandboost_progress") || "[]"
    ) as ProgressRecord[];

    setRecords(saved);
  }, []);

  const latestRecord = records[0];

  const recommendedLesson = useMemo(() => {
    if (!latestRecord) return lessons[0];

    return (
      lessons.find((lesson) => lesson.skill === latestRecord.skill) ||
      lessons[0]
    );
  }, [latestRecord]);

  const currentBand = latestRecord ? String(latestRecord.band) : "—";
  const weakArea = latestRecord ? latestRecord.skill : "Practice first";
  const weakAreaDetail = latestRecord
    ? latestRecord.weakArea
    : "Complete one practice set";

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] bg-slate-950 p-8 text-white shadow-sm sm:p-10">
        <div className="max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-slate-300">
            IELTS Learning MVP
          </p>

          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            Learn, practice, find weakness, and improve your estimated IELTS band.
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-300">
            A structured IELTS preparation app for students who do not want to
            randomly watch videos without tracking progress.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-semibold text-slate-950"
            >
              Start learning <ArrowRight size={18} />
            </Link>

            <Link
              href="/practice"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 font-semibold text-white"
            >
              Go to practice
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Current Band"
          value={currentBand}
          helper="Based on latest practice result"
        />

        <StatCard
          label="Target Band"
          value="7.0"
          helper="Profile setting coming later"
        />

        <StatCard
          label="Weak Area"
          value={weakArea}
          helper={weakAreaDetail}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-slate-100 p-3">
              <Target />
            </div>

            <div>
              <h2 className="text-2xl font-bold">Today&apos;s Study Task</h2>

              <p className="mt-2 text-slate-600">
                Watch one focused lesson, then complete the connected practice set.
              </p>

              <div className="mt-5 rounded-2xl bg-slate-50 p-5">
                <p className="text-sm font-semibold text-slate-500">
                  Recommended lesson
                </p>

                <p className="mt-1 text-xl font-bold">
                  {recommendedLesson.title}
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  {recommendedLesson.skill} • {recommendedLesson.level} •{" "}
                  {recommendedLesson.duration}
                </p>

                <Link
                  href={`/learn/${recommendedLesson.id}`}
                  className="mt-4 inline-flex rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
                >
                  Continue lesson
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Link
            href="/tracker"
            className="block rounded-3xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <TrendingUp className="mb-3" />
            <h3 className="font-bold">Band Tracker</h3>
            <p className="mt-2 text-sm text-slate-600">
              Track score changes after every practice attempt.
            </p>
          </Link>

          <Link
            href="/practice"
            className="block rounded-3xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <AlertTriangle className="mb-3" />
            <h3 className="font-bold">Weakness Analyzer</h3>
            <p className="mt-2 text-sm text-slate-600">
              Detect weak question types using answer history.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}