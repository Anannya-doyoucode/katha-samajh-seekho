import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, Pause, Play, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { langName, type LangCode } from "@/lib/katha-data";

/** Text to speak: either a plain string, or the full multilingual record. */
export type Speakable = string | Partial<Record<LangCode, string>>;

/** Preferred BCP-47 tags per language, in order of preference. */
const VOICE_TAGS: Record<LangCode, string[]> = {
  en: ["en-IN", "en-GB", "en-US", "en"],
  hi: ["hi-IN", "hi"],
  sat: ["sat", "hi-IN", "hi", "en-IN"],
  ho: ["hoc", "hi-IN", "hi", "en-IN"],
  mun: ["unr", "hi-IN", "hi", "en-IN"],
};

const OL_CHIKI = /[\u1C50-\u1C7F]/;

function stripOlChiki(s: string) {
  return s.replace(/[\u1C50-\u1C7F\u1C80-\u1CFF]/g, "").trim();
}

/**
 * Resolve what should actually be sent to the speech engine.
 * Scripts with no installed voice (Ol Chiki for Santhali) fall back to the
 * Hindi/English wording of the same sentence so audio always plays.
 */
function resolveSpeech(content: Speakable, lang: LangCode) {
  const record = typeof content === "string" ? null : content;
  const display = typeof content === "string" ? content : (content[lang] ?? "");
  let spoken = display;
  let spokenLang: LangCode = lang;
  let note: string | null = null;

  if (OL_CHIKI.test(display)) {
    const latin = stripOlChiki(display);
    const alt = record?.hi ?? record?.en;
    if (latin.length >= Math.max(8, display.length * 0.4)) {
      spoken = latin;
      spokenLang = "hi";
    } else if (alt) {
      spoken = alt;
      spokenLang = record?.hi ? "hi" : "en";
      note = `${langName(lang)} voice pack not installed on this device — playing the ${langName(spokenLang)} audio of the same line.`;
    }
  }
  return { display, spoken, spokenLang, note };
}

function pickVoice(lang: LangCode): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices();
  for (const tag of VOICE_TAGS[lang]) {
    const v =
      voices.find((x) => x.lang.toLowerCase() === tag.toLowerCase()) ??
      voices.find((x) => x.lang.toLowerCase().startsWith(tag.toLowerCase()));
    if (v) return v;
  }
  return voices[0];
}

type State = "idle" | "loading" | "playing" | "paused";

export function SpeakButton({
  text,
  lang,
  label = "Play audio",
  size = "sm",
}: {
  text: Speakable;
  lang: LangCode;
  label?: string;
  size?: "sm" | "default";
}) {
  const [state, setState] = useState<State>("idle");
  const [note, setNote] = useState<string | null>(null);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  const { spoken, spokenLang, note: fallbackNote } = resolveSpeech(text, lang);

  // Stop and reset whenever the language or the sentence changes.
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
    setState("idle");
    setNote(null);
  }, [spoken, spokenLang]);

  useEffect(
    () => () => {
      if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
    },
    [],
  );

  // Voice lists load asynchronously in most browsers — warm them up.
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.getVoices();
  }, []);

  const start = useCallback(() => {
    const synth = window.speechSynthesis;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(spoken);
    const voice = pickVoice(spokenLang);
    if (voice) {
      u.voice = voice;
      u.lang = voice.lang;
    } else {
      u.lang = VOICE_TAGS[spokenLang][0]!;
    }
    u.rate = 0.88;
    u.pitch = 1;
    u.onstart = () => setState("playing");
    u.onend = () => setState("idle");
    u.onerror = () => setState("idle");
    utterRef.current = u;
    setNote(fallbackNote);
    setState("loading");
    synth.speak(u);
    // Some engines never fire onstart; assume playing shortly after.
    setTimeout(() => setState((s) => (s === "loading" ? "playing" : s)), 600);
  }, [spoken, spokenLang, fallbackNote]);

  const onPrimary = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const synth = window.speechSynthesis;
    if (state === "playing") {
      synth.pause();
      setState("paused");
      return;
    }
    if (state === "paused") {
      synth.resume();
      setState("playing");
      return;
    }
    start();
  };

  const Icon = state === "playing" ? Pause : state === "paused" ? Play : Volume2;
  const primaryLabel =
    state === "playing" ? "Pause" : state === "paused" ? "Resume" : label;

  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <Button type="button" variant="outline" size={size} onClick={onPrimary} className="gap-1.5">
        {state === "loading" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Icon className="h-4 w-4" />
        )}
        {primaryLabel}
      </Button>
      {state !== "idle" && (
        <>
          <Button
            type="button"
            variant="ghost"
            size={size}
            onClick={start}
            className="gap-1.5 text-muted-foreground"
            title="Replay from the start"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Replay
          </Button>
          <span
            className={
              state === "paused"
                ? "text-[11px] font-medium text-status-warn"
                : "text-[11px] font-medium text-status-good"
            }
          >
            {state === "paused" ? "Paused" : `Playing · ${langName(spokenLang)}`}
          </span>
        </>
      )}
      {note && state !== "idle" && (
        <span className="w-full text-[11px] text-muted-foreground">{note}</span>
      )}
    </span>
  );
}
