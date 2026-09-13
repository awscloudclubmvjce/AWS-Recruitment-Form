import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "animated-border inline-flex min-h-12 items-center justify-center gap-2 px-5 py-3 text-sm font-black uppercase tracking-wide transition-all duration-200 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" &&
          "bg-[#ff9900] text-black hover:shadow-[0_0_40px_rgba(255,153,0,0.45)] hover:brightness-110",
        variant === "ghost" &&
          "border border-white/20 bg-white/5 text-white hover:border-[#ff9900] hover:text-[#ff9900] hover:bg-[rgba(255,153,0,0.07)]",
        variant === "danger" &&
          "border border-red-500/50 bg-red-500/10 text-red-100 hover:bg-red-500/20",
        className,
      )}
      {...props}
    />
  );
}

export function CtaLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "animated-border group inline-flex min-h-14 items-center gap-3 bg-[#ff9900] px-7 py-4 text-base font-black uppercase text-black transition-all duration-200 hover:shadow-[0_0_48px_rgba(255,153,0,0.5)] hover:brightness-110 active:scale-[0.98]",
        className,
      )}
    >
      {children}
      <ArrowRight
        aria-hidden="true"
        size={20}
        className="transition-transform duration-200 group-hover:translate-x-1"
      />
    </Link>
  );
}
