"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { recruitmentConfig } from "@/lib/config";

interface NavbarProps { showApplyButton?: boolean; }

export function Navbar({ showApplyButton = true }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#24242b] bg-[#f4f1ec]/95 backdrop-blur-md">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <Link href="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="AWS x Student Builder Group Logo" className="h-11 sm:h-12 w-auto object-contain" />
        </Link>
        <div className="flex items-center gap-3 sm:gap-5">
          <div className="hidden md:flex items-center gap-2 border border-[#24242b] bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-[.15em]">
            <span className="pulse-dot" />
            <span>Recruitment {recruitmentConfig.year}</span>
          </div>
          {showApplyButton && (
            <Link href="/apply" className="animated-border inline-flex items-center gap-2 bg-[#ff9900] px-5 py-3 text-xs font-black uppercase tracking-wider text-[#24242b] transition-transform hover:-translate-y-0.5 active:translate-y-0">
              <span>Apply Now</span><ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
