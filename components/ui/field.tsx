import { cn } from "@/lib/utils";

type FieldProps = {
  label: string;
  error?: string;
  children: React.ReactNode;
};

export function Field({ label, error, children }: FieldProps) {
  return (
    <label className="grid gap-2">
      <span className="mono text-xs font-bold uppercase text-white/68">{label}</span>
      {children}
      {error ? (
        <span className="text-sm font-semibold text-[#ffb84d]" role="alert">
          {error}
        </span>
      ) : null}
    </label>
  );
}

export const inputClass = cn(
  "focus-field min-h-13 w-full px-4 py-3 text-base text-white placeholder:text-white/34",
);

export const textareaClass = cn(
  "focus-field min-h-52 w-full resize-y px-4 py-4 text-base leading-7 text-white placeholder:text-white/34",
);
