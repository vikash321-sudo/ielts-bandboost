"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { ProgressRecord } from "@/lib/types";

type SupabaseAttempt = {
  skill: ProgressRecord["skill"];
  score: number;
  total: number;
  estimated_band: number;
  weak_area: string | null;
  created_at: string;
};

export function TrackerClient() {
  const [records, setRecords] = useState<ProgressRecord[]>([]);
  const [source, setSource] = useState<"browser" | "cloud">("browser");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecords() {
      const localRecords = JSON.parse(
        localStorage.getItem("bandboost_progress") || "[]"
      ) as ProgressRecord[];

      setRecords(localRecords);

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
        .from("practice_attempts")
        .select("skill, score, total, estimated_band, weak_area, created_at")
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) {
        console.error("Failed to load cloud progress:", error.message);
        setSource("browser");
        setLoading(false);
        return;
      }

      const cloudRecords = (data as SupabaseAttempt[]).map((item) => ({
        date: item.created_at,
        skill: item.skill,
        score: item.score,
        total: item.total,
        band: Number(item.estimated_band),
        weakArea: item.weak_area || "No major weak area detected"
      }));

      setRecords(cloudRecords);
      setSource("cloud");
      setLoading(false);
    }

    loadRecords();
  }, []);

  const latest = records[0];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-black">Band Tracker</h1>

        <p className="mt-2 text-slate-600">
          {loading
            ? "Loading progress..."
            : source === "cloud"
              ? "Progress is loaded from your Supabase account."
              : "Progress is stored in this browser. Login to save online."}
        </p>
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
          <p className="mt-2 text-xl font-black">
            {latest?.weakArea ?? "Practice first"}
          </p>
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
                  <td className="p-3">
                    {new Date(record.date).toLocaleDateString()}
                  </td>

                  <td className="p-3">{record.skill}</td>

                  <td className="p-3">
                    {record.score}/{record.total}
                  </td>

                  <td className="p-3 font-bold">{record.band}</td>

                  <td className="p-3">{record.weakArea}</td>
                </tr>
              ))}

              {records.length === 0 ? (
                <tr>
                  <td className="p-5 text-slate-500" colSpan={5}>
                    No records yet. Complete a practice set first.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}