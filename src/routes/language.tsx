import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, CloudOff, ArrowRight, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Shell, PageTitle } from "@/components/katha/Shell";
import { LanguagePair } from "@/components/katha/LanguagePair";
import { useKatha } from "@/lib/katha-store";
import { CONCEPTS, LANGUAGES, LESSONS, langName, langNative } from "@/lib/katha-data";

export const Route = createFileRoute("/language")({
  head: () => ({
    meta: [
      { title: "Language Setup — KATHA" },
      {
        name: "description",
        content:
          "Choose any teacher language and any student mother tongue from English, Hindi, Santhali, Ho and Mundari, and check offline availability of each language pack.",
      },
      { property: "og:title", content: "Language Setup — KATHA" },
      {
        property: "og:description",
        content: "Five fully interchangeable languages, with offline language packs for the classroom.",
      },
    ],
  }),
  component: LanguagePage,
});

function LanguagePage() {
  const { source, target, lessonId, setSource, setTarget } = useKatha();
  const lesson = LESSONS.find((l) => l.id === lessonId) ?? LESSONS[0]!;
  const sample = CONCEPTS[0]!;

  return (
    <Shell>
      <PageTitle
        eyebrow="Step 2 of 4"
        title="Language setup"
        subtitle="Any of the five languages can be the teacher's language, and any can be the child's mother tongue. Change them at any time — even mid-lesson."
        right={
          <Button asChild>
            <Link to="/classroom">
              Go to Live Classroom <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        }
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <LanguagePair title={`Lesson: ${lesson.title}`} />
        </div>

        <div className="space-y-5 lg:col-span-2">
          <section className="panel p-5">
            <p className="label-caps mb-3">Preview — how the same line changes</p>
            <p className="mb-3 text-sm text-muted-foreground">
              Teacher line from <strong>{lesson.title}</strong>, concept <strong>{sample.label.en}</strong>.
              Tap a language to make it the student's mother tongue.
            </p>
            <div className="space-y-2">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setTarget(l.code);
                    toast.success(`Student language set to ${l.name}`);
                  }}
                  className={`w-full rounded-md border p-3 text-left transition-colors hover:bg-secondary/60 ${
                    l.code === target ? "border-primary bg-secondary/60" : ""
                  }`}
                >
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-semibold">
                      {l.name} · {l.native}
                    </span>
                    {l.offline ? (
                      <span className="flex items-center gap-1 text-status-good">
                        <Download className="h-3 w-3" /> Offline ready
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-status-warn">
                        <CloudOff className="h-3 w-3" /> Online only
                      </span>
                    )}
                  </div>
                  <p className="text-sm">{sample.translation[l.code]}</p>
                </button>
              ))}
            </div>
          </section>

          <section className="panel p-5">
            <p className="label-caps mb-3">Teacher language</p>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((l) => (
                <Button
                  key={l.code}
                  size="sm"
                  variant={l.code === source ? "default" : "outline"}
                  onClick={() => setSource(l.code)}
                >
                  {l.name}
                </Button>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-md bg-secondary/60 p-3 text-sm">
              <span>
                Selected pair: <strong>{langName(source)}</strong> → <strong>{langName(target)}</strong>{" "}
                <span className="text-muted-foreground">
                  ({langNative(source)} → {langNative(target)})
                </span>
              </span>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5"
                onClick={() => toast.success("Language packs refreshed and cached on this device")}
              >
                <RefreshCw className="h-3.5 w-3.5" /> Update offline packs
              </Button>
            </div>
          </section>
        </div>
      </div>
    </Shell>
  );
}
