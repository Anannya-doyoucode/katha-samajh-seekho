import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Shell, PageTitle } from "@/components/katha/Shell";
import { StatusPill } from "@/components/katha/StatusPill";
import { useSchool } from "@/lib/school-store";
import { CLASS_INFO, TOPICS, statusOf } from "@/lib/school-data";
import { langName, type Status } from "@/lib/katha-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "Student Progress — KATHA" },
      { name: "description", content: "Latest scores, status, mother tongue and topics needing attention for every child in the class." },
      { property: "og:title", content: "Student Progress — KATHA" },
      { property: "og:description", content: "A teacher progress table for 68 students, with mother tongue always visible." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProgressLayout,
});

function ProgressLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  if (path !== "/progress") return <Outlet />;
  return <ProgressTable />;
}

function ProgressTable() {
  const { students, latest } = useSchool();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Status | "all">("all");
  const rows = students.filter(
    (s) => (filter === "all" || statusOf(s.score) === filter) && s.name.toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <Shell>
      <PageTitle
        eyebrow={CLASS_INFO.name}
        title="Student Progress"
        subtitle={latest ? `Latest: ${latest.title} (${latest.date})` : "Latest: Weekly Assessment — Plants Around Us"}
      />
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Input placeholder="Search student" className="max-w-xs" value={q} onChange={(e) => setQ(e.target.value)} />
        {(["all", "understood", "practice", "attention"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={cn("rounded-full border px-3 py-1 text-xs", filter === f ? "bg-secondary font-semibold" : "text-muted-foreground")}>
            {f === "all" ? `All (${students.length})` : f === "understood" ? "Understood" : f === "practice" ? "Needs Practice" : "Needs Attention"}
          </button>
        ))}
      </div>
      <div className="panel overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left text-xs text-muted-foreground">
            <tr>
              {["Roll", "Student", "Mother Tongue", "Latest Score", "Status", "Topics Needing Attention"].map((h) => (
                <th key={h} className="px-3 py-2 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => {
              const st = statusOf(s.score);
              return (
                <tr key={s.roll} className="border-t hover:bg-secondary/30">
                  <td className="px-3 py-2 text-muted-foreground">{s.roll}</td>
                  <td className="px-3 py-2 font-medium">
                    <Link to="/progress/$roll" params={{ roll: String(s.roll) }} className="hover:underline">{s.name}</Link>
                  </td>
                  <td className="px-3 py-2">{langName(s.mother)}</td>
                  <td className="px-3 py-2 font-semibold">{s.score}%</td>
                  <td className="px-3 py-2"><StatusPill status={st} /></td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {st === "understood" || s.weak.length === 0 ? "—" : s.weak.map((w) => TOPICS[w]).join(", ")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Shell>
  );
}
