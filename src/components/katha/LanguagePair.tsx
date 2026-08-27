import { ArrowLeftRight, Download, CloudOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useKatha } from "@/lib/katha-store";
import { LANGUAGES, langName, langNative, type LangCode } from "@/lib/katha-data";

export function LanguageSelect({
  value,
  onChange,
  id,
}: {
  value: LangCode;
  onChange: (l: LangCode) => void;
  id?: string;
}) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as LangCode)}>
      <SelectTrigger id={id} className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {LANGUAGES.map((l) => (
          <SelectItem key={l.code} value={l.code}>
            {l.name} — {l.native}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function LanguagePair({ title = "Language setup" }: { title?: string }) {
  const { source, target, setSource, setTarget, swap } = useKatha();
  const targetOffline = LANGUAGES.find((l) => l.code === target)?.offline;

  return (
    <section className="panel p-5">
      <p className="label-caps mb-3">{title}</p>
      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="src">Teacher / source language</Label>
          <LanguageSelect id="src" value={source} onChange={setSource} />
        </div>
        <div className="flex justify-center">
          <Button variant="ghost" size="sm" onClick={swap} className="gap-1.5 text-muted-foreground">
            <ArrowLeftRight className="h-3.5 w-3.5" /> Swap
          </Button>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="tgt">Student mother tongue</Label>
          <LanguageSelect id="tgt" value={target} onChange={setTarget} />
        </div>
      </div>

      <div className="mt-4 rounded-md border bg-secondary/50 p-3">
        <p className="text-sm font-medium">
          {langName(source)} → {langName(target)}
        </p>
        <p className="text-xs text-muted-foreground">
          {langNative(source)} → {langNative(target)}
        </p>
        <p className="mt-2 flex items-center gap-1.5 text-xs">
          {targetOffline ? (
            <>
              <Download className="h-3.5 w-3.5 text-status-good" />
              <span className="text-status-good">
                {langName(target)} pack available offline
              </span>
            </>
          ) : (
            <>
              <CloudOff className="h-3.5 w-3.5 text-status-warn" />
              <span className="text-status-warn">
                {langName(target)} pack needs internet — download when connected
              </span>
            </>
          )}
        </p>
      </div>
    </section>
  );
}
