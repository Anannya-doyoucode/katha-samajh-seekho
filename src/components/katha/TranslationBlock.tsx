import { useState } from "react";
import { PencilLine, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SpeakButton } from "./SpeakButton";
import { useKatha } from "@/lib/katha-store";
import { langName, langNative, type LangCode } from "@/lib/katha-data";
import { cn } from "@/lib/utils";

export function SuggestCorrection({ text, lang }: { text: string; lang: LangCode }) {
  const { addCorrection } = useKatha();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(text);
  const [done, setDone] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) {
          setValue(text);
          setDone(false);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
          <PencilLine className="h-3.5 w-3.5" />
          Suggest correction
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Improve this {langName(lang)} text</DialogTitle>
          <DialogDescription>
            Corrections from native speakers are reviewed and used to improve future translations for
            all classrooms using {langNative(lang)}.
          </DialogDescription>
        </DialogHeader>
        {done ? (
          <div className="flex items-start gap-3 rounded-md bg-status-good-soft p-4 text-sm text-status-good">
            <Check className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              Correction submitted. It is queued for review by the {langName(lang)} language panel and
              will improve future lessons.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <p className="label-caps mb-1">Current text</p>
              <p className="rounded-md bg-muted p-3 text-sm">{text}</p>
            </div>
            <div>
              <p className="label-caps mb-1">Your correction</p>
              <Textarea rows={4} value={value} onChange={(e) => setValue(e.target.value)} />
            </div>
          </div>
        )}
        <DialogFooter>
          {done ? (
            <Button onClick={() => setOpen(false)}>Close</Button>
          ) : (
            <Button
              onClick={() => {
                addCorrection({ lang, original: text, suggestion: value });
                setDone(true);
                toast.success("Thank you — correction sent for review");
              }}
              disabled={!value.trim() || value.trim() === text.trim()}
            >
              Submit correction
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function TranslationBlock({
  heading,
  note,
  text,
  speakable,
  lang,
  tone = "plain",
  visual,
  children,
}: {
  heading: string;
  note?: string;
  text: string;
  /** Full multilingual record, used for audio fallback when a voice is missing. */
  speakable?: Speakable;
  lang: LangCode;
  tone?: "plain" | "highlight";
  visual?: string;
  children?: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "panel p-4 md:p-5",
        tone === "highlight" && "border-accent/50 bg-secondary/50",
      )}
    >
      <header className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold">{heading}</h3>
          {note && <p className="text-xs text-muted-foreground">{note}</p>}
        </div>
        <span className="rounded-full border px-2 py-0.5 text-[11px] text-muted-foreground">
          {langNative(lang)}
        </span>
      </header>
      <div className="flex gap-4">
        {visual && (
          <div className="hidden h-20 w-20 shrink-0 items-center justify-center rounded-md border bg-card text-4xl sm:flex">
            {visual}
          </div>
        )}
        <p className="text-[15px] leading-relaxed">{text}</p>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 border-t pt-3">
        <SpeakButton text={text} lang={lang} />
        <SuggestCorrection text={text} lang={lang} />
        {children}
      </div>
    </section>
  );
}
