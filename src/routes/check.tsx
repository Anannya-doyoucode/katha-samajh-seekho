import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Mic, Check, X, Sparkles, ArrowRight, RotateCcw, Image as ImageIcon, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Shell, PageTitle } from "@/components/katha/Shell";
import { StatusPill } from "@/components/katha/StatusPill";
import { SpeakButton } from "@/components/katha/SpeakButton";
import { SuggestCorrection } from "@/components/katha/TranslationBlock";
import { LangSwitcher } from "@/components/katha/LanguagePair";
import { useKatha } from "@/lib/katha-store";
import { CONCEPTS, langName, type ConceptId, type Status } from "@/lib/katha-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/check")({
  head: () => ({
    meta: [
      { title: "Understanding Check — KATHA" },
      {
        name: "description",
        content:
          "Short concept questions in the child's mother tongue — multiple choice, picture and voice answers — with adaptive re-explanation when a child struggles.",
      },
      { property: "og:title", content: "Understanding Check — KATHA" },
      {
        property: "og:description",
        content: "Check whether the child understood, and re-teach differently when they did not.",
      },
    ],
  }),
  component: CheckPage,
});

type Phase = "question" | "correct" | "reexplain" | "failed" | "summary";

const KIND_META = {
  mcq: { icon: ListChecks, label: "Multiple choice" },
  image: { icon: ImageIcon, label: "Picture question" },
  voice: { icon: Mic, label: "Voice answer" },
} as const;

function CheckPage() {
  const { target, recordResult, results, resetResults } = useKatha();
  const [index, setIndex] = useState(0);
  const [round, setRound] = useState<0 | 1>(0);
  const [phase, setPhase] = useState<Phase>("question");
  const [picked, setPicked] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);

  const concept = CONCEPTS[index]!;
  const question = concept.questions[round];
  const Kind = KIND_META[question.kind].icon;

  const finishConcept = (status: Status) => {
    recordResult({ concept: concept.id, status, round: round + 1 });
    if (index + 1 < CONCEPTS.length) {
      setIndex(index + 1);
      setRound(0);
      setPicked(null);
      setPhase("question");
    } else {
      setPhase("summary");
    }
  };

  const submit = (optionId: string) => {
    setPicked(optionId);
    const correct = question.options.find((o) => o.id === optionId)?.correct;
    if (correct) {
      setPhase("correct");
      recordResult({
        concept: concept.id,
        status: round === 0 ? "understood" : "practice",
        round: round + 1,
      });
    } else {
      setPhase(round === 0 ? "reexplain" : "failed");
      if (round === 1) recordResult({ concept: concept.id, status: "attention", round: 2 });
    }
  };

  const next = () => {
    if (index + 1 < CONCEPTS.length) {
      setIndex(index + 1);
      setRound(0);
      setPicked(null);
      setPhase("question");
    } else {
      setPhase("summary");
    }
  };

  const restart = () => {
    resetResults();
    setIndex(0);
    setRound(0);
    setPicked(null);
    setPhase("question");
  };

  if (phase === "summary") {
    return (
      <Shell>
        <PageTitle
          eyebrow="Step 4 of 4"
          title="Understanding results"
          subtitle={`Concept-wise result for this class, based on answers given in ${langName(target)}.`}
          right={
            <Button asChild>
              <Link to="/analytics">
                Open analytics <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          }
        />
        <div className="grid gap-4 md:grid-cols-3">
          {CONCEPTS.map((c) => {
            const r = results[c.id];
            return (
              <article key={c.id} className="panel p-5">
                <p className="text-3xl" aria-hidden>
                  {c.visual}
                </p>
                <h2 className="mt-2 text-lg font-bold">{c.label.en}</h2>
                <p className="text-sm text-muted-foreground">{c.label[target]}</p>
                <div className="mt-2">
                  <SpeakButton text={c.label} lang={target} label="Play" />
                </div>
                <div className="mt-3">
                  {r ? <StatusPill status={r.status} /> : <span className="text-sm text-muted-foreground">Not attempted</span>}
                </div>
                {r && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Answered correctly on attempt {r.round}
                    {r.status === "attention" && " — still needs a teacher-led re-explanation"}
                  </p>
                )}
              </article>
            );
          })}
        </div>
        <div className="mt-6 rounded-md border bg-secondary/40 p-3">
          <LangSwitcher />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="outline" onClick={restart} className="gap-1.5">
            <RotateCcw className="h-4 w-4" /> Run the check again
          </Button>
          <Button asChild variant="outline">
            <Link to="/classroom">Re-teach a concept</Link>
          </Button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <PageTitle
        eyebrow={`Understanding check · Concept ${index + 1} of ${CONCEPTS.length}`}
        title={`${concept.visual} ${concept.label.en} — ${concept.label[target]}`}
        subtitle={`Questions are asked in ${langName(target)} and test the concept, not memorised words.`}
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <section className="panel p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <span className="label-caps flex items-center gap-1.5">
                <Kind className="h-3.5 w-3.5" /> {KIND_META[question.kind].label}
                {round === 1 && " · new question, same concept"}
              </span>
              <SpeakButton text={question.prompt} lang={target} label="Read question aloud" />
            </div>
            <h2 className="text-lg leading-relaxed font-semibold">{question.prompt[target]}</h2>
            <div className="mt-3 rounded-md border bg-secondary/40 p-2.5">
              <LangSwitcher />
            </div>

            {question.kind === "voice" ? (
              <div className="mt-5 rounded-md border p-5 text-center">
                <Button
                  variant={recording ? "destructive" : "default"}
                  className="gap-2"
                  onClick={() => {
                    if (recording) return;
                    setRecording(true);
                    setTimeout(() => {
                      setRecording(false);
                      submit("a");
                    }, 1800);
                  }}
                >
                  <Mic className="h-4 w-4" />
                  {recording ? "Listening to the child…" : "Record the child's answer"}
                </Button>
                <p className="mt-2 text-xs text-muted-foreground">
                  The child answers aloud in {langName(target)}. KATHA checks whether the idea is right,
                  not the exact words.
                </p>
              </div>
            ) : (
              <div
                className={cn(
                  "mt-5 grid gap-3",
                  question.kind === "image" ? "sm:grid-cols-3" : "sm:grid-cols-1",
                )}
              >
                {question.options.map((o) => {
                  const chosen = picked === o.id;
                  const revealed = phase !== "question";
                  return (
                    <button
                      key={o.id}
                      disabled={revealed}
                      onClick={() => submit(o.id)}
                      className={cn(
                        "flex items-center gap-3 rounded-md border p-4 text-left text-sm transition-colors",
                        !revealed && "hover:bg-secondary/60",
                        question.kind === "image" && "flex-col text-center",
                        revealed && o.correct && "border-status-good bg-status-good-soft",
                        revealed && chosen && !o.correct && "border-status-bad bg-status-bad-soft",
                      )}
                    >
                      {o.emoji && (
                        <span aria-hidden className="text-4xl">
                          {o.emoji}
                        </span>
                      )}
                      <span className="flex-1">{o.label[target]}</span>
                      {revealed && o.correct && <Check className="h-4 w-4 text-status-good" />}
                      {revealed && chosen && !o.correct && <X className="h-4 w-4 text-status-bad" />}
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          {phase === "correct" && (
            <section className="panel border-status-good/40 bg-status-good-soft p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-status-good">
                    {round === 0 ? "🟢 Understood" : "🟡 Understood after re-explanation"}
                  </p>
                  <p className="mt-1 text-sm">
                    The child explained the idea correctly — {concept.label.en} is clear.
                  </p>
                </div>
                <Button onClick={next}>
                  {index + 1 < CONCEPTS.length ? "Next concept" : "See results"}{" "}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </section>
          )}

          {phase === "reexplain" && (
            <section className="panel border-accent/50 bg-secondary/60 p-5">
              <p className="label-caps mb-1 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" /> Explain again, differently
              </p>
              <h3 className="text-base font-semibold">
                Difficult concept identified: {concept.label.en}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                KATHA will not repeat the same words. Here is a new explanation with a different
                example, in {langName(target)}.
              </p>
              <p className="mt-3 rounded-md border bg-card p-4 text-[15px] leading-relaxed">
                {concept.kathaAlt[target]}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <SpeakButton text={concept.kathaAlt} lang={target} label="Play new explanation" />
                <SuggestCorrection text={concept.kathaAlt[target]} lang={target} />
                <Button
                  onClick={() => {
                    setRound(1);
                    setPicked(null);
                    setPhase("question");
                  }}
                >
                  Try a different question <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </section>
          )}

          {phase === "failed" && (
            <section className="panel border-status-bad/40 bg-status-bad-soft p-5">
              <p className="font-semibold text-status-bad">🔴 Needs teacher attention</p>
              <p className="mt-1 text-sm">
                Two different explanations and two different questions were tried. {concept.label.en} is
                marked for a small-group re-teach with you.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button onClick={() => finishConcept("attention")}>
                  {index + 1 < CONCEPTS.length ? "Next concept" : "See results"}{" "}
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button asChild variant="outline">
                  <Link to="/classroom">Re-teach now in live classroom</Link>
                </Button>
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-5">
          <section className="panel p-5">
            <p className="label-caps mb-3">Progress</p>
            <ol className="space-y-2 text-sm">
              {CONCEPTS.map((c, i) => {
                const r = results[c.id as ConceptId];
                return (
                  <li key={c.id} className="flex items-center justify-between gap-2">
                    <span className={cn(i === index && "font-semibold")}>
                      {c.visual} {c.label.en}
                    </span>
                    {r ? (
                      <StatusPill status={r.status} />
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        {i === index ? "In progress" : "Pending"}
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          </section>

          <section className="panel p-5 text-sm">
            <p className="label-caps mb-2">How this works</p>
            <ul className="space-y-2 text-muted-foreground">
              <li>Wrong answer → a new explanation with a different example, never a repeat.</li>
              <li>Then a new question testing the same concept in another way.</li>
              <li>Still wrong → flagged for you, with the exact concept named.</li>
            </ul>
            <Button variant="ghost" size="sm" onClick={restart} className="mt-3 gap-1.5 px-0">
              <RotateCcw className="h-3.5 w-3.5" /> Restart check
            </Button>
          </section>
        </aside>
      </div>
    </Shell>
  );
}
