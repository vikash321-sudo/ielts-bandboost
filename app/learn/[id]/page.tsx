import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, CheckCircle2, PlayCircle } from "lucide-react";
import { lessons } from "@/data/lessons";
import { questions } from "@/data/questions";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function LessonDetailPage({ params }: Props) {
  const { id } = await params;
  const lesson = lessons.find((item) => String(item.id) === id);

  if (!lesson) {
    notFound();
  }

  const relatedQuestions = questions.filter(
    (question) => question.practiceSetId === lesson.practiceSetId
  );

  return (
    <div className="space-y-6">
      <Link
        href="/learn"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950"
      >
        <ArrowLeft size={16} />
        Back to lessons
      </Link>

      <section className="rounded-3xl border bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap gap-2 text-xs font-semibold">
          <span className="rounded-full bg-slate-100 px-3 py-1">{lesson.skill}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1">{lesson.level}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1">{lesson.duration}</span>
        </div>

        <h1 className="text-3xl font-black">{lesson.title}</h1>
        <p className="mt-2 text-slate-600">{lesson.teacher}</p>
      </section>

      <YouTubeEmbed videoId={lesson.videoId} title={lesson.title} />

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-2xl bg-slate-100 p-3">
              <BookOpen size={22} />
            </div>
            <div>
              <h2 className="text-2xl font-black">Key Lesson Notes</h2>
              <p className="text-sm text-slate-500">
                Learn the strategy first. Then practice immediately.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {lesson.notes.map((note) => (
              <div key={note} className="flex gap-3 rounded-2xl bg-slate-50 p-4">
                <CheckCircle2 className="mt-0.5 shrink-0" size={18} />
                <p className="text-sm font-medium text-slate-700">{note}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="rounded-2xl bg-slate-950 p-4 text-white">
            <PlayCircle size={28} />
            <h2 className="mt-4 text-xl font-black">Practice Connected Questions</h2>
            <p className="mt-2 text-sm text-slate-300">
              This lesson has {relatedQuestions.length} practice question
              {relatedQuestions.length === 1 ? "" : "s"}.
            </p>

            <Link
              href={`/practice?set=${lesson.practiceSetId}`}
              className="mt-5 inline-flex rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-950"
            >
              Start Practice
            </Link>
          </div>

          <div className="mt-5">
            <h3 className="font-bold">Question types</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {[...new Set(relatedQuestions.map((q) => q.type))].map((type) => (
                <span
                  key={type}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}