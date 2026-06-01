import Link from "next/link";
import { ArrowRight, Clock, GraduationCap } from "lucide-react";
import { lessons } from "@/data/lessons";

export default function LearnPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-black">Learn IELTS</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Watch one focused lesson, understand the strategy, then complete the connected practice set.
        </p>
      </section>

      <div className="grid gap-5 md:grid-cols-2">
        {lessons.map((lesson) => (
          <article
            key={lesson.id}
            className="rounded-3xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="mb-4 flex flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded-full bg-slate-100 px-3 py-1">{lesson.skill}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1">{lesson.level}</span>
            </div>

            <h2 className="text-xl font-black">{lesson.title}</h2>
            <p className="mt-2 text-sm text-slate-500">{lesson.teacher}</p>

            <div className="mt-5 flex items-center gap-4 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2">
                <Clock size={16} />
                {lesson.duration}
              </span>
              <span className="inline-flex items-center gap-2">
                <GraduationCap size={16} />
                Practice included
              </span>
            </div>

            <Link
              href={`/learn/${lesson.id}`}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white"
            >
              Open lesson
              <ArrowRight size={16} />
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}