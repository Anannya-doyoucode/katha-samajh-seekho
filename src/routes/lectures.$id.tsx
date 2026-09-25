import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2, Captions, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shell } from "@/components/katha/Shell";
import { useSchool } from "@/lib/school-store";
import { ALL_LANGS, fmtTime, type Lecture } from "@/lib/school-data";
import { langName, type LangCode } from "@/lib/katha-data";

export const Route = createFileRoute("/lectures/$id")({
  head: () => ({
    meta: [
      { title: "Lecture Player — KATHA" },
      { name: "description", content: "Play a lecture on the classroom projector with switchable audio tracks and captions in five languages." },
      { property: "og:title", content: "Lecture Player — KATHA" },
      { property: "og:description", content: "One lecture, five audio tracks and caption languages: English, Hindi, Santhali, Mundari and Ho." },
      { property: "og:type", content: "video.other" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LecturePage,
  notFoundComponent: () => <p className="p-8">Lecture not found.</p>,
});

const VOICE: Record<LangCode, string[]> = { en: ["en-IN", "en"], hi: ["hi-IN", "hi"], sat: ["hi-IN", "hi"], ho: ["hi-IN", "hi"], mun: ["hi-IN", "hi"] };

function LecturePage() {
  const { id } = Route.useParams();
  const { lectures } = useSchool();
  const lecture = lectures.find((l) => l.id === id);
  if (!lecture) throw notFound();
  return (
    <Shell>
      <Player key={lecture.id} lecture={lecture} />
    </Shell>
  );
}

function Player({ lecture }: { lecture: Lecture }) {
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [volume, setVolume] = useState(80);
  const [audio, setAudio] = useState<LangCode>("hi");
  const [cc, setCc] = useState<LangCode | "off">("sat");
  const videoRef = useRef<HTMLVideoElement>(null);
  const trackRef = useRef<HTMLAudioElement>(null);
  const lastSeg = useRef(-1);
  const dur = lecture.duration;

  const segIdx = lecture.captions.reduce((acc, c, i) => (time >= c.t ? i : acc), -1);
  const seg = lecture.captions[segIdx];
  const track = lecture.audio.find((a) => a.lang === audio);

  // clock (mock player) — or follow the real video
  useEffect(() => {
    if (!playing) return;
    const v = videoRef.current;
    if (v) { v.play().catch(() => {}); return () => v.pause(); }
    const t = setInterval(() => setTime((s) => {
      if (s + 0.25 >= dur) { setPlaying(false); return dur; }
      return s + 0.25;
    }), 250);
    return () => clearInterval(t);
  }, [playing, dur]);

  // audio: real dubbed track URL when available, otherwise sample voice per caption line
  useEffect(() => {
    if (!playing || !seg || track?.url) return;
    if (lastSeg.current === segIdx) return;
    lastSeg.current = segIdx;
    const synth = window.speechSynthesis;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(seg.text[audio]);
    const voices = synth.getVoices();
    const v = VOICE[audio].map((tag) => voices.find((x) => x.lang.startsWith(tag))).find(Boolean);
    if (v) { u.voice = v; u.lang = v.lang; }
    u.volume = volume / 100;
    u.rate = 0.9;
    synth.speak(u);
  }, [playing, segIdx, audio]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!playing) window.speechSynthesis?.cancel();
  }, [playing]);
  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  // switching language re-voices the current line immediately
  useEffect(() => { lastSeg.current = -1; }, [audio]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume / 100;
      videoRef.current.muted = audio !== lecture.original;
    }
    if (trackRef.current) trackRef.current.volume = volume / 100;
  }, [volume, audio, lecture.original]);

  const seek = (s: number) => {
    setTime(s);
    lastSeg.current = -1;
    if (videoRef.current) videoRef.current.currentTime = s;
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="overflow-hidden rounded-lg border bg-foreground">
        <div className="relative aspect-video">
          {lecture.videoUrl ? (
            <video
              ref={videoRef}
              src={lecture.videoUrl}
              className="h-full w-full"
              onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
              onEnded={() => setPlaying(false)}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center bg-[oklch(0.93_0.03_120)] text-center">
              <span className="text-7xl md:text-8xl" aria-hidden>{seg?.visual ?? "🌱"}</span>
              <p className="mt-3 font-serif text-lg font-bold text-foreground/80 md:text-2xl">{lecture.title}</p>
              <p className="text-xs text-foreground/60">Sample lecture visuals · {lecture.cls} {lecture.subject}</p>
            </div>
          )}
          {cc !== "off" && seg && (
            <div className="absolute inset-x-0 bottom-4 flex justify-center px-4">
              <p className="max-w-3xl rounded bg-foreground/85 px-3 py-1.5 text-center text-base text-background md:text-xl">
                {seg.text[cc]}
              </p>
            </div>
          )}
        </div>
        {track?.url && <audio ref={trackRef} src={track.url} />}
        <div className="flex flex-wrap items-center gap-3 bg-card px-3 py-2.5">
          <Button size="sm" variant="outline" onClick={() => { if (time >= dur) seek(0); setPlaying(!playing); }} aria-label={playing ? "Pause" : "Play"}>
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => seek(0)} aria-label="Restart"><RotateCcw className="h-4 w-4" /></Button>
          <span className="font-mono text-xs text-muted-foreground">{fmtTime(time)} / {fmtTime(dur)}</span>
          <Slider className="min-w-32 flex-1" value={[time]} max={dur} step={0.25} onValueChange={([v]) => seek(v ?? 0)} aria-label="Progress" />
          <span className="flex items-center gap-1.5">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <Slider className="w-20" value={[volume]} max={100} onValueChange={([v]) => setVolume(v ?? 0)} aria-label="Volume" />
          </span>
          <label className="flex items-center gap-1.5 text-xs">
            Audio
            <Select value={audio} onValueChange={(v) => setAudio(v as LangCode)}>
              <SelectTrigger className="h-8 w-28"><SelectValue /></SelectTrigger>
              <SelectContent>
                {ALL_LANGS.map((l) => <SelectItem key={l} value={l}>{langName(l)}</SelectItem>)}
              </SelectContent>
            </Select>
          </label>
          <label className="flex items-center gap-1.5 text-xs">
            <Captions className="h-4 w-4" /> CC
            <Select value={cc} onValueChange={(v) => setCc(v as LangCode | "off")}>
              <SelectTrigger className="h-8 w-28"><SelectValue /></SelectTrigger>
              <SelectContent>
                {ALL_LANGS.map((l) => <SelectItem key={l} value={l}>{langName(l)}</SelectItem>)}
                <SelectItem value="off">Off</SelectItem>
              </SelectContent>
            </Select>
          </label>
        </div>
      </div>

      <p className="mt-2 text-[11px] text-muted-foreground">
        Prototype: audio tracks use sample browser voices (Santhali, Ho and Mundari are read with the nearest available voice) and captions are sample vernacular text. Real dubbed audio files can replace each track without changing the video.
      </p>

      <div className="mt-5 grid gap-5 md:grid-cols-3">
        <section className="panel p-5 md:col-span-2">
          <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
            <div><dt className="label-caps">Lecture</dt><dd className="font-semibold">{lecture.title}</dd></div>
            <div><dt className="label-caps">Class</dt><dd className="font-semibold">{lecture.cls.replace("Class ", "")}</dd></div>
            <div><dt className="label-caps">Subject</dt><dd className="font-semibold">{lecture.subject}</dd></div>
          </dl>
          <p className="label-caps mt-4">Available languages</p>
          <p className="text-sm">{ALL_LANGS.map(langName).join(" • ")}</p>
          <Button asChild className="mt-4"><Link to="/assessments">Take Weekly Assessment</Link></Button>
        </section>
        <section className="panel max-h-72 overflow-y-auto p-5">
          <p className="label-caps mb-2">Transcript · {langName(cc === "off" ? audio : cc)}</p>
          <ul className="space-y-1.5 text-sm">
            {lecture.captions.map((c, i) => (
              <li key={c.t}>
                <button onClick={() => seek(c.t)} className={`w-full text-left ${i === segIdx ? "font-semibold text-primary" : "text-muted-foreground"}`}>
                  <span className="mr-2 font-mono text-xs">{fmtTime(c.t)}</span>{c.text[cc === "off" ? audio : cc]}
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
