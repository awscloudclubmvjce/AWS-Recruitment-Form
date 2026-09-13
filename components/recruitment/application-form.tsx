"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Loader2, Plus, Trash2, ExternalLink } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import confetti from "canvas-confetti";
import { recruitmentConfig } from "@/lib/config";
import { applicationSchema, type ApplicationInput } from "@/lib/validations/application";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const steps = ["YOU", "DOMAIN", "WORK", "IDEAS", "EXPECTATIONS", "DONE"];

type FormState = {
  name: string;
  department: string;
  phone: string;
  email: string;
  domain: "" | "TECH" | "PR";
  workLinks: string[];
  improvementIdea: string;
  expectations: string;
};

const initialState: FormState = {
  name: "",
  department: "",
  phone: "",
  email: "",
  domain: "",
  workLinks: [""],
  improvementIdea: "",
  expectations: "",
};

type Errors = Partial<Record<keyof FormState | `workLinks.${number}` | "root", string>>;

function stepSchema(step: number) {
  if (step === 0) {
    return applicationSchema.pick({
      name: true,
      department: true,
      phone: true,
      email: true,
    });
  }
  if (step === 1) return applicationSchema.pick({ domain: true });
  if (step === 2) return applicationSchema.pick({ workLinks: true });
  if (step === 3) return applicationSchema.pick({ improvementIdea: true });
  if (step === 4) return applicationSchema.pick({ expectations: true });
  return applicationSchema;
}

function errorsFromZod(error: z.ZodError): Errors {
  const next: Errors = {};
  for (const issue of error.issues) {
    const path = issue.path.join(".");
    next[path as keyof Errors] = issue.message;
  }
  return next;
}

// ── Floating Label Input ──
function FloatInput({
  label,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  return (
    <div style={{ display: "grid", gap: "0.35rem" }}>
      <div className="float-label-wrap">
        <input
          className="focus-field"
          style={{ minHeight: 56, width: "100%", padding: "1.4rem 1rem 0.5rem", fontSize: "1rem", color: "white" }}
          placeholder=" "
          {...props}
        />
        <span className="float-label">{label}</span>
      </div>
      {error && (
        <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#ffb84d" }} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

// ── Word Count Ring ──
function WordCountRing({ current, max }: { current: number; max: number }) {
  const pct = Math.min(current / max, 1);
  const r = 18;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);
  const color = pct > 0.9 ? "#ff4444" : pct > 0.7 ? "#ffb84d" : "#ff9900";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "flex-end", marginTop: "0.5rem" }}>
      <svg width={44} height={44} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={22} cy={22} r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={3} />
        <circle
          cx={22} cy={22} r={r} fill="none"
          stroke={color} strokeWidth={3}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 200ms ease, stroke 200ms ease" }}
        />
      </svg>
      <span className="mono" style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.45)" }}>
        {current}/{max}
      </span>
    </div>
  );
}

// ── Confetti Success ──
function SuccessScreen({ socialUrl }: { socialUrl?: string }) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    // First burst
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.55 },
      colors: ["#ff9900", "#ffb84d", "#ffffff", "#ffd28a", "#ff6600"],
      scalar: 1.2,
    });

    // Second burst with different angle
    setTimeout(() => {
      confetti({
        particleCount: 80,
        angle: 60,
        spread: 70,
        origin: { x: 0, y: 0.6 },
        colors: ["#ff9900", "#ffffff", "#ffb84d"],
      });
      confetti({
        particleCount: 80,
        angle: 120,
        spread: 70,
        origin: { x: 1, y: 0.6 },
        colors: ["#ff9900", "#ffffff", "#ffb84d"],
      });
    }, 300);

    // Rain burst
    setTimeout(() => {
      confetti({
        particleCount: 200,
        spread: 120,
        origin: { y: 0.2 },
        gravity: 1.4,
        colors: ["#ff9900", "#ffb84d", "#ffd28a"],
        scalar: 0.8,
      });
    }, 700);
  }, []);

  return (
    <main style={{ display: "flex", minHeight: "100vh", alignItems: "center", padding: "3rem 5%" }}>
      <motion.section
        style={{ margin: "0 auto", maxWidth: 900 }}
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Animated Checkmark */}
        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 14 }}
          style={{
            width: 72, height: 72,
            background: "#ff9900",
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: "2.5rem",
            boxShadow: "0 0 48px rgba(255,153,0,0.55)",
          }}
        >
          <svg width={36} height={36} viewBox="0 0 36 36" fill="none">
            <motion.path
              d="M8 18L15 25L28 11"
              stroke="black" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
            />
          </svg>
        </motion.div>

        <motion.h1
          className="display"
          style={{ fontSize: "clamp(4rem,15vw,11rem)", textTransform: "uppercase", lineHeight: 0.85, marginBottom: "1.5rem" }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Application
          <br />
          <span className="shimmer-text">Submitted.</span>
          <br />
          <span style={{ color: "#ff9900" }}>Now Let&apos;s Build.</span>
        </motion.h1>

        <motion.p
          style={{ fontSize: "1.15rem", color: "rgba(255,255,255,0.65)", maxWidth: 560, marginBottom: "2.5rem", lineHeight: 1.75 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
        >
          Thanks for applying to the {recruitmentConfig.clubName}. We&apos;ll review your application and be in touch soon.
        </motion.p>

        {socialUrl && (
          <motion.a
            href={socialUrl}
            target="_blank"
            rel="noreferrer noopener"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.75rem",
              background: "#ff9900",
              color: "black",
              padding: "1rem 2rem",
              fontWeight: 900,
              textTransform: "uppercase",
              fontSize: "0.95rem",
              letterSpacing: "0.08em",
              textDecoration: "none",
            }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.03 }}
          >
            Follow {recruitmentConfig.clubName} <ExternalLink size={18} />
          </motion.a>
        )}
      </motion.section>
    </main>
  );
}

export function ApplicationForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  
  
  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined, root: undefined }));
  }

  function validateCurrent() {
    const result = stepSchema(step).safeParse(form);
    if (!result.success) {
      setErrors(errorsFromZod(result.error));
      return false;
    }
    setErrors({});
    return true;
  }

  function next() {
    if (!validateCurrent()) return;
    setStep((current) => Math.min(current + 1, steps.length - 1));
  }

  function back() {
    setErrors({});
    setStep((current) => Math.max(current - 1, 0));
  }

  async function submit() {
    const parsed = applicationSchema.safeParse(form);
    if (!parsed.success) {
      setErrors(errorsFromZod(parsed.error));
      return;
    }
    setSubmitting(true);
    setErrors({});
    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data satisfies ApplicationInput),
      });
      const body = (await response.json()) as { error?: string };
      if (!response.ok) {
        setErrors({ root: body.error || "We could not submit right now." });
        return;
      }
      setSubmitted(true);
    } catch {
      setErrors({ root: "Network error. Check your connection and try again." });
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return <SuccessScreen socialUrl={recruitmentConfig.socialUrl} />;
  }

  return (
    <main style={{ minHeight: "100vh", padding: "1.5rem 5%" }}>
      <section className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-[0.42fr_0.58fr] gap-6">

        {/* ── Sidebar ── */}
        <aside style={{ position: "sticky", top: "1.5rem", height: "calc(100vh - 3rem)" }}>
          <div
            className="glass-line"
            style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "2rem" }}
          >
            <div>
              <p className="mono" style={{ fontSize: "0.68rem", fontWeight: 700, color: "#ff9900", letterSpacing: "0.18em" }}>
                {recruitmentConfig.clubName.toUpperCase()} / APPLY_{recruitmentConfig.year}
              </p>
              <h1
                className="display"
                style={{ marginTop: "1.25rem", fontSize: "clamp(3.5rem,6vw,5.5rem)", textTransform: "uppercase", lineHeight: 0.88 }}
              >
                Join The
                <br />
                <span className="shimmer-text">Build.</span>
              </h1>
            </div>

            <div>
              {/* Segmented progress */}
              <div className="seg-progress" style={{ marginBottom: "1.25rem" }}>
                {steps.map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "seg-progress-item",
                      i < step && "done",
                      i === step && "active",
                    )}
                  />
                ))}
              </div>

              {/* Step list */}
              <ol style={{ display: "grid", gap: "0.5rem" }}>
                {steps.map((label, index) => (
                  <li
                    key={label}
                    className="mono"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      border: `1px solid ${index === step ? "#ff9900" : "rgba(255,255,255,0.1)"}`,
                      padding: "0.6rem 0.85rem",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      color: index === step ? "#ff9900" : index < step ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.28)",
                      letterSpacing: "0.1em",
                      background: index === step ? "rgba(255,153,0,0.07)" : "transparent",
                      transition: "all 250ms ease",
                    }}
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <span>{label}</span>
                    {index < step && <Check size={12} color="#ff9900" />}
                  </li>
                ))}
              </ol>

              <div style={{ marginTop: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span className="pulse-dot" />
                <span className="mono" style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em" }}>
                  ~4 MIN TO COMPLETE
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* ── Form Panel ── */}
        <section
          className="glass-line"
          style={{ minHeight: "calc(100vh - 3rem)", padding: "2.5rem" }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 32, filter: "blur(4px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: -32, filter: "blur(4px)" }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: "flex", minHeight: "calc(100vh - 7rem)", flexDirection: "column" }}
            >
              <div style={{ flex: 1 }}>{renderStep()}</div>

              {errors.root && (
                <p style={{ marginTop: "1.5rem", border: "1px solid rgba(255,153,0,0.35)", background: "rgba(255,153,0,0.1)", padding: "1rem", fontSize: "0.875rem", fontWeight: 600, color: "#ffd28a" }}>
                  {errors.root}
                </p>
              )}

              <div style={{ marginTop: "2rem", display: "flex", flexDirection: "row", justifyContent: "space-between", gap: "0.75rem" }}>
                <Button variant="ghost" onClick={back} disabled={step === 0 || submitting}>
                  <ArrowLeft size={18} />
                  Go Back
                </Button>
                {step < steps.length - 1 ? (
                  <Button onClick={next}>
                    Next
                    <ArrowRight size={18} />
                  </Button>
                ) : (
                  <Button onClick={submit} disabled={submitting}>
                    {submitting ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
                    Submit Application
                  </Button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </section>
      </section>
    </main>
  );

  function renderStep() {
    if (step === 0) {
      return (
        <div>
          <StepHeading kicker="01 — YOU" title="Tell Us Who You Are." />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FloatInput label="Full Name" error={errors.name} value={form.name} onChange={(e) => update("name", e.target.value)} />
            <FloatInput label="Department" error={errors.department} value={form.department} onChange={(e) => update("department", e.target.value)} />
            <FloatInput label="Phone Number" error={errors.phone} value={form.phone} onChange={(e) => update("phone", e.target.value)} inputMode="tel" />
            <FloatInput label="Email" error={errors.email} value={form.email} onChange={(e) => update("email", e.target.value)} inputMode="email" />
          </div>
        </div>
      );
    }

    if (step === 1) {
      return (
        <div>
          <StepHeading kicker="02 — DOMAIN" title="Where Do You Belong?" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {recruitmentConfig.domains.map((domain) => {
              const selected = form.domain === domain.value;
              return (
                <motion.button
                  key={domain.value}
                  type="button"
                  onClick={() => update("domain", domain.value)}
                  whileHover={{ y: -6 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    minHeight: 280,
                    border: selected ? "2px solid #ff9900" : "1px solid rgba(255,255,255,0.12)",
                    background: selected
                      ? "linear-gradient(135deg, rgba(255,153,0,0.18) 0%, rgba(255,153,0,0.06) 100%)"
                      : "rgba(255,255,255,0.03)",
                    padding: "1.75rem",
                    textAlign: "left",
                    position: "relative",
                    overflow: "hidden",
                    cursor: "pointer",
                    boxShadow: selected ? "0 0 48px rgba(255,153,0,0.22), inset 0 0 32px rgba(255,153,0,0.06)" : "none",
                    transition: "border 200ms ease, background 200ms ease, box-shadow 200ms ease",
                  }}
                >
                  {/* Scan line */}
                  {selected && (
                    <motion.div
                      style={{
                        position: "absolute", left: 0, right: 0,
                        height: 2,
                        background: "linear-gradient(90deg, transparent, rgba(255,153,0,0.6), transparent)",
                        top: 0,
                      }}
                      animate={{ top: ["0%", "100%", "0%"] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                    />
                  )}

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "3.5rem" }}>
                    <span className="mono" style={{ fontSize: "0.7rem", fontWeight: 700, color: "#ff9900", letterSpacing: "0.15em", border: "1px solid rgba(255,153,0,0.4)", padding: "0.2rem 0.6rem" }}>
                      {domain.value}
                    </span>
                    <AnimatePresence>
                      {selected && (
                        <motion.div
                          initial={{ scale: 0, rotate: -30 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0 }}
                          style={{
                            width: 28, height: 28, borderRadius: "50%",
                            background: "#ff9900",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}
                        >
                          <Check size={14} color="black" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <h2 style={{ fontSize: "2rem", fontWeight: 900, textTransform: "uppercase", marginBottom: "0.4rem" }}>{domain.title}</h2>
                  <p className="mono" style={{ fontSize: "0.72rem", color: "#ff9900", marginBottom: "0.85rem", letterSpacing: "0.08em" }}>{domain.tagline}</p>
                  <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.65 }}>{domain.description}</p>
                </motion.button>
              );
            })}
          </div>
          {errors.domain && <p style={{ marginTop: "1rem", fontSize: "0.8rem", fontWeight: 600, color: "#ffb84d" }}>{errors.domain}</p>}
        </div>
      );
    }

    if (step === 2) {
      return (
        <div>
          <StepHeading
            kicker="03 — WORK"
            title="Show. Don't Tell."
            copy="Got something you've built, designed, written, organized or worked on? Show us."
          />
          <div style={{ display: "grid", gap: "1rem" }}>
            {form.workLinks.map((link, index) => (
              <div key={index} style={{ display: "grid", gap: "0.5rem", gridTemplateColumns: "1fr auto", alignItems: "start" }}>
                <div style={{ display: "grid", gap: "0.35rem" }}>
                  <div className="float-label-wrap">
                    <input
                      className="focus-field"
                      style={{ minHeight: 52, width: "100%", padding: "1.25rem 1rem 0.4rem", fontSize: "1rem", color: "white" }}
                      value={link}
                      placeholder=" "
                      onChange={(e) => {
                        const next = [...form.workLinks];
                        next[index] = e.target.value;
                        update("workLinks", next);
                      }}
                      inputMode="url"
                    />
                    <span className="float-label">Work Link {index + 1}</span>
                  </div>
                  {/* URL preview pill */}
                  {link && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: "0.4rem",
                        background: "rgba(255,153,0,0.1)", border: "1px solid rgba(255,153,0,0.3)",
                        padding: "0.25rem 0.75rem", fontSize: "0.7rem", fontFamily: "JetBrains Mono, monospace",
                        color: "#ffb84d", maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      }}
                    >
                      <ExternalLink size={10} />
                      {link}
                    </motion.div>
                  )}
                  {errors[`workLinks.${index}`] && (
                    <span style={{ fontSize: "0.8rem", color: "#ffb84d" }}>{errors[`workLinks.${index}`]}</span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  style={{ marginTop: 0, alignSelf: "start" }}
                  onClick={() =>
                    update("workLinks", form.workLinks.filter((_, i) => i !== index).length
                      ? form.workLinks.filter((_, i) => i !== index)
                      : [""])
                  }
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}
            <Button variant="ghost" onClick={() => update("workLinks", [...form.workLinks, ""])}>
              <Plus size={16} />
              Add Another Link
            </Button>
          </div>
        </div>
      );
    }

    if (step === 3) {
      return (
        <EssayStep
          kicker="04 — IDEAS"
          title="Make The Club Better."
          question="What would you do to make this club better?"
          value={form.improvementIdea}
          error={errors.improvementIdea}
          onChange={(v) => update("improvementIdea", v)}
        />
      );
    }

    if (step === 4) {
      return (
        <EssayStep
          kicker="05 — EXPECTATIONS"
          title="What Do You Expect?"
          question={`What do you expect from the ${recruitmentConfig.clubName}?`}
          value={form.expectations}
          error={errors.expectations}
          onChange={(v) => update("expectations", v)}
        />
      );
    }

    // Step 5 — Review
    return (
      <div>
        <StepHeading kicker="06 — DONE" title="Review The Signal." />
        <div style={{ display: "grid", gap: "0.75rem" }}>
          {([
            ["Name", form.name],
            ["Department", form.department],
            ["Email", form.email],
            ["Phone", form.phone],
            ["Domain", form.domain],
            ["Work Links", form.workLinks.filter(Boolean).join("\n")],
            ["Club Improvement", form.improvementIdea],
            ["Expectations", form.expectations],
          ] as [string, string][]).map(([label, value], i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              style={{
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.03)",
                padding: "1rem 1.25rem",
                borderLeft: "3px solid #ff9900",
              }}
            >
              <p className="mono" style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", color: "#ff9900", letterSpacing: "0.12em", marginBottom: "0.4rem" }}>
                {label}
              </p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.7, color: "rgba(255,255,255,0.82)", whiteSpace: "pre-wrap" }}>
                {value || "—"}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }
}

function StepHeading({ kicker, title, copy }: { kicker: string; title: string; copy?: string }) {
  return (
    <header style={{ marginBottom: "2.5rem" }}>
      <p className="mono" style={{ fontSize: "0.7rem", fontWeight: 700, color: "#ff9900", letterSpacing: "0.18em" }}>{kicker}</p>
      <h2
        className="display"
        style={{ marginTop: "0.75rem", fontSize: "clamp(2.8rem,6vw,5rem)", textTransform: "uppercase", lineHeight: 0.9 }}
      >
        {title}
      </h2>
      {copy && (
        <p style={{ marginTop: "1rem", maxWidth: 560, fontSize: "1rem", lineHeight: 1.7, color: "rgba(255,255,255,0.58)" }}>
          {copy}
        </p>
      )}
    </header>
  );
}

function EssayStep({
  kicker, title, question, value, error, onChange,
}: {
  kicker: string;
  title: string;
  question: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  const MAX = 1000;
  return (
    <div>
      <StepHeading kicker={kicker} title={title} />
      <div style={{ display: "grid", gap: "0.4rem" }}>
        <p className="mono" style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", color: "rgba(255,255,255,0.5)", letterSpacing: "0.08em" }}>
          {question}
        </p>
        <div className="float-label-wrap">
          <textarea
            className="focus-field"
            style={{ minHeight: 220, width: "100%", resize: "vertical", padding: "1rem", fontSize: "1rem", lineHeight: 1.75, color: "white" }}
            value={value}
            maxLength={MAX}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Write like a person. Specific beats perfect."
          />
        </div>
        {error && <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#ffb84d" }} role="alert">{error}</span>}
        <WordCountRing current={value.length} max={MAX} />
      </div>
    </div>
  );
}
