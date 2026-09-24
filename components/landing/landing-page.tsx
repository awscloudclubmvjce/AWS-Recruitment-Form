"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { RadioTower, Sparkles, Terminal, Zap, Users, Code2, Megaphone, Trophy } from "lucide-react";
import { recruitmentConfig } from "@/lib/config";
import { CtaLink } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

const benefits = ["Learn", "Build", "Collaborate", "Lead", "Network", "Experiment"];
const benefitIcons = [Zap, Code2, Users, Trophy, RadioTower, Sparkles];

const marqueeItems = [
  "AWS SBG CLUB", "RECRUITMENT 2026", "APPLY NOW", "BUILD THE FUTURE",
  "TECH & PR", "OPEN APPLICATIONS", "JOIN THE CREW", "ROUND 01",
  "AWS SBG CLUB", "RECRUITMENT 2026", "APPLY NOW", "BUILD THE FUTURE",
  "TECH & PR", "OPEN APPLICATIONS", "JOIN THE CREW", "ROUND 01",
];

const terminalWords = ["BUILD.", "CREATE.", "CONNECT.", "LEAD.", "SHIP.", "GROW."];

const timelineSteps = [
  { num: "01", label: "Apply", desc: "Fill out the form" },
  { num: "02", label: "Review", desc: "We go through your application" },
  { num: "03", label: "Interview", desc: "A quick chat with the team" },
  { num: "04", label: "Join", desc: "Welcome to the club" },
];

// Animated typewriter heading
function TypewriterHeading({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(timer);
        setDone(true);
      }
    }, 38);
    return () => clearInterval(timer);
  }, [text]);

  return (
    <span>
      {displayed}
      {!done && (
        <span
          style={{
            display: "inline-block",
            width: "0.08em",
            background: "#ff9900",
            marginLeft: "0.06em",
            verticalAlign: "baseline",
            animation: "typewriter-cursor 0.8s step-end infinite",
          }}
        >
          &nbsp;
        </span>
      )}
    </span>
  );
}

// Animated terminal card
function TerminalCard() {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex((i) => (i + 1) % terminalWords.length);
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      className="glass-line relative overflow-hidden"
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{ minHeight: 340 }}
    >
      {/* Gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(135deg, rgba(255,153,0,0.18) 0%, transparent 40%, rgba(255,255,255,0.04) 100%)",
          pointerEvents: "none",
        }}
      />
      {/* Animated scan line inside card */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          height: 2,
          background: "linear-gradient(90deg, transparent, rgba(255,153,0,0.5), transparent)",
          animation: "scan-line 3s linear infinite",
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "relative", padding: "2rem", display: "flex", flexDirection: "column", height: "100%", minHeight: 340, justifyContent: "space-between" }}>
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Terminal color="#ff9900" size={32} />
          <div style={{ display: "flex", gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(255,59,48,0.7)" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(255,204,0,0.7)" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(40,205,65,0.7)" }} />
          </div>
        </div>
        {/* Output */}
        <div>
          <p className="mono" style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.42)", marginBottom: "0.75rem", letterSpacing: "0.12em" }}>
            MISSION_OUTPUT ▶
          </p>
          <AnimatePresence mode="wait">
            <motion.p
              key={wordIndex}
              className="display"
              initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -22, filter: "blur(8px)" }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{ fontSize: "clamp(3rem,8vw,5rem)", color: "#ff9900", lineHeight: 1 }}
            >
              {terminalWords[wordIndex]}
            </motion.p>
          </AnimatePresence>
          <p className="mono" style={{ marginTop: "1rem", fontSize: "0.72rem", color: "rgba(255,255,255,0.35)" }}>
            {`> system.status: RECRUITING`}
            <br />
            {`> applications: OPEN`}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function LandingPage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  return (
    <main className="aws-workshop-theme" style={{ minHeight: "100vh", overflow: "hidden" }}>

      {/* ── Marquee Strip ── */}
      <div
        style={{
          borderBottom: "1px solid rgba(255,153,0,0.25)",
          background: "rgba(255,153,0,0.06)",
          padding: "10px 0",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div className="marquee-track">
          {marqueeItems.map((item, i) => (
            <span
              key={i}
              className="mono"
              style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.2em",
                color: i % 2 === 0 ? "#ff9900" : "rgba(255,255,255,0.45)",
                marginRight: "3.5rem",
                whiteSpace: "nowrap",
              }}
            >
              {item} {i % 2 === 0 ? "✦" : "·"}
            </span>
          ))}
        </div>
      </div>

      {/* ── Hero Section ── */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, y: heroY, position: "relative", minHeight: "92vh", display: "flex", alignItems: "center", padding: "3rem 5% 4rem" }}
      >
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: "absolute",
              width: i % 2 === 0 ? 4 : 6,
              height: i % 2 === 0 ? 4 : 6,
              borderRadius: "50%",
              background: i % 3 === 0 ? "#ff9900" : "rgba(255,255,255,0.3)",
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animation: `float-up ${3.5 + i * 0.7}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}

        <div className="mx-auto w-full max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-12 lg:items-end">
            {/* Left: Main text */}
            <div>
              <motion.p
                className="mono"
                style={{ fontSize: "0.75rem", fontWeight: 700, color: "#ff9900", marginBottom: "1.5rem", letterSpacing: "0.15em" }}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <span className="pulse-dot" style={{ marginRight: 8 }} />
                {recruitmentConfig.clubName.toUpperCase()} / RECRUITMENT {recruitmentConfig.year}
              </motion.p>

              <motion.h1
                className="display"
                style={{ fontSize: "clamp(4.5rem,14vw,12rem)", textTransform: "uppercase", lineHeight: 0.88, marginBottom: "2.5rem" }}
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <TypewriterHeading text="Ready to Build Something?" />
              </motion.h1>

              <motion.div
                style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22 }}
              >
                <CtaLink href="/apply">Start Application</CtaLink>
                <div className="mono grid grid-cols-1 sm:grid-cols-2 gap-y-1 gap-x-6 uppercase text-white/45 tracking-widest text-[0.7rem]">
                  <span>APPLICATION_STATUS: <span style={{ color: "#22c55e" }}>OPEN</span></span>
                  <span>ROUND_01</span>
                  <span>TECH x PR</span>
                  <span>SYSTEM: AWS SBG CLUB</span>
                </div>
              </motion.div>
            </div>

            {/* Right: Terminal Card */}
            <TerminalCard />
          </div>
        </div>
      </motion.section>

      {/* ── About Band ── */}
      <motion.section
        className="px-5 py-24 sm:px-8 lg:px-12 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#ff9900]/5 to-transparent pointer-events-none" />
        <div className="mx-auto max-w-7xl relative">
          <div className="glass-line p-8 md:p-16 border-l-4 border-l-[#ff9900] relative overflow-hidden group">
            {/* Background glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#ff9900]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            <div className="grid grid-cols-1 lg:grid-cols-[0.4fr_1.6fr] gap-8 md:gap-16 items-start relative z-10">
              <div>
                <p className="mono text-xs font-bold text-[#ff9900] tracking-[0.2em]">ABOUT</p>
                <div className="w-12 h-1 bg-[#ff9900] mt-4" />
              </div>
              <blockquote className="text-[clamp(1.5rem,4vw,3rem)] font-black uppercase leading-[1.1] tracking-tight">
                <span className="text-[#ff9900] opacity-50 mr-2">&ldquo;</span>
                {recruitmentConfig.description}
                <span className="text-[#ff9900] opacity-50 ml-2">&rdquo;</span>
              </blockquote>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── Timeline / Process ── */}
      <section style={{ padding: "6rem 5%" }}>
        <div style={{ margin: "0 auto", maxWidth: 1280 }}>
          <motion.div
            style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "3.5rem", gap: "1rem" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="display" style={{ fontSize: "clamp(3.5rem,9vw,7rem)", textTransform: "uppercase", lineHeight: 1 }}>
              The Process
            </h2>
            <p className="mono" style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.38)", letterSpacing: "0.12em" }}>RECRUITMENT_PIPELINE</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-0 relative">
            {/* Connecting line */}
            <div className="absolute hidden lg:block top-[2.2rem] left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-[#ff9900]/50 to-transparent z-0" />

            {timelineSteps.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "0 1rem", position: "relative", zIndex: 1 }}
              >
                {/* Circle */}
                <div style={{
                  width: 44, height: 44, borderRadius: "50%",
                  border: "2px solid #ff9900",
                  background: "#050505",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: "1.25rem",
                  boxShadow: "0 0 20px rgba(255,153,0,0.35)",
                }}>
                  <span className="mono" style={{ fontSize: "0.65rem", fontWeight: 700, color: "#ff9900" }}>{s.num}</span>
                </div>
                <p style={{ fontWeight: 900, fontSize: "1.15rem", textTransform: "uppercase", marginBottom: "0.35rem" }}>{s.label}</p>
                <p className="mono" style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.42)", letterSpacing: "0.06em" }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Domains ── */}
      <section style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: "6rem 5%" }}>
        <div style={{ margin: "0 auto", maxWidth: 1280 }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "2.5rem", gap: "1rem" }}>
            <h2 className="display" style={{ fontSize: "clamp(3.5rem,9vw,7rem)", textTransform: "uppercase", lineHeight: 1 }}>Domains</h2>
            <RadioTower color="#ff9900" size={40} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {recruitmentConfig.domains.map((domain, i) => (
              <motion.article
                key={domain.value}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.22 } }}
                className="domain-card-wrap glass-line"
                style={{ padding: "2.5rem", cursor: "default", position: "relative", overflow: "hidden" }}
              >
                {/* Glow on hover via motion */}
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(135deg, rgba(255,153,0,0.08) 0%, transparent 60%)",
                  pointerEvents: "none",
                }} />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4rem" }}>
                  {domain.value === "TECH" ? <Code2 color="white" size={32} /> : <Megaphone color="white" size={32} />}
                  <span className="mono" style={{ fontSize: "0.7rem", fontWeight: 700, color: "#ff9900", letterSpacing: "0.18em", border: "1px solid rgba(255,153,0,0.4)", padding: "0.25rem 0.75rem" }}>
                    {domain.value}
                  </span>
                </div>
                <h3 style={{ fontSize: "2.5rem", fontWeight: 900, textTransform: "uppercase", marginBottom: "0.5rem" }}>{domain.title}</h3>
                <p className="mono" style={{ fontSize: "0.75rem", fontWeight: 700, color: "#ff9900", marginBottom: "1.25rem", letterSpacing: "0.1em" }}>
                  {domain.tagline}
                </p>
                <p style={{ fontSize: "1rem", lineHeight: 1.75, color: "rgba(255,255,255,0.65)", maxWidth: 520 }}>
                  {domain.description}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Join ── */}
      <section style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: "6rem 5%" }}>
        <div style={{ margin: "0 auto", maxWidth: 1280 }}>
          <motion.h2
            className="display"
            style={{ fontSize: "clamp(3.5rem,9vw,7rem)", textTransform: "uppercase", lineHeight: 1, marginBottom: "3rem" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Why Join
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefits.map((benefit, index) => {
              const Icon = benefitIcons[index];
              const gradients = [
                "linear-gradient(135deg, rgba(255,153,0,0.15) 0%, transparent 70%)",
                "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 70%)",
                "linear-gradient(135deg, rgba(255,153,0,0.1) 0%, transparent 70%)",
                "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 70%)",
                "linear-gradient(135deg, rgba(255,153,0,0.12) 0%, transparent 70%)",
                "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 70%)",
              ];
              return (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.07 }}
                  whileHover={{ scale: 1.03, transition: { duration: 0.18 } }}
                  style={{
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: gradients[index],
                    padding: "2rem",
                    position: "relative",
                    overflow: "hidden",
                    cursor: "default",
                  }}
                >
                  <span
                    className="display"
                    style={{
                      position: "absolute", top: "0.75rem", right: "1rem",
                      fontSize: "5rem", lineHeight: 1,
                      color: "rgba(255,153,0,0.07)",
                      userSelect: "none",
                    }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <Icon color="#ff9900" size={24} style={{ marginBottom: "1.5rem" }} />
                  <p style={{ fontSize: "1.4rem", fontWeight: 900, textTransform: "uppercase" }}>{benefit}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section style={{ padding: "6rem 5% 8rem" }}>
        <div style={{ margin: "0 auto", maxWidth: 1280, position: "relative" }}>
          {/* Glow bar */}
          <div style={{ width: "100%", height: 1, background: "linear-gradient(90deg, transparent, #ff9900, transparent)", marginBottom: "5rem" }} />

          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <motion.h2
              className="display"
              style={{ fontSize: "clamp(5rem,18vw,14rem)", textTransform: "uppercase", lineHeight: 0.85 }}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Your{" "}
              <span className="stroke-text">Turn.</span>
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <CtaLink href="/apply">Apply Now</CtaLink>
            </motion.div>
          </div>
        </div>
      </section>

    </main>
  );
}
