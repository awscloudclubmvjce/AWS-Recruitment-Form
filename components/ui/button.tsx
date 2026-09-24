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
          "bg-[#ff9900] text-[#24242b] hover:-translate-y-0.5",
        variant === "ghost" &&
          "border border-[#24242b] bg-white text-[#24242b] hover:bg-[#fff1ae]",
        variant === "danger" &&
          "border border-[#e43d1f] bg-[#fff1ae] text-[#24242b] hover:bg-[#ffe5d8]",
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
        "animated-border group inline-flex min-h-14 items-center gap-3 bg-[#ff9900] px-7 py-4 text-base font-black uppercase text-[#24242b] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0",
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
