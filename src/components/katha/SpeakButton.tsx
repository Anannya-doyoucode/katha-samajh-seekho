import { useState } from "react";
import { Volume2, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LangCode } from "@/lib/katha-data";

const VOICE: Record<LangCode, string> = {
  en: "en-IN",
  hi: "hi-IN",
  sat: "hi-IN",
  ho: "hi-IN",
  mun: "hi-IN",
};

export function SpeakButton({
  text,
  lang,
  label = "Play audio",
  size = "sm",
}: {
  text: string;
  lang: LangCode;
  label?: string;
  size?: "sm" | "default";
}) {
  const [speaking, setSpeaking] = useState(false);

  const toggle = () => {
    const synth = typeof window !== "undefined" ? window.speechSynthesis : undefined;
    if (!synth) {
      setSpeaking(true);
      setTimeout(() => setSpeaking(false), 2000);
      return;
    }
    if (speaking) {
      synth.cancel();
      setSpeaking(false);
      return;
    }
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = VOICE[lang];
    u.rate = 0.9;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    setSpeaking(true);
    synth.speak(u);
  };

  return (
    <Button type="button" variant="outline" size={size} onClick={toggle} className="gap-1.5">
      {speaking ? <Square className="h-3.5 w-3.5" /> : <Volume2 className="h-4 w-4" />}
      {speaking ? "Stop" : label}
    </Button>
  );
}
