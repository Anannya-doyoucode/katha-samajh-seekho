import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Clock, Download, CloudOff, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Shell, PageTitle } from "@/components/katha/Shell";
import { LangSwitcher } from "@/components/katha/LanguagePair";
import { useKatha } from "@/lib/katha-store";
import { useSchool } from "@/lib/school-store";
import { LectureCreator } from "@/components/katha/LectureCreator";
import { useState } from "react";
import { Plus, PlayCircle } from "lucide-react";
import { LESSONS, CONCEPTS } from "@/lib/katha-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/lessons")({
  head: () => ({
    meta: [
      { title: "Lessons & Lectures — KATHA" },
      {
        name: "description",
        content:
          "Choose today's lesson from the Grade 2-4 EVS, Mathematics and Language syllabus, with offline availability shown for each lesson.",
      },
      { property: "og:title", content: "Lessons & Lectures — KATHA" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      {
        property: "og:description",
        content: "Grade 3 EVS 'Parts of a Plant' and other lessons, ready to teach online or offline.",
      },
    ],
  }),
  component: LessonsPage,
});

function LessonsPage() {
  const { lessonId, setLessonId } = useKatha();
  const navigate = useNavigate();
  const { lectures } = useSchool();
  const [creating, setCreating] = useState(false);

  return (
    <Shell>
      <PageTitle
        eyebrow="Lessons & Lectures"
        title="Multilingual video lectures"
        subtitle="Record or upload a lecture once. KATHA prepares captions and audio in English, Hindi, Santhali, Mundari and Ho for the projector."
        right={!creating && <Button onClick={() => setCreating(true)}><Plus className="h-4 w-4" /> Create New Lecture</Button>}
      />

      {creating && <LectureCreator onClose={() => setCreating(false)} />}

      <div className="panel mb-8 divide-y">
        {lectures.map((l) => (
          <div key={l.id} className="flex flex-wrap items-center gap-3 p-4">
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{l.title}</p>
              <p className="text-xs text-muted-foreground">{l.cls} {l.subject === "Environmental Studies" ? "EVS" : l.subject}{l.topic ? ` · ${l.topic}` : ""}</p>
            </div>
            <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", l.status === "ready" ? "bg-status-good-soft text-status-good" : "bg-status-warn-soft text-status-warn")}>
              {l.status === "ready" ? "Ready" : "Processing"}
            </span>
            {l.status === "ready" ? (
              <Button asChild size="sm" variant="outline">
                <Link to="/lectures/$id" params={{ id: l.id }}><PlayCircle className="h-4 w-4" /> Play</Link>
              </Button>
            ) : (
              <Button size="sm" variant="outline" disabled>Play</Button>
            )}
          </div>
        ))}
      </div>

      <h2 className="mb-1 text-lg font-bold">Live classroom lesson plans</h2>
      <p className="mb-3 text-sm text-muted-foreground">Pick the lesson you are teaching live. KATHA prepares the vernacular explanation and audio for it.</p>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-md border bg-secondary/40 p-3">
        <LangSwitcher />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {LESSONS.map((lesson) => {
          const selected = lesson.id === lessonId;
          return (
            <article
              key={lesson.id}
              className={cn(
                "panel flex flex-col p-5",
                selected && "border-primary ring-1 ring-primary/30",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="label-caps mb-1">
                    {lesson.grade} · {lesson.subject}
                  </p>
                  <h2 className="text-lg font-bold">{lesson.title}</h2>
                  <p className="text-sm text-muted-foreground">{lesson.titleHi}</p>
                </div>
                {selected && (
                  <span className="flex items-center gap-1 rounded-full bg-primary px-2 py-1 text-[11px] font-medium text-primary-foreground">
                    <Check className="h-3 w-3" /> Selected
                  </span>
                )}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" /> {lesson.minutes} min
                </span>
                {lesson.offline ? (
                  <span className="flex items-center gap-1.5 text-status-good">
                    <Download className="h-3.5 w-3.5" /> Available offline
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-status-warn">
                    <CloudOff className="h-3.5 w-3.5" /> Needs internet
                  </span>
                )}
              </div>

              {lesson.id === "evs-plant" && (
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {CONCEPTS.map((c) => (
                    <li key={c.id} className="rounded-full border px-2 py-0.5 text-[11px]">
                      {c.visual} {c.label.en}
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-4">
                <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
                  <span>{lesson.progress === 0 ? "Not started" : lesson.progress === 100 ? "Completed" : "In progress"}</span>
                  <span>{lesson.progress}%</span>
                </div>
                <Progress value={lesson.progress} />
              </div>

              <div className="mt-4 flex flex-wrap gap-2 pt-1">
                <Button
                  size="sm"
                  onClick={() => {
                    setLessonId(lesson.id);
                    navigate({ to: "/language" });
                  }}
                >
                  {lesson.progress > 0 && lesson.progress < 100 ? "Continue lesson" : "Start lesson"}
                </Button>
                {!lesson.offline && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toast.success(`${lesson.title} cached for offline use`)}
                  >
                    Download for offline
                  </Button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-6">
        <Button asChild variant="outline">
          <Link to="/language">Next: language setup</Link>
        </Button>
      </div>
    </Shell>
  );
}
