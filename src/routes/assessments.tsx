import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Projector, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Shell, PageTitle } from "@/components/katha/Shell";
import { LangSwitcher } from "@/components/katha/LanguagePair";
import { useKatha } from "@/lib/katha-store";
import { useSchool, type AssessmentSummary } from "@/lib/school-store";
import { CLASS_INFO, TOPICS, WEEKLY_QUESTIONS, statusOf, type TopicId } from "@/lib/school-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/assessments")({
  head: () => ({
    meta: [
      { title: "Weekly Assessment — KATHA" },
      { name: "description", content: "Conduct a teacher-led weekly assessment on the projector and record the whole class's results by roll number." },
      { property: "og:title", content: "Weekly Assessment — KATHA" },
      { property: "og:description", content: "Batch assessment for one shared device: project questions, record results, get automatic class analysis." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AssessmentPage,
});

type Stage = "setup" | "question" | "marks" | "summary";

function parseRolls(s: string, max: number) {
  const out = new Set<number>();
  s.split(/[,\s]+/).forEach((p) => {
    const m = p.match(/^(\d+)(?:-(\d+))?$/);
    if (!m) return;
    const a = +m[1]!, b = m[2] ? +m[2] : a;
    for (let i = Math.min(a, b); i <= Math.max(a, b); i++) if (i >= 1 && i <= max) out.add(i);
  });
  return out;
}
const fmtRolls = (set: Set<number>) => [...set].sort((a, b) => a - b).join(", ");

const DIFFICULTY: Record<TopicId, number> = { parts: 91, roots: 63, uses: 84, photo: 48 };

function AssessmentPage() {
  const { target } = useKatha();
  const { students, submitAssessment } = useSchool();
  const N = students.length;
  const [stage, setStage] = useState<Stage>("setup");
  const [title, setTitle] = useState(`Weekly Assessment — ${CLASS_INFO.todayLesson}`);
  const [qi, setQi] = useState(0);
  const [correctTxt, setCorrectTxt] = useState("");
  const [wrongTxt, setWrongTxt] = useState("");
  const [perQ, setPerQ] = useState<Record<string, Set<number>>>({});
  const [marks, setMarks] = useState<Record<number, number>>({});
  const [summary, setSummary] = useState<AssessmentSummary | null>(null);
  const q = WEEKLY_QUESTIONS[qi]!;

  const correct = useMemo(() => parseRolls(correctTxt, N), [correctTxt, N]);
  const wrong = useMemo(() => parseRolls(wrongTxt, N), [wrongTxt, N]);

  const fillSample = () => {
    const c = new Set<number>(), w = new Set<number>();
    students.forEach((s) => {
      const threshold = DIFFICULTY[q.topic] + (s.score - 78) * 0.9;
      ((s.roll * 31 + qi * 17) % 100 < threshold ? c : w).add(s.roll);
    });
    setCorrectTxt(fmtRolls(c));
    setWrongTxt(fmtRolls(w));
  };

  const saveQuestion = () => {
    const next = { ...perQ, [q.id]: correct };
    setPerQ(next);
    toast.success(`Question ${qi + 1} saved — ${correct.size} correct, ${N - correct.size} not correct`);
    setCorrectTxt(""); setWrongTxt("");
    if (qi < WEEKLY_QUESTIONS.length - 1) setQi(qi + 1);
    else {
      const m: Record<number, number> = {};
      students.forEach((s) => (m[s.roll] = WEEKLY_QUESTIONS.filter((x) => next[x.id]?.has(s.roll)).length));
      setMarks(m);
      setStage("marks");
    }
  };

  return (
    <Shell>
      <PageTitle
        eyebrow="Assessments"
        title="Weekly Assessment"
        subtitle="One device, whole class. Show each question on the projector, children answer aloud or in notebooks, and you record the results by roll number."
        right={<LangSwitcher compact />}
      />

      {stage === "setup" && (
        <section className="panel max-w-xl space-y-4 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5"><Label>Select class</Label><Input value={CLASS_INFO.name} readOnly /></div>
            <div className="space-y-1.5"><Label>Select lesson</Label><Input value={CLASS_INFO.todayLesson} readOnly /></div>
            <div className="space-y-1.5 sm:col-span-2"><Label htmlFor="t">Assessment title</Label><Input id="t" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
            <div className="space-y-1.5"><Label>Number of students</Label><Input value={N} readOnly /></div>
            <div className="space-y-1.5"><Label>Questions</Label><Input value={`${WEEKLY_QUESTIONS.length} (1 mark each)`} readOnly /></div>
          </div>
          <Button onClick={() => setStage("question")}><Projector className="h-4 w-4" /> Start assessment</Button>
        </section>
      )}

      {stage === "question" && (
        <div className="grid gap-5 lg:grid-cols-5">
          <section className="panel p-6 lg:col-span-3">
            <div className="mb-3 flex items-center justify-between">
              <p className="label-caps">Question {qi + 1} of {WEEKLY_QUESTIONS.length} · show on projector</p>
              <span className="text-xs text-muted-foreground">{TOPICS[q.topic]}</span>
            </div>
            <p className="font-serif text-2xl font-bold leading-snug md:text-3xl">{q.q[target]}</p>
            {target !== "en" && <p className="mt-1 text-sm text-muted-foreground">{q.q.en}</p>}
            <ol className="mt-5 grid gap-2 sm:grid-cols-2">
              {q.options.map((o, i) => (
                <li key={o} className="rounded-md border px-4 py-3 text-lg">
                  <span className="mr-2 font-bold">{String.fromCharCode(65 + i)}.</span>{o}
                </li>
              ))}
            </ol>
            <details className="mt-4 text-sm text-muted-foreground">
              <summary className="cursor-pointer">Teacher: show answer</summary>
              <p className="mt-1 font-medium text-foreground">{String.fromCharCode(65 + q.answer)}. {q.options[q.answer]}</p>
            </details>
          </section>

          <section className="panel space-y-4 p-5 lg:col-span-2">
            <p className="label-caps">Record results · Question {qi + 1}</p>
            <div className="space-y-1.5">
              <Label htmlFor="c">Correct roll numbers</Label>
              <Textarea id="c" rows={3} placeholder="1, 2, 4, 5, 8, 10-20" value={correctTxt} onChange={(e) => setCorrectTxt(e.target.value)} />
              <p className="text-xs text-status-good">{correct.size} students</p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="w">Incorrect roll numbers</Label>
              <Textarea id="w" rows={3} placeholder="3, 6, 7, 11" value={wrongTxt} onChange={(e) => setWrongTxt(e.target.value)} />
              <p className="text-xs text-status-bad">{wrong.size} students · {Math.max(0, N - correct.size - wrong.size)} not entered (counted as not correct)</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => {
                const rest = new Set<number>();
                for (let i = 1; i <= N; i++) if (!wrong.has(i)) rest.add(i);
                setCorrectTxt(fmtRolls(rest));
              }}>All others correct</Button>
              <Button size="sm" variant="ghost" onClick={fillSample}><Wand2 className="h-3.5 w-3.5" /> Fill demo results</Button>
            </div>
            <div className="flex gap-2 border-t pt-4">
              {qi > 0 && <Button variant="outline" onClick={() => setQi(qi - 1)}>Back</Button>}
              <Button onClick={saveQuestion} disabled={correct.size + wrong.size === 0}>Save Question Results</Button>
            </div>
          </section>
        </div>
      )}

      {stage === "marks" && (
        <section className="panel p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="label-caps">Review marks before submitting</p>
              <p className="text-sm text-muted-foreground">Edit any child's marks — e.g. if they answered on paper later.</p>
            </div>
            <Button onClick={() => { setSummary(submitAssessment(title, marks, perQ)); setStage("summary"); }}>Submit assessment</Button>
          </div>
          <div className="max-h-[32rem] overflow-y-auto rounded-md border">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-muted text-left text-xs text-muted-foreground">
                <tr><th className="px-3 py-2">Roll No</th><th className="px-3 py-2">Student</th><th className="px-3 py-2">Marks</th></tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.roll} className="border-t">
                    <td className="px-3 py-1.5 text-muted-foreground">{s.roll}</td>
                    <td className="px-3 py-1.5 font-medium">{s.name}</td>
                    <td className="px-3 py-1.5">
                      <span className="flex items-center gap-1">
                        <Input type="number" min={0} max={5} className="h-8 w-16" value={marks[s.roll] ?? 0}
                          onChange={(e) => setMarks({ ...marks, [s.roll]: Math.max(0, Math.min(5, +e.target.value)) })} />
                        <span className="text-muted-foreground">/ {WEEKLY_QUESTIONS.length}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {stage === "summary" && summary && <Summary s={summary} />}
    </Shell>
  );
}

function Summary({ s }: { s: AssessmentSummary }) {
  const { students } = useSchool();
  const c = { understood: 0, practice: 0, attention: 0 };
  students.forEach((x) => (c[statusOf(x.score)] += 1));
  const topics = (Object.keys(TOPICS) as TopicId[]).sort((a, b) => s.topicPct[b] - s.topicPct[a]);
  const weakest = topics[topics.length - 1]!;
  const weakStudents = students.filter((x) => x.weak.includes(weakest)).length;
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <section className="panel p-5">
        <p className="label-caps mb-3">Class understanding · {s.title}</p>
        <p className="font-serif text-5xl font-bold">{s.overall}%</p>
        <p className="text-sm text-muted-foreground">Overall</p>
        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-md bg-status-good-soft p-3"><p className="text-2xl font-bold text-status-good">{c.understood}</p><p className="text-xs">Understood</p></div>
          <div className="rounded-md bg-status-warn-soft p-3"><p className="text-2xl font-bold text-status-warn">{c.practice}</p><p className="text-xs">Needs Practice</p></div>
          <div className="rounded-md bg-status-bad-soft p-3"><p className="text-2xl font-bold text-status-bad">{c.attention}</p><p className="text-xs">Needs Attention</p></div>
        </div>
      </section>
      <section className="panel p-5">
        <p className="label-caps mb-3">Concept-level analysis</p>
        <ul className="space-y-3">
          {topics.map((t) => {
            const v = s.topicPct[t];
            const st = statusOf(v);
            const tone = st === "understood" ? "bg-status-good" : st === "practice" ? "bg-status-warn" : "bg-status-bad";
            return (
              <li key={t}>
                <div className="mb-1 flex justify-between text-sm"><span>{TOPICS[t]}</span><span className="font-semibold">{v}%</span></div>
                <div className="h-2 rounded-full bg-muted"><div className={cn("h-2 rounded-full", tone)} style={{ width: `${v}%` }} /></div>
              </li>
            );
          })}
        </ul>
        <div className="mt-4 rounded-md bg-secondary/60 p-3 text-sm">
          <p className="font-medium">Weakest concept: {TOPICS[weakest]}</p>
          <p className="text-muted-foreground">{weakStudents} students need support.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button asChild size="sm"><Link to="/remedial" search={{ topic: weakest, students: weakStudents }}>Schedule remedial session</Link></Button>
            <Button asChild size="sm" variant="outline"><Link to="/progress">See student progress</Link></Button>
          </div>
        </div>
      </section>
    </div>
  );
}
