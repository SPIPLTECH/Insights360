"use client";

import { useState } from "react";

export const inputClass =
  "mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/40 focus:border-brand-orange disabled:bg-slate-50 disabled:text-slate-400";

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-500">{label}</label>
      {children}
      {hint ? <p className="text-xs text-slate-400 mt-1">{hint}</p> : null}
    </div>
  );
}

/** Segmented option picker — used for Yes/No and Mandatory/Not Mandatory. */
export function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T | "";
  options: readonly T[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="mt-1 flex gap-2 flex-wrap">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${
            value === o
              ? "bg-brand-gradient text-white border-transparent"
              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

export type FormMessage = { type: "ok" | "error"; text: string } | null;

/** Wraps submit state (loading + success/error message) for every form. */
export function useFormSubmit() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<FormMessage>(null);

  async function run(task: () => Promise<void>, successText = "Submitted for MRCU review.") {
    setMessage(null);
    setLoading(true);
    try {
      await task();
      setMessage({ type: "ok", text: successText });
      return true;
    } catch (err: any) {
      setMessage({ type: "error", text: err?.message || "Something went wrong." });
      return false;
    } finally {
      setLoading(false);
    }
  }

  return { loading, message, setMessage, run };
}

export function FormFooter({ loading, message }: { loading: boolean; message: FormMessage }) {
  return (
    <div className="pt-2 space-y-3">
      {message ? (
        <p
          className={`text-sm rounded-xl px-3 py-2 ${
            message.type === "ok" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-600"
          }`}
        >
          {message.text}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={loading}
        className="bg-brand-gradient text-white font-semibold text-sm rounded-xl px-8 py-2.5 disabled:opacity-60"
      >
        {loading ? "Submitting…" : "Submit"}
      </button>
    </div>
  );
}

export function PageTitle({
  title,
  subtitle,
  icon,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <h2 className="flex items-center gap-2 text-xl md:text-2xl font-bold text-slate-800">
        {icon ? <span className="text-brand-orange">{icon}</span> : null}
        {title}
      </h2>
      {subtitle ? <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p> : null}
    </div>
  );
}
