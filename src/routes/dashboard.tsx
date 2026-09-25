import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Mic, ClipboardCheck, Users, AlertTriangle, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Shell, PageTitle } from "@/components/katha/Shell";
import { useKatha } from "@/lib/katha-store";
import { useSchool } from "@/lib/school-store";
import { CLASS_INFO, TOPICS, statusOf, type TopicId } from "@/lib/school-data";
import { langName } from "@/lib/katha-data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Teacher Dashboard — KATHA" },
      { name: "description", content: "Class 3 Section A at a glance: today's lesson, class understanding, topics needing attention and quick actions." },
      { property: "og:title", content: "Teacher Dashboard — KATHA" },
      { property: "og:description", content: "Class understanding, weak topics and remedial actions for a 68-student classroom." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Dashboard,
});

const ACTIONS = [
  { to: "/lessons", label: "Lessons & Lectures", desc: "Multilingual video lectures", icon: BookOpen },
  { to: "/classroom", label: "Live Classroom", desc: "Teach with live translation", icon: Mic },
  { to: "/assessments", label: "Weekly Assessment", desc: "Conduct & record for the class", icon: ClipboardCheck },
  { to: "/progress", label: "Student Progress", desc: "Scores & topics per child", icon: Users },
] as const;

function Dashboard() {
  const { teacher } = useKatha();
  const { students, latest, remedial } = useSchool();
  const n = students.length;
  const c = { understood: 0, practice: 0, attention: 0 };
  students.forEach((s) => (c[statusOf(s.score)] += 1));
  const pct = (x: number) => Math.round((x / n) * 100);

  const weakCount: Record<TopicId, number> = { parts: 0, roots: 0, uses: 0, photo: 0 };
  students.forEach((s) => s.score < 75 && s.weak.forEach((w) => (weakCount[w] += 1)));
  // seed data: roots flagged for 18 children after last week's practice
  const rootsNeed = latest ? weakCount.roots : 18;
  const next = remedial[remedial.length - 1];

  return (
    <Shell>
      <PageTitle
        eyebrow="Teacher Dashboard"
        title={`Namaste, ${teacher ?? "Teacher"}`}
        subtitle={`${CLASS_INFO.name} · ${n} students · Today's lesson: ${CLASS_INFO.todayLesson}`}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {ACTIONS.map((a, i) => (
          <Link key={a.to} to={a.to} className="panel group flex items-start gap-3 p-4 hover:border-primary">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
              <a.icon className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold">{i + 1}. {a.label}</span>
              <span className="block text-xs text-muted-foreground">{a.desc}</span>
            </span>
            <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground group-hover:text-primary" />
          </Link>
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <section className="panel p-5 lg:col-span-2">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
            <p className="label-caps">Class understanding</p>
            <p className="text-xs text-muted-foreground">
              {latest ? `From ${latest.title} · ${latest.date}` : "From last weekly assessment"}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["Understood", c.understood, "bg-status-good", "text-status-good"],
              ["Needs Practice", c.practice, "bg-status-warn", "text-status-warn"],
              ["Needs Attention", c.attention, "bg-status-bad", "text-status-bad"],
            ].map(([label, v, bar, txt]) => (
              <div key={label as string} className="rounded-md border p-4">
                <p className={`font-serif text-3xl font-bold ${txt}`}>{pct(v as number)}%</p>
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground">{v} students</p>
                <div className="mt-2 h-1.5 rounded-full bg-muted">
                  <div className={`h-1.5 rounded-full ${bar}`} style={{ width: `${pct(v as number)}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild size="sm" variant="outline"><Link to="/progress">View all 68 students</Link></Button>
            <Button asChild size="sm" variant="outline"><Link to="/lectures/$id" params={{ id: "plants" }}>Play today's lecture</Link></Button>
          </div>
        </section>

        <div className="space-y-5">
          <section className="panel p-5">
            <p className="label-caps mb-3 flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5" /> Topics needing attention
            </p>
            <div className="rounded-md border border-status-warn/40 bg-status-warn-soft p-3">
              <p className="font-semibold">{TOPICS.roots}</p>
              <p className="text-sm text-muted-foreground">{rootsNeed} students need additional practice</p>
            </div>
            {latest && weakCount.photo > 0 && (
              <div className="mt-2 rounded-md border p-3">
                <p className="font-semibold">{TOPICS.photo}</p>
                <p className="text-sm text-muted-foreground">{weakCount.photo} students need additional practice</p>
              </div>
            )}
            <Button asChild className="mt-3 w-full">
              <Link to="/remedial" search={{ topic: "roots", students: rootsNeed }}>Start Remedial Session</Link>
            </Button>
          </section>

          {next && (
            <section className="panel p-5">
              <p className="label-caps mb-2 flex items-center gap-1.5">
                <CalendarClock className="h-3.5 w-3.5" /> Next remedial session
              </p>
              <p className="font-semibold">{next.topic}</p>
              <p className="text-sm text-muted-foreground">
                {next.students} students · {langName(next.lang)} · {next.when}
              </p>
            </section>
          )}
        </div>
      </div>
    </Shell>
  );
}
