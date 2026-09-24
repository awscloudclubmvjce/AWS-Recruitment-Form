"use client";

import { motion, AnimatePresence } from "framer-motion";
import { RadioTower, Sparkles, Users, Code2, Megaphone, Trophy, ArrowUpRight } from "lucide-react";
import { recruitmentConfig } from "@/lib/config";
import { CtaLink } from "@/components/ui/button";
import { useEffect, useState } from "react";

const benefits = ["Learn", "Build", "Collaborate", "Lead", "Network", "Experiment"];
const benefitIcons = [Sparkles, Code2, Users, Trophy, RadioTower, Megaphone];
const ticker = [
  "AWS SBG CLUB", "RECRUITMENT 2026", "BUILD WITH AWS", "TECH × PR",
  "AWS SBG CLUB", "RECRUITMENT 2026", "BUILD WITH AWS", "TECH × PR",
];
const terminalWords = ["BUILD.", "CREATE.", "CONNECT.", "LEAD."];

function TerminalCard() {
  const [wordIndex, setWordIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setWordIndex((i) => (i + 1) % terminalWords.length), 1800);
    return () => clearInterval(t);
  }, []);
  return (
    <motion.div className="relative border border-[#24242b] bg-[#24242b] p-6 text-white shadow-[8px_8px_0_#e43d1f]" initial={{ opacity:0,y:24 }} animate={{ opacity:1,y:0 }} transition={{ duration:.5 }}>
      <div className="mb-12 flex items-center justify-between">
        <span className="mono text-xs font-bold uppercase tracking-[.16em] text-[#ff9900]">SYSTEM / AWS SBG</span>
        <span className="mono border border-[#ff9900] px-2 py-1 text-[10px] text-[#ff9900]">LIVE</span>
      </div>
      <p className="mono mb-3 text-[10px] uppercase tracking-[.16em] text-white/45">MISSION_OUTPUT ▶</p>
      <AnimatePresence mode="wait">
        <motion.p key={wordIndex} className="display text-[#ff9900]" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-14}} style={{fontSize:"clamp(3.5rem,8vw,6rem)"}}>{terminalWords[wordIndex]}</motion.p>
      </AnimatePresence>
      <div className="mt-10 grid gap-2 border-t border-white/15 pt-4 mono text-[10px] uppercase tracking-[.1em] text-white/55">
        <span>&gt; club.status: RECRUITING</span><span>&gt; applications: OPEN</span>
      </div>
    </motion.div>
  );
}

export function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden">
      <div className="border-b border-[#24242b] bg-[#24242b] py-2.5 overflow-hidden">
        <div className="marquee-track">{ticker.map((item,i)=><span key={i} className="mono mr-12 whitespace-nowrap text-[10px] font-bold uppercase tracking-[.18em] text-white">{item} <span className="text-[#ff9900]">✦</span></span>)}</div>
      </div>

      <section className="px-5 pb-16 pt-14 sm:px-8 lg:px-12 lg:pb-24 lg:pt-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.12fr_.88fr] lg:items-end">
          <div>
            <p className="mono mb-5 flex items-center gap-2 text-[10px] font-black uppercase tracking-[.18em] text-[#e43d1f]">
              <span className="pulse-dot" />{recruitmentConfig.clubName} / Recruitment {recruitmentConfig.year}
            </p>
            <div className="mb-7 inline-block border border-[#24242b] bg-white px-3 py-2 text-[10px] font-black uppercase tracking-[.18em] shadow-[4px_4px_0_rgba(36,36,43,.16)]">AWS STUDENT BUILDER GROUP</div>
            <h1 className="display max-w-5xl text-[clamp(4.4rem,13vw,10rem)] uppercase text-[#24242b]">
              Ready to <span className="block text-[#e43d1f]">Build Something?</span>
            </h1>
            <p className="mt-8 max-w-2xl text-base font-semibold leading-7 text-[#5d5b57] sm:text-lg">{recruitmentConfig.description}</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <CtaLink href="/apply">Start Application</CtaLink>
              <div className="mono grid grid-cols-1 gap-1 text-[10px] font-bold uppercase tracking-[.12em] text-[#5d5b57] sm:grid-cols-2 sm:gap-x-8">
                <span>APPLICATION_STATUS: <b className="text-[#22c55e]">OPEN</b></span><span>ROUND_01</span><span>TECH × PR</span><span>SYSTEM: AWS SBG CLUB</span>
              </div>
            </div>
          </div>
          <TerminalCard />
        </div>
      </section>

      <section className="px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl border-y-2 border-[#24242b] py-9">
          <div className="grid gap-8 lg:grid-cols-[.35fr_1.65fr] lg:items-start">
            <div><p className="mono text-[10px] font-black uppercase tracking-[.2em] text-[#e43d1f]">ABOUT</p><div className="mt-3 h-1 w-12 bg-[#ff9900]" /></div>
            <p className="max-w-5xl text-[clamp(1.5rem,3.6vw,3rem)] font-black uppercase leading-[1.05] tracking-tight">{recruitmentConfig.description}</p>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-end justify-between gap-4"><h2 className="display text-[clamp(3.6rem,8vw,7rem)] uppercase">The Process</h2><span className="mono hidden border border-[#24242b] bg-[#fff1ae] px-2 py-1 text-[10px] font-bold uppercase tracking-[.14em] sm:block">Recruitment Pipeline</span></div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[["01","Apply","Fill out the form"],["02","Review","We go through your application"],["03","Interview","A quick chat with the team"],["04","Join","Welcome to the club"]].map(([num,label,desc])=>(
              <motion.article key={num} className="border border-[#24242b] bg-white p-6 shadow-[6px_6px_0_rgba(36,36,43,.10)]" initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}}>
                <p className="mono text-xs font-black text-[#e43d1f]">{num}</p><div className="my-8 h-1 w-10 bg-[#ff9900]" /><h3 className="text-2xl font-black uppercase">{label}</h3><p className="mono mt-2 text-[10px] leading-5 text-[#5d5b57]">{desc}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#24242b] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-end justify-between gap-4"><h2 className="display text-[clamp(3.6rem,8vw,7rem)] uppercase">Domains</h2><ArrowUpRight className="text-[#e43d1f]" size={36}/></div>
          <div className="grid gap-6 lg:grid-cols-2">
            {recruitmentConfig.domains.map((domain,i)=>(
              <motion.article key={domain.value} className="group border border-[#24242b] bg-white p-7 shadow-[7px_7px_0_rgba(36,36,43,.1)] transition-transform duration-150 hover:-translate-y-1" initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.08}}>
                <div className="flex items-center justify-between">{domain.value==="TECH"?<Code2 size={28}/>:<Megaphone size={28}/>}<span className="mono border border-[#e43d1f] px-2 py-1 text-[10px] font-black tracking-[.16em] text-[#e43d1f]">{domain.value}</span></div>
                <div className="mt-16"><h3 className="text-[2.2rem] font-black uppercase leading-none">{domain.title}</h3><p className="mono mt-2 text-xs font-bold tracking-[.1em] text-[#e43d1f]">{domain.tagline}</p><p className="mt-4 max-w-xl text-sm leading-6 text-[#5d5b57]">{domain.description}</p></div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#24242b] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <h2 className="display mb-10 text-[clamp(3.6rem,8vw,7rem)] uppercase">Why Join</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit,index)=>{const Icon=benefitIcons[index];return <motion.div key={benefit} className="relative overflow-hidden border border-[#24242b] bg-white p-6 shadow-[5px_5px_0_rgba(36,36,43,.09)]" whileHover={{y:-4}} initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}}>
              <span className="display absolute right-3 top-2 text-7xl text-[#e43d1f]/10">{String(index+1).padStart(2,"0")}</span><Icon className="mb-8 text-[#e43d1f]" size={24}/><p className="text-xl font-black uppercase">{benefit}</p>
            </motion.div>})}
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 pt-16 sm:px-8 lg:px-12 lg:pb-28 lg:pt-24">
        <div className="mx-auto max-w-7xl border-t-2 border-[#24242b] pt-12">
          <h2 className="display text-[clamp(4.8rem,15vw,12rem)] uppercase">Your <span className="text-[#e43d1f]">Turn.</span></h2>
          <div className="mt-8"><CtaLink href="/apply">Apply Now</CtaLink></div>
        </div>
      </section>
    </main>
  );
}
