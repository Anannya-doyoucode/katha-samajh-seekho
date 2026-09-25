import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Shell, PageTitle } from "@/components/katha/Shell";
import { StatusPill } from "@/components/katha/StatusPill";
import { useSchool } from "@/lib/school-store";
import { TOPICS, statusOf } from "@/lib/school-data";
import { langName } from "@/lib/katha-data";

export const Route = createFileRoute("/progress/$roll")({
  head: () => ({
    meta: [
      { title: "Student Profile — KATHA" },
      { name: "description", content: "One child's assessment history, mother tongue, topics requiring support and recommended action." },
      { property: "og:title", content: "Student Profile — KATHA" },
      { property: "og:description", content: "Assessment history and recommended remedial action for a student." },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Profile,
});

function Profile() {
  const { roll } = Route.useParams();
  const { students } = useSchool();
  const s = students.find((x) => x.roll === Number(roll));
  if (!s) return <Shell><p>Student not found.</p></Shell>;
  const st = statusOf(s.score);
  const needs = st !== "understood" && s.weak.length > 0;
  return (
    <Shell>
      <Link to="/progress" className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> All students
      </Link>
      <PageTitle eyebrow="Student Profile" title={s.name} right={<StatusPill status={st} />} />
      <div className="grid gap-5 md:grid-cols-3">
        <section className="panel p-5">
          <dl className="space-y-3 text-sm">
            <div><dt className="label-caps">Name</dt><dd className="font-semibold">{s.name}</dd></div>
            <div><dt className="label-caps">Roll</dt><dd className="font-semibold">{s.roll}</dd></div>
            <div><dt className="label-caps">Mother Tongue</dt><dd className="font-semibold">{langName(s.mother)}</dd></div>
          </dl>
        </section>
        <section className="panel p-5">
          <p className="label-caps mb-3">Assessment history</p>
          <ul className="space-y-3">
            {s.history.map((h) => (
              <li key={h.lecture}>
                <div className="mb-1 flex justify-between text-sm"><span>{h.lecture}</span><span className="font-semibold">{h.score}%</span></div>
                <div className="h-1.5 rounded-full bg-muted">
                  <div className={`h-1.5 rounded-full ${statusOf(h.score) === "understood" ? "bg-status-good" : statusOf(h.score) === "practice" ? "bg-status-warn" : "bg-status-bad"}`} style={{ width: `${h.score}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </section>
        <section className="panel p-5">
          <p className="label-caps mb-2">Topics requiring support</p>
          {needs ? (
            <ul className="list-inside list-disc text-sm">{s.weak.map((w) => <li key={w}>{TOPICS[w]}</li>)}</ul>
          ) : (
            <p className="text-sm text-muted-foreground">None — doing well.</p>
          )}
          <p className="label-caps mb-2 mt-4">Recommended action</p>
          {needs ? (
            <>
              <p className="text-sm">Short remedial session in {langName(s.mother)} on {TOPICS[s.weak[0]!]}.</p>
              <Button asChild size="sm" className="mt-3">
                <Link to="/remedial" search={{ topic: s.weak[0], students: 1, lang: s.mother }}>Assign Remedial Session</Link>
              </Button>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Continue with the next lesson.</p>
          )}
        </section>
      </div>
    </Shell>
  );
}
