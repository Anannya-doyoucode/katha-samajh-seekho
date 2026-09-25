import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Check, Circle, Loader2, Square, Upload, Video, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { LanguageSelect } from "./LanguagePair";
import { useSchool } from "@/lib/school-store";
import { ALL_LANGS, PLANT_CAPTIONS, fmtTime, type Lecture } from "@/lib/school-data";
import type { LangCode } from "@/lib/katha-data";

const STEPS = [
  "Video uploaded",
  "Speech transcription generated",
  "Translation generated",
  "Vernacular adaptation generated",
  "Captions generated",
  "Audio tracks prepared",
];

type Stage = "details" | "media" | "language" | "processing" | "done";

export function LectureCreator({ onClose }: { onClose: () => void }) {
  const { addLecture } = useSchool();
  const [stage, setStage] = useState<Stage>("details");
  const [form, setForm] = useState({ title: "", subject: "Environmental Studies", cls: "Class 3", topic: "" });
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [recSecs, setRecSecs] = useState(0);
  const [recorded, setRecorded] = useState<number | null>(null);
  const [original, setOriginal] = useState<LangCode>("hi");
  const [done, setDone] = useState(0);
  const [newId, setNewId] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!recording) return;
    const t = setInterval(() => setRecSecs((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [recording]);

  useEffect(() => {
    if (stage !== "processing") return;
    if (done >= STEPS.length) {
      const id = `lec-${Date.now()}`;
      const lecture: Lecture = {
        id,
        title: form.title || "Untitled lecture",
        subject: form.subject,
        cls: form.cls,
        topic: form.topic,
        original,
        status: "ready",
        duration: 30,
        videoUrl,
        audio: ALL_LANGS.map((lang) => ({ lang, url: null, status: "ready" })),
        // Demo output: sample caption track until a real pipeline is connected.
        captions: PLANT_CAPTIONS,
      };
      addLecture(lecture);
      setNewId(id);
      setStage("done");
      return;
    }
    const t = setTimeout(() => setDone((d) => d + 1), 900 + done * 250);
    return () => clearTimeout(t);
  }, [stage, done]); // eslint-disable-line react-hooks/exhaustive-deps

  const hasMedia = !!videoUrl || recorded !== null;

  return (
    <section className="panel mb-6 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">Create Lecture</h2>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close"><X className="h-4 w-4" /></Button>
      </div>

      {stage === "details" && (
        <div className="grid gap-4 sm:grid-cols-2">
          {([
            ["title", "Lecture title", "e.g. Plants Around Us"],
            ["subject", "Subject", ""],
            ["cls", "Class", ""],
            ["topic", "Topic", "e.g. Functions of roots"],
          ] as const).map(([k, label, ph]) => (
            <div key={k} className="space-y-1.5">
              <Label htmlFor={k}>{label}</Label>
              <Input id={k} placeholder={ph} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
            </div>
          ))}
          <div className="sm:col-span-2">
            <Button disabled={!form.title} onClick={() => setStage("media")}>Next: add video</Button>
          </div>
        </div>
      )}

      {stage === "media" && (
        <div className="space-y-4">
          <p className="label-caps">Upload Lecture Video</p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-md border border-dashed p-5 text-center">
              <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
              <p className="mt-2 text-sm font-medium">Upload a video file</p>
              <p className="text-xs text-muted-foreground">MP4 or WebM from your phone or laptop</p>
              <input
                ref={fileRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) { setVideoUrl(URL.createObjectURL(f)); setRecorded(null); }
                }}
              />
              <Button size="sm" variant="outline" className="mt-3" onClick={() => fileRef.current?.click()}>Choose video</Button>
            </div>
            <div className="rounded-md border p-5 text-center">
              <Video className="mx-auto h-6 w-6 text-muted-foreground" />
              <p className="mt-2 text-sm font-medium">Record lecture</p>
              <p className="font-mono text-2xl">{fmtTime(recSecs)}</p>
              <p className="text-[11px] text-muted-foreground">Prototype: recording is simulated</p>
              <div className="mt-3 flex justify-center gap-2">
                {!recording ? (
                  <Button size="sm" variant="outline" onClick={() => { setRecSecs(0); setRecording(true); setVideoUrl(null); setRecorded(null); }}>
                    <Circle className="h-3 w-3 fill-status-bad text-status-bad" /> Record
                  </Button>
                ) : (
                  <Button size="sm" variant="outline" onClick={() => { setRecording(false); setRecorded(recSecs); }}>
                    <Square className="h-3 w-3" /> Stop
                  </Button>
                )}
              </div>
            </div>
          </div>
          {hasMedia && (
            <div className="rounded-md border bg-muted/40 p-3">
              <p className="mb-2 text-xs text-muted-foreground">Preview</p>
              {videoUrl ? (
                <video src={videoUrl} controls className="max-h-64 w-full rounded bg-foreground/90" />
              ) : (
                <div className="flex h-40 items-center justify-center rounded bg-foreground/90 text-sm text-background">
                  Recorded lecture · {fmtTime(recorded ?? 0)}
                </div>
              )}
            </div>
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStage("details")}>Back</Button>
            <Button disabled={!hasMedia || recording} onClick={() => setStage("language")}>Next</Button>
          </div>
        </div>
      )}

      {stage === "language" && (
        <div className="max-w-md space-y-4">
          <p className="label-caps">Prepare Multilingual Lecture</p>
          <div className="space-y-1.5">
            <Label htmlFor="orig">Language of original lecture</Label>
            <LanguageSelect id="orig" value={original} onChange={setOriginal} />
          </div>
          <p className="text-xs text-muted-foreground">
            KATHA will prepare captions and an audio track in English, Hindi, Santhali, Mundari and Ho.
            The video itself is not re-rendered — each language is a separate track.
          </p>
          <Button onClick={() => { setDone(0); setStage("processing"); }}>Prepare Multilingual Lecture</Button>
        </div>
      )}

      {(stage === "processing" || stage === "done") && (
        <div className="max-w-lg space-y-3">
          <p className="rounded-md bg-status-warn-soft px-3 py-2 text-xs text-status-warn">
            Prototype: these steps are simulated and use sample captions and sample voices. No real AI dubbing is running.
          </p>
          <Progress value={(done / STEPS.length) * 100} />
          <ul className="space-y-2">
            {STEPS.map((s, i) => (
              <li key={s} className="flex items-center gap-2 text-sm">
                {i < done ? <Check className="h-4 w-4 text-status-good" />
                  : i === done && stage === "processing" ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  : <Circle className="h-4 w-4 text-muted-foreground/40" />}
                <span className={i < done ? "" : "text-muted-foreground"}>{s}</span>
              </li>
            ))}
          </ul>
          {stage === "done" && (
            <div className="flex gap-2 pt-2">
              <Button asChild><Link to="/lectures/$id" params={{ id: newId }}>Open lecture player</Link></Button>
              <Button variant="outline" onClick={onClose}>Close</Button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
