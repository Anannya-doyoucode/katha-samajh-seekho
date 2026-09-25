import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarClock, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shell, PageTitle } from "@/components/katha/Shell";
import { LanguageSelect } from "@/components/katha/LanguagePair";
import { useSchool } from "@/lib/school-store";
import { TOPICS, type TopicId } from "@/lib/school-data";
import { langName, type LangCode } from "@/lib/katha-data";

type Search = { topic?: TopicId; students?: number; lang?: LangCode };

export const Route = createFileRoute("/remedial")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    topic: typeof s.topic === "string" && s.topic in TOPICS ? (s.topic as TopicId) : undefined,
    students: typeof s.students === "number" ? s.students : undefined,
    lang: typeof s.lang === "string" ? (s.lang as LangCode) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Remedial Sessions — KATHA" },
      { name: "description", content: "Schedule short remedial sessions in the children's mother tongue for topics the class found difficult." },
      { property: "og:title", content: "Remedial Sessions — KATHA" },
      { property: "og:description", content: "Close the learning loop: remedial sessions by topic, group and language." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RemedialPage,
});

function RemedialPage() {
  const search = Route.useSearch();
  const { remedial, addRemedial } = useSchool();
  const [open, setOpen] = useState(!!search.topic);
  const [topic, setTopic] = useState<TopicId>(search.topic ?? "roots");
  const [students, setStudents] = useState(search.students ?? 18);
  const [lang, setLang] = useState<LangCode>(search.lang ?? "sat");
  const [date, setDate] = useState(() => new Date(Date.now() + 864e5).toISOString().slice(0, 10));
  const [time, setTime] = useState("10:30");
  const [minutes, setMinutes] = useState(20);

  const schedule = () => {
    const d = new Date(`${date}T${time}`);
    const tomorrow = new Date(Date.now() + 864e5).toISOString().slice(0, 10);
    const t = d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }).toUpperCase();
    const when = date === tomorrow ? `Tomorrow — ${t}` : `${d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })} — ${t}`;
    addRemedial({ id: `${Date.now()}`, topic: TOPICS[topic], students, lang, when, minutes });
    toast.success("Remedial session scheduled");
    setOpen(false);
  };

  return (
    <Shell>
      <PageTitle
        eyebrow="Remedial Sessions"
        title="Close the learning gap"
        subtitle="Re-teach difficult topics to small groups in the language they understand best."
        right={!open && <Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Schedule Remedial Session</Button>}
      />

      {open && (
        <section className="panel mb-6 grid max-w-2xl gap-4 p-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Topic</Label>
            <Select value={topic} onValueChange={(v) => setTopic(v as TopicId)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{(Object.keys(TOPICS) as TopicId[]).map((t) => <SelectItem key={t} value={t}>{TOPICS[t]}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5"><Label htmlFor="n">Students</Label><Input id="n" type="number" min={1} value={students} onChange={(e) => setStudents(+e.target.value)} /></div>
          <div className="space-y-1.5"><Label>Language</Label><LanguageSelect value={lang} onChange={setLang} /></div>
          <div className="space-y-1.5"><Label htmlFor="m">Duration (minutes)</Label><Input id="m" type="number" min={5} step={5} value={minutes} onChange={(e) => setMinutes(+e.target.value)} /></div>
          <div className="space-y-1.5"><Label htmlFor="d">Date</Label><Input id="d" type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
          <div className="space-y-1.5"><Label htmlFor="tm">Time</Label><Input id="tm" type="time" value={time} onChange={(e) => setTime(e.target.value)} /></div>
          <div className="flex gap-2 sm:col-span-2">
            <Button onClick={schedule}>Schedule Remedial Session</Button>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          </div>
        </section>
      )}

      <p className="label-caps mb-3">Upcoming Remedial Sessions</p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {remedial.map((r) => (
          <article key={r.id} className="panel p-4">
            <p className="font-semibold">{r.topic}</p>
            <p className="text-sm text-muted-foreground">{r.students} {r.students === 1 ? "student" : "students"} · {langName(r.lang)} · {r.minutes} min</p>
            <p className="mt-2 flex items-center gap-1.5 text-sm"><CalendarClock className="h-4 w-4 text-muted-foreground" /> {r.when}</p>
          </article>
        ))}
      </div>
    </Shell>
  );
}
