import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { ConceptId, LangCode, Status } from "./katha-data";

export type SyncState = "cached" | "syncing" | "synced";

export interface AttemptResult {
  concept: ConceptId;
  status: Status;
  round: number;
}

interface KathaState {
  teacher: string | null;
  login: (name: string) => void;
  logout: () => void;
  source: LangCode;
  target: LangCode;
  setSource: (l: LangCode) => void;
  setTarget: (l: LangCode) => void;
  swap: () => void;
  lessonId: string;
  setLessonId: (id: string) => void;
  results: Record<string, AttemptResult>;
  recordResult: (r: AttemptResult) => void;
  resetResults: () => void;
  online: boolean;
  setOnline: (v: boolean) => void;
  sync: SyncState;
  corrections: { id: string; lang: LangCode; original: string; suggestion: string }[];
  addCorrection: (c: { lang: LangCode; original: string; suggestion: string }) => void;
}

const Ctx = createContext<KathaState | null>(null);

const KEY = "katha-state-v1";

export function KathaProvider({ children }: { children: ReactNode }) {
  const [teacher, setTeacher] = useState<string | null>(null);
  const [source, setSource] = useState<LangCode>("hi");
  const [target, setTarget] = useState<LangCode>("sat");
  const [lessonId, setLessonId] = useState("evs-plant");
  const [results, setResults] = useState<Record<string, AttemptResult>>({});
  const [online, setOnline] = useState(true);
  const [sync, setSync] = useState<SyncState>("synced");
  const [corrections, setCorrections] = useState<KathaState["corrections"]>([]);

  // restore
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return;
      const p = JSON.parse(raw);
      if (p.teacher) setTeacher(p.teacher);
      if (p.source) setSource(p.source);
      if (p.target) setTarget(p.target);
      if (p.lessonId) setLessonId(p.lessonId);
      if (p.results) setResults(p.results);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ teacher, source, target, lessonId, results }));
    } catch {
      /* ignore */
    }
  }, [teacher, source, target, lessonId, results]);

  // offline / sync simulation
  useEffect(() => {
    if (!online) {
      setSync("cached");
      return undefined;
    }
    if (sync === "cached") {
      setSync("syncing");
      const t = setTimeout(() => setSync("synced"), 2200);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [online, sync]);

  const value = useMemo<KathaState>(
    () => ({
      teacher,
      login: (name) => setTeacher(name),
      logout: () => setTeacher(null),
      source,
      target,
      setSource,
      setTarget,
      swap: () => {
        setSource(target);
        setTarget(source);
      },
      lessonId,
      setLessonId,
      results,
      recordResult: (r) => setResults((prev) => ({ ...prev, [r.concept]: r })),
      resetResults: () => setResults({}),
      online,
      setOnline,
      sync,
      corrections,
      addCorrection: (c) =>
        setCorrections((prev) => [...prev, { ...c, id: `${Date.now()}` }]),
    }),
    [teacher, source, target, lessonId, results, online, sync, corrections],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useKatha() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useKatha must be used inside KathaProvider");
  return ctx;
}

/** Small helper for simulated async work (transcription, translation, sync). */
export function useFakeProgress() {
  const [busy, setBusy] = useState(false);
  const run = useCallback(async (ms: number, done?: () => void) => {
    setBusy(true);
    await new Promise((r) => setTimeout(r, ms));
    setBusy(false);
    done?.();
  }, []);
  return { busy, run };
}
