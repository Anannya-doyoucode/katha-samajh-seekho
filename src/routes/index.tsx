import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrandMark } from "@/components/katha/Shell";
import { useKatha } from "@/lib/katha-store";
import { LANGUAGES } from "@/lib/katha-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KATHA — Teach in the child's mother tongue" },
      {
        name: "description",
        content:
          "KATHA translates a teacher's lesson into the child's mother tongue, explains the concept in local context, checks understanding and re-teaches differently when a child struggles.",
      },
      { property: "og:title", content: "KATHA — Learn in the language that feels like home" },
      {
        property: "og:description",
        content:
          "AI-assisted vernacular teaching for Indian government primary schools. English, Hindi, Santhali, Ho and Mundari.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useKatha();
  const navigate = useNavigate();
  const [name, setName] = useState("Sunita Devi");
  const [code, setCode] = useState("JH-PS-2291");

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      <section className="flex flex-col justify-between bg-primary px-6 py-10 text-primary-foreground md:px-12 md:py-14">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary-foreground font-serif text-base font-bold text-primary">
            क
          </span>
          <span className="font-serif text-xl font-bold tracking-tight">KATHA</span>
        </div>

        <div className="max-w-xl py-12">
          <h1 className="font-serif text-3xl leading-snug font-bold md:text-4xl">
            Learn in the language that feels like home.
          </h1>
          <p className="mt-4 text-sm leading-relaxed opacity-90 md:text-base">
            KATHA does not just translate the lesson. It teaches the concept in the child's language
            and context, checks whether the child understood, and explains it differently when the
            child struggles.
          </p>

          <ol className="mt-8 space-y-2 text-sm opacity-90">
            {[
              "Teacher speaks — in any of five languages",
              "Speech is transcribed and translated to the child's mother tongue",
              "KATHA re-teaches it with familiar local examples",
              "Understanding is checked with short questions",
              "Weak concepts are explained again, differently",
            ].map((step, i) => (
              <li key={step} className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-primary-foreground/40 text-[11px]">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          {LANGUAGES.map((l) => (
            <span key={l.code} className="rounded-full border border-primary-foreground/30 px-2.5 py-1">
              {l.native}
            </span>
          ))}
        </div>
      </section>

      <section className="flex items-center justify-center px-6 py-12">
        <form
          className="w-full max-w-sm"
          onSubmit={(e) => {
            e.preventDefault();
            login(name.trim() || "Teacher");
            navigate({ to: "/dashboard" });
          }}
        >
          <div className="mb-8 lg:hidden">
            <BrandMark />
          </div>
          <p className="label-caps mb-1">Teacher sign in</p>
          <h2 className="text-xl font-bold">Government Primary School</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Use your school-issued teacher code. Works offline once signed in.
          </p>

          <div className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Teacher name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="code">School / teacher code</Label>
              <Input id="code" value={code} onChange={(e) => setCode(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full">
              Sign in
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Prototype — any name and code will sign you in.
            </p>
          </div>
        </form>
      </section>
    </div>
  );
}
