"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { recruitmentConfig } from "@/lib/config";

interface NavbarProps {
  showApplyButton?: boolean;
}

export function Navbar({ showApplyButton = true }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-black/70 border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo Link */}
        <Link href="/" className="flex items-center gap-3 group transition-transform active:scale-95">
          <div className="relative flex items-center justify-center p-2 rounded-xl bg-white/5 border border-white/10 group-hover:border-[#ff9900]/50 group-hover:bg-[#ff9900]/10 transition-all duration-300">
            <img
              src="/logo-dark.png"
              alt="AWS x Student Builder Group Logo"
              className="h-8 sm:h-10 w-auto object-contain transition-all duration-300 drop-shadow-[0_0_12px_rgba(255,153,0,0.3)] group-hover:drop-shadow-[0_0_20px_rgba(255,153,0,0.6)]"
            />
          </div>
        </Link>

        {/* Right Action Items */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>RECRUITMENT 2026</span>
          </div>

          {showApplyButton && (
            <Link
              href="/apply"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#ff9900] to-[#ffb84d] text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_18px_rgba(255,153,0,0.3)] hover:shadow-[0_0_30px_rgba(255,153,0,0.6)] hover:scale-105 transition-all transform active:scale-95"
            >
              <span>Apply Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
