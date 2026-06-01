import Link from "next/link";
import { lessons } from "@/data/lessons";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";

export default function LearnPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black">Learn IELTS</h1>
        <p className="mt-2 text-slate-600">Curated lessons appear in one place. Source does not matter to the student; improvement does.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {lessons.map((lesson) => (
          <article key={lesson.id} className="rounded-3xl border bg-white p-5 shadow-sm">
            <YouTubeEmbed videoId={lesson.videoId} title={lesson.title} />
            <div className="mt-5">
              <div className="mb-3 flex flex-wrap gap-2 text-xs font-semibold">
                <span className="rounded-full bg-slate-100 px-3 py-1">{lesson.skill}</span>
                <span className="rounded-full bg-slate-100 px-3 py-1">{lesson.level}</span>
                <span className="rounded-full bg-slate-100 px-3 py-1">{lesson.duration}</span>
              </div>
              <h2 className="text-xl font-bold">{lesson.title}</h2>
              <p className="mt-1 text-sm text-slate-500">{lesson.teacher}</p>
              <ul className="mt-4 list-inside list-disc space-y-1 text-sm text-slate-600">
                {lesson.notes.map((note) => <li key={note}>{note}</li>)}
              </ul>
              <Link
                href={`/practice?set=${lesson.practiceSetId}`}
                className="mt-5 inline-flex rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
              >
                Practice this lesson
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
