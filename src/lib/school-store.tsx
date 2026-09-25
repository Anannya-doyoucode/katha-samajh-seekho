import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  SEED_LECTURES, SEED_REMEDIAL, SEED_STUDENTS, WEEKLY_QUESTIONS,
  type Lecture, type RemedialSession, type SchoolStudent, type TopicId,
} from "./school-data";

export interface AssessmentSummary {
  title: string;
  date: string;
  overall: number;
  topicPct: Record<TopicId, number>;
  marks: Record<number, number>; // roll -> marks out of question count
}

interface SchoolState {
  lectures: Lecture[];
  addLecture: (l: Lecture) => void;
  students: SchoolStudent[];
  latest: AssessmentSummary | null;
  submitAssessment: (title: string, marks: Record<number, number>, perQ: Record<string, Set<number>>) => AssessmentSummary;
  remedial: RemedialSession[];
  addRemedial: (r: RemedialSession) => void;
}

const g = globalThis as unknown as { __schoolCtx?: React.Context<SchoolState | null> };
const Ctx = (g.__schoolCtx ??= createContext<SchoolState | null>(null));
const KEY = "katha-school-v1";

export function SchoolProvider({ children }: { children: ReactNode }) {
  const [custom, setCustom] = useState<Lecture[]>([]);
  const [students, setStudents] = useState<SchoolStudent[]>(SEED_STUDENTS);
  const [latest, setLatest] = useState<AssessmentSummary | null>(null);
  const [remedial, setRemedial] = useState<RemedialSession[]>(SEED_REMEDIAL);

  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem(KEY) ?? "null");
      if (!p) return;
      if (p.students) setStudents(p.students);
      if (p.latest) setLatest(p.latest);
      if (p.remedial) setRemedial(p.remedial);
    } catch { /* ignore */ }
  }, []);
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify({ students, latest, remedial })); } catch { /* ignore */ }
  }, [students, latest, remedial]);

  const value = useMemo<SchoolState>(() => ({
    lectures: [...custom, ...SEED_LECTURES],
    addLecture: (l) => setCustom((p) => [l, ...p]),
    students,
    latest,
    submitAssessment: (title, marks, perQ) => {
      const n = WEEKLY_QUESTIONS.length;
      const rolls = students.map((s) => s.roll);
      const topicPct = {} as Record<TopicId, number>;
      (["parts", "roots", "uses", "photo"] as TopicId[]).forEach((t) => {
        const qs = WEEKLY_QUESTIONS.filter((q) => q.topic === t);
        const hits = qs.reduce((a, q) => a + (perQ[q.id]?.size ?? 0), 0);
        topicPct[t] = Math.round((hits / (qs.length * rolls.length)) * 100);
      });
      const total = rolls.reduce((a, r) => a + (marks[r] ?? 0), 0);
      const summary: AssessmentSummary = {
        title,
        date: new Date().toLocaleDateString("en-IN"),
        overall: Math.round((total / (n * rolls.length)) * 100),
        topicPct,
        marks,
      };
      setLatest(summary);
      setStudents((prev) => prev.map((s) => {
        const score = Math.round(((marks[s.roll] ?? 0) / n) * 100);
        const weak = WEEKLY_QUESTIONS.filter((q) => !perQ[q.id]?.has(s.roll)).map((q) => q.topic);
        return {
          ...s,
          score,
          weak: [...new Set(weak)],
          history: [{ lecture: "Plants Around Us", score }, ...s.history.slice(1)],
        };
      }));
      return summary;
    },
    remedial,
    addRemedial: (r) => setRemedial((p) => [...p, r]),
  }), [custom, students, latest, remedial]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSchool() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useSchool must be used inside SchoolProvider");
  return c;
}
