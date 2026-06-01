"use client";

import { useEffect, useState } from "react";
import type { ProgressRecord } from "@/lib/types";

export function TrackerClient() {
  const [records, setRecords] = useState<ProgressRecord[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("bandboost_progress") || "[]") as ProgressRecord[];
    setRecords(saved);
  }, []);

  const latest = records[0];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-black">Band Tracker</h1>
        <p className="mt-2 text-slate-600">This first MVP stores progress in the browser. Supabase saving comes next.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Latest Band</p>
          <p className="mt-2 text-3xl font-black">{latest?.band ?? "—"}</p>
        </div>
        <div className="rounded-3xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Attempts</p>
          <p className="mt-2 text-3xl font-black">{records.length}</p>
        </div>
        <div className="rounded-3xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Current Weak Area</p>
          <p className="mt-2 text-xl font-black">{latest?.weakArea ?? "Practice first"}</p>
        </div>
      </div>

      <section className="rounded-3xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold">Practice History</h2>
        <div className="mt-4 overflow-hidden rounded-2xl border">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Skill</th>
                <th className="p-3">Score</th>
                <th className="p-3">Band</th>
                <th className="p-3">Weak Area</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record, index) => (
                <tr key={`${record.date}-${index}`} className="border-t">
                  <td className="p-3">{new Date(record.date).toLocaleDateString()}</td>
                  <td className="p-3">{record.skill}</td>
                  <td className="p-3">{record.score}/{record.total}</td>
                  <td className="p-3 font-bold">{record.band}</td>
                  <td className="p-3">{record.weakArea}</td>
                </tr>
              ))}
              {records.length === 0 ? (
                <tr>
                  <td className="p-5 text-slate-500" colSpan={5}>No records yet. Complete a practice set first.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
