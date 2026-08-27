import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Shell, PageTitle } from "@/components/katha/Shell";
import { LangSwitcher } from "@/components/katha/LanguagePair";
import { SpeakButton } from "@/components/katha/SpeakButton";
import { StatusPill } from "@/components/katha/StatusPill";
import { useKatha } from "@/lib/katha-store";
import { CONCEPTS, STUDENTS, langName, type Status } from "@/lib/katha-data";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Teacher Analytics — KATHA" },
      {
        name: "description",
        content:
          "Concept-level learning gaps, how many children understood, and the concept KATHA recommends re-explaining next.",
      },
      { property: "og:title", content: "Teacher Analytics — KATHA" },
      {
        property: "og:description",
        content: "Simple, useful analytics: understood, needs practice, needs attention, and what to re-teach.",
      },
    ],
  }),
  component: Analytics,
});

function Analytics() {
  const { results, corrections, target, sync } = useKatha();

  const counts = STUDENTS.reduce(
    (a, s) => {
      a[s.status] += 1;
      return a;
    },
    { understood: 0, practice: 0, attention: 0 } as Record<Status, number>,
  );

  const conceptStatus: Record<string, Status> = {
    roots: results["roots"]?.status ?? "attention",
    stem: results["stem"]?.status ?? "practice",
    leaves: results["leaves"]?.status ?? "understood",
  };
  const weakest =
    CONCEPTS.find((c) => conceptStatus[c.id] === "attention") ??
    CONCEPTS.find((c) => conceptStatus[c.id] === "practice") ??
    CONCEPTS[0]!;

  return (
    <Shell>
      <PageTitle
        eyebrow="Grade 3 EVS — Parts of a Plant"
        title="Teacher analytics"
        subtitle="Only what helps you act: who understood, which concept is weak, and what to re-explain tomorrow."
        right={
          <Button asChild>
            <Link to="/classroom">
              Re-teach {weakest.label.en} <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        }
      />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-md border bg-secondary/40 p-3">
        <LangSwitcher />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <section className="grid gap-3 sm:grid-cols-3">
            {(["understood", "practice", "attention"] as Status[]).map((s) => (
              <div key={s} className="panel p-5">
                <p className="font-serif text-3xl font-bold">{counts[s]}</p>
                <StatusPill status={s} className="mt-2" />
                <p className="mt-2 text-xs text-muted-foreground">of {STUDENTS.length} students</p>
              </div>
            ))}
          </section>

          <section className="panel p-5">
            <p className="label-caps mb-3">Concept-level learning gaps</p>
            <ul className="space-y-4">
              {CONCEPTS.map((c) => {
                const st = conceptStatus[c.id]!;
                const pct = st === "understood" ? 88 : st === "practice" ? 61 : 34;
                return (
                  <li key={c.id}>
                    <div className="mb-1.5 flex items-center justify-between gap-2 text-sm">
                      <span className="font-medium">
                        {c.visual} {c.label.en}{" "}
                        <span className="font-normal text-muted-foreground">· {c.label[target]}</span>
                      </span>
                      <StatusPill status={st} />
                    </div>
                    <Progress value={pct} />
                    <p className="mt-1 text-xs text-muted-foreground">
                      {pct}% of children answered the concept question correctly
                    </p>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="panel p-5">
            <p className="label-caps mb-3">Children needing attention</p>
            <div className="overflow-hidden rounded-md border">
              <table className="w-full text-sm">
                <thead className="bg-muted text-left text-xs text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 font-medium">Student</th>
                    <th className="px-3 py-2 font-medium">Mother tongue</th>
                    <th className="px-3 py-2 font-medium">Weak concept</th>
                    <th className="px-3 py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {STUDENTS.filter((s) => s.status !== "understood").map((s) => (
                    <tr key={s.id} className="border-t">
                      <td className="px-3 py-2 font-medium">{s.name}</td>
                      <td className="px-3 py-2 text-muted-foreground">{langName(s.mother)}</td>
                      <td className="px-3 py-2">
                        {CONCEPTS.find((c) => c.id === s.weakConcept)?.label.en ?? "—"}
                      </td>
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
          <section className="panel p-5">
            <p className="label-caps mb-2">Recommended re-explanation</p>
            <h2 className="text-lg font-bold">
              {weakest.visual} {weakest.label.en}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Use a new example next time — KATHA suggests:
            </p>
            <p className="mt-2 rounded-md border bg-secondary/60 p-3 text-sm">
              {weakest.kathaAlt[target]}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <SpeakButton text={weakest.kathaAlt} lang={target} label="Play explanation" />
              <Button asChild size="sm">
                <Link to="/classroom">Open in live classroom</Link>
              </Button>
            </div>
          </section>

          <section className="panel p-5 text-sm">
            <p className="label-caps mb-2">Translation feedback</p>
            {corrections.length === 0 ? (
              <p className="text-muted-foreground">
                No corrections submitted yet. Use “Suggest correction” wherever translated text appears —
                native-speaker corrections improve future translations.
              </p>
            ) : (
              <ul className="space-y-2">
                {corrections.map((c) => (
                  <li key={c.id} className="rounded-md border p-3">
                    <p className="label-caps mb-1">{langName(c.lang)} · under review</p>
                    <p className="text-muted-foreground line-through">{c.original}</p>
                    <p className="mt-1">{c.suggestion}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="panel p-5 text-sm">
            <p className="label-caps mb-2">Offline &amp; sync</p>
            <ul className="space-y-2">
              {[
                ["Lesson content", "Cached"],
                ["Translations & voice packs", "Cached"],
                ["Assessment answers", sync === "synced" ? "Synced" : sync === "syncing" ? "Syncing…" : "Cached — waiting for network"],
              ].map(([k, v]) => (
                <li key={k} className="flex items-center justify-between gap-3 border-b pb-2 last:border-0">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <Download className="h-3.5 w-3.5" /> {v}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </Shell>
  );
}
