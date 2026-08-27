import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Clock, Download, CloudOff, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Shell, PageTitle } from "@/components/katha/Shell";
import { useKatha } from "@/lib/katha-store";
import { LESSONS, CONCEPTS } from "@/lib/katha-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/lessons")({
  head: () => ({
    meta: [
      { title: "Select a Lesson — KATHA" },
      {
        name: "description",
        content:
          "Choose today's lesson from the Grade 2-4 EVS, Mathematics and Language syllabus, with offline availability shown for each lesson.",
      },
      { property: "og:title", content: "Select a Lesson — KATHA" },
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

  return (
    <Shell>
      <PageTitle
        eyebrow="Step 1 of 4"
        title="Select a lesson"
        subtitle="Pick the lesson you are teaching now. KATHA will prepare the vernacular explanation, audio and understanding check for it."
      />

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
