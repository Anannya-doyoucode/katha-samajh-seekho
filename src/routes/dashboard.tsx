import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Users, Clock, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Shell, PageTitle } from "@/components/katha/Shell";
import { LangSwitcher } from "@/components/katha/LanguagePair";
import { StatusPill } from "@/components/katha/StatusPill";
import { LanguagePair } from "@/components/katha/LanguagePair";
import { useKatha } from "@/lib/katha-store";
import { CONCEPTS, LESSONS, STUDENTS, langName, type ConceptId, type Status } from "@/lib/katha-data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Teacher Dashboard — KATHA" },
      {
        name: "description",
        content:
          "Class overview, today's lesson, student understanding summary and learning gaps for your primary-school class.",
      },
      { property: "og:title", content: "Teacher Dashboard — KATHA" },
      {
        property: "og:description",
        content: "Understanding summary, learning gaps and language setup for today's lesson.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { teacher, lessonId, target } = useKatha();
  const lesson = LESSONS.find((l) => l.id === lessonId) ?? LESSONS[0]!;

  const counts = STUDENTS.reduce(
    (acc, s) => {
      acc[s.status] += 1;
      return acc;
    },
    { understood: 0, practice: 0, attention: 0 } as Record<Status, number>,
  );

  const conceptStatus: Record<ConceptId, Status> = {
    roots: "attention",
    stem: "practice",
    leaves: "understood",
  };

  return (
    <Shell>
      <PageTitle
        eyebrow={`Class 3 · 12 students · ${langName(target)} medium support`}
        title={`Namaste, ${teacher ?? "Teacher"}`}
        subtitle="Here is today's class, how the children are doing, and where they need help."
        right={
          <Button asChild>
            <Link to="/classroom">
              Start Live Classroom <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        }
      />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-md border bg-secondary/40 p-3">
        <LangSwitcher />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <section className="panel p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="label-caps mb-1">Today's lesson</p>
                <h2 className="text-xl font-bold">{lesson.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {lesson.grade} · {lesson.subject} · {lesson.titleHi}
                </p>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                <p className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" /> {lesson.minutes} min
                </p>
                {lesson.offline && (
                  <p className="mt-1 flex items-center gap-1.5 text-status-good">
                    <Download className="h-4 w-4" /> Available offline
                  </p>
                )}
              </div>
            </div>
            <div className="mt-4">
              <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
                <span>Lesson progress</span>
                <span>{lesson.progress}%</span>
              </div>
              <Progress value={lesson.progress} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm">
                <Link to="/lessons">Change lesson</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link to="/check">Run understanding check</Link>
              </Button>
            </div>
          </section>

          <section className="panel p-5">
            <p className="label-caps mb-3">Student understanding summary</p>
            <div className="grid gap-3 sm:grid-cols-3">
              {(["understood", "practice", "attention"] as Status[]).map((s) => (
                <div key={s} className="rounded-md border p-4">
                  <p className="font-serif text-3xl font-bold">{counts[s]}</p>
                  <StatusPill status={s} className="mt-2" />
                </div>
              ))}
            </div>

            <div className="mt-5 overflow-hidden rounded-md border">
              <table className="w-full text-sm">
                <thead className="bg-muted text-left text-xs text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 font-medium">Roll</th>
                    <th className="px-3 py-2 font-medium">Student</th>
                    <th className="px-3 py-2 font-medium">Mother tongue</th>
                    <th className="px-3 py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {STUDENTS.map((s) => (
                    <tr key={s.id} className="border-t">
                      <td className="px-3 py-2 text-muted-foreground">{s.roll}</td>
                      <td className="px-3 py-2 font-medium">{s.name}</td>
                      <td className="px-3 py-2 text-muted-foreground">{langName(s.mother)}</td>
                      <td className="px-3 py-2">
                        <StatusPill status={s.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div className="space-y-5">
          <LanguagePair />

          <section className="panel p-5">
            <p className="label-caps mb-3">Learning gaps — Parts of a Plant</p>
            <ul className="space-y-2.5">
              {CONCEPTS.map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-sm">
                    <span aria-hidden className="text-lg">
                      {c.visual}
                    </span>
                    {c.label.en}
                  </span>
                  <StatusPill status={conceptStatus[c.id]} />
                </li>
              ))}
            </ul>
            <div className="mt-4 rounded-md bg-secondary/60 p-3 text-sm">
              <p className="font-medium">Recommended next step</p>
              <p className="mt-1 text-muted-foreground">
                Re-explain <strong>Roots</strong> with a different example — 3 children still find it
                difficult.
              </p>
              <Button asChild size="sm" className="mt-3">
                <Link to="/classroom">
                  Re-teach Roots
                </Link>
              </Button>
            </div>
          </section>

          <section className="panel p-5">
            <p className="label-caps mb-3 flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" /> Class overview
            </p>
            <dl className="space-y-2 text-sm">
              {[
                ["School", "GPS Bariatu, Ranchi"],
                ["Class", "3 (single section)"],
                ["Attendance today", "12 of 14"],
                ["Mother tongues in class", "Santhali, Ho, Mundari, Hindi"],
                ["Lessons cached offline", "3 of 4"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 border-b pb-2 last:border-0">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="text-right font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </div>
    </Shell>
  );
}
