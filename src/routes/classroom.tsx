import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Mic, Square, ArrowRight, Loader2, Sparkles, RotateCcw, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Shell, PageTitle } from "@/components/katha/Shell";
import { TranslationBlock, SuggestCorrection } from "@/components/katha/TranslationBlock";
import { SpeakButton } from "@/components/katha/SpeakButton";
import { LanguageSelect } from "@/components/katha/LanguagePair";
import { useKatha } from "@/lib/katha-store";
import { CONCEPTS, langName, langNative, type ConceptId } from "@/lib/katha-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/classroom")({
  head: () => ({
    meta: [
      { title: "Live Classroom — KATHA" },
      {
        name: "description",
        content:
          "Speak the lesson and watch KATHA transcribe, translate and re-teach the concept in the child's mother tongue with audio and a simple visual.",
      },
      { property: "og:title", content: "Live Classroom — KATHA" },
      {
        property: "og:description",
        content: "Teacher speech to vernacular explanation, with audio and a child-friendly visual.",
      },
    ],
  }),
  component: Classroom,
});

type Stage = "idle" | "listening" | "transcribed" | "translating" | "translated" | "teaching" | "ready";

function Classroom() {
  const { source, target, setSource, setTarget, online } = useKatha();
  const [conceptId, setConceptId] = useState<ConceptId>("roots");
  const [stage, setStage] = useState<Stage>("idle");
  const [transcript, setTranscript] = useState("");
  const [typed, setTyped] = useState("");
  const [altShown, setAltShown] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const concept = CONCEPTS.find((c) => c.id === conceptId)!;
  const sourceLine = concept.teacher[source];

  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clear, []);

  const reset = () => {
    clear();
    setStage("idle");
    setTranscript("");
    setAltShown(false);
  };

  // reset the pipeline when concept or languages change
  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conceptId, source, target]);

  const runPipeline = (line: string) => {
    clear();
    setAltShown(false);
    setStage("listening");
    setTranscript("");
    const words = line.split(" ");
    words.forEach((_, i) => {
      timers.current.push(
        setTimeout(() => setTranscript(words.slice(0, i + 1).join(" ")), 90 * (i + 1)),
      );
    });
    const spoken = 90 * words.length + 250;
    timers.current.push(setTimeout(() => setStage("transcribed"), spoken));
    timers.current.push(setTimeout(() => setStage("translating"), spoken + 200));
    timers.current.push(setTimeout(() => setStage("translated"), spoken + 1300));
    timers.current.push(setTimeout(() => setStage("teaching"), spoken + 1500));
    timers.current.push(setTimeout(() => setStage("ready"), spoken + 2800));
  };

  const listening = stage === "listening";
  const showTranscript = stage !== "idle";
  const showTranslation = ["translated", "teaching", "ready"].includes(stage);
  const showKatha = stage === "ready";

  return (
    <Shell>
      <PageTitle
        eyebrow="Step 3 of 4 · Grade 3 EVS — Parts of a Plant"
        title="Live classroom"
        subtitle="Speak or type your lesson line. KATHA transcribes it, translates it, then teaches the concept again in the child's language and context."
        right={
          <Button asChild variant="outline">
            <Link to="/check">
              Understanding check <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        }
      />

      {!online && (
        <div className="mb-5 flex items-center gap-2 rounded-md border border-status-warn/40 bg-status-warn-soft p-3 text-sm text-status-warn">
          <WifiOff className="h-4 w-4" />
          Working offline — using cached lesson, translations and voice packs. Everything will sync when
          the network returns.
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
        <aside className="space-y-5">
          <section className="panel p-4">
            <p className="label-caps mb-2">Concept being taught</p>
            <div className="space-y-1.5">
              {CONCEPTS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setConceptId(c.id)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md border px-3 py-2 text-left text-sm transition-colors hover:bg-secondary/60",
                    c.id === conceptId && "border-primary bg-secondary/60 font-semibold",
                  )}
                >
                  <span aria-hidden className="text-lg">
                    {c.visual}
                  </span>
                  <span>
                    {c.label.en}
                    <span className="block text-[11px] font-normal text-muted-foreground">
                      {c.label[target]}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="panel p-4">
            <p className="label-caps mb-2">Languages (change any time)</p>
            <div className="space-y-2">
              <div>
                <p className="mb-1 text-xs text-muted-foreground">Teacher speaks</p>
                <LanguageSelect value={source} onChange={setSource} />
              </div>
              <div>
                <p className="mb-1 text-xs text-muted-foreground">Child hears</p>
                <LanguageSelect value={target} onChange={setTarget} />
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              {langNative(source)} → {langNative(target)}
            </p>
          </section>
        </aside>

        <div className="space-y-5">
          <section className="panel p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="label-caps mb-1">Teacher input</p>
                <p className="text-sm text-muted-foreground">
                  Speaking in {langName(source)} about {concept.label.en}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => (listening ? reset() : runPipeline(sourceLine))}
                  variant={listening ? "destructive" : "default"}
                  className="gap-2"
                >
                  {listening ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  {listening ? "Stop" : "Start speaking"}
                </Button>
                {stage !== "idle" && !listening && (
                  <Button variant="outline" onClick={reset} className="gap-1.5">
                    <RotateCcw className="h-3.5 w-3.5" /> Clear
                  </Button>
                )}
              </div>
            </div>

            {listening && (
              <div className="mt-4 flex items-center gap-3 rounded-md bg-secondary/60 p-3 text-sm">
                <span className="flex gap-1">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <span
                      key={i}
                      className="w-1 animate-pulse rounded-full bg-primary"
                      style={{ height: 8 + ((i * 7) % 16), animationDelay: `${i * 120}ms` }}
                    />
                  ))}
                </span>
                Listening… speak normally, KATHA is transcribing.
              </div>
            )}

            <div className="mt-4 border-t pt-4">
              <p className="mb-1.5 text-xs text-muted-foreground">
                Or type / paste the line you want to teach ({langName(source)})
              </p>
              <Textarea
                rows={2}
                value={typed}
                placeholder={sourceLine}
                onChange={(e) => setTyped(e.target.value)}
              />
              <Button
                size="sm"
                variant="outline"
                className="mt-2"
                onClick={() => runPipeline(typed.trim() || sourceLine)}
              >
                Send to KATHA
              </Button>
            </div>
          </section>

          {showTranscript && (
            <section className="panel p-4 md:p-5">
              <header className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-semibold">1 · Live transcription</h3>
                  <p className="text-xs text-muted-foreground">
                    Speech-to-text in {langName(source)}
                  </p>
                </div>
                <span className="rounded-full border px-2 py-0.5 text-[11px] text-muted-foreground">
                  {langNative(source)}
                </span>
              </header>
              <p className="text-[15px] leading-relaxed">
                {transcript || "…"}
                {listening && <span className="ml-0.5 animate-pulse">▍</span>}
              </p>
            </section>
          )}

          {(stage === "translating" || stage === "teaching") && (
            <div className="flex items-center gap-2 rounded-md border bg-card p-4 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              {stage === "translating"
                ? `Translating to ${langName(target)}…`
                : `Adapting the explanation for a Grade 3 child in ${langName(target)}…`}
            </div>
          )}

          {showTranslation && (
            <TranslationBlock
              heading="2 · Translation"
              note={`Literal translation in ${langName(target)}`}
              text={concept.translation[target]}
              lang={target}
            />
          )}

          {showKatha && (
            <>
              <TranslationBlock
                heading="3 · KATHA explanation"
                note="Not a translation — the concept re-taught for a Grade 3 child using familiar local examples"
                text={altShown ? concept.kathaAlt[target] : concept.katha[target]}
                lang={target}
                tone="highlight"
                visual={concept.visual}
              >
                <Button
                  size="sm"
                  variant="secondary"
                  className="gap-1.5"
                  onClick={() => setAltShown((v) => !v)}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {altShown ? "Show first explanation" : "Explain again, differently"}
                </Button>
              </TranslationBlock>

              <section className="panel p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="label-caps mb-1">Child-friendly visual</p>
                    <p className="text-sm text-muted-foreground">
                      Shown on the classroom screen or tablet while the audio plays.
                    </p>
                  </div>
                  <SpeakButton
                    text={altShown ? concept.kathaAlt[target] : concept.katha[target]}
                    lang={target}
                    label="Play explanation"
                  />
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  {CONCEPTS.map((c) => (
                    <div
                      key={c.id}
                      className={cn(
                        "flex w-32 flex-col items-center gap-1 rounded-md border p-4",
                        c.id === conceptId ? "border-primary bg-secondary/60" : "opacity-60",
                      )}
                    >
                      <span aria-hidden className="text-4xl">
                        {c.visual}
                      </span>
                      <span className="text-center text-xs font-medium">{c.label[target]}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-4">
                  <SuggestCorrection text={concept.label[target]} lang={target} />
                  <Button asChild size="sm">
                    <Link to="/check">Check understanding</Link>
                  </Button>
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </Shell>
  );
}
