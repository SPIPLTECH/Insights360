"use client";

import { useState } from "react";
import { Check, Minus, Pencil, X } from "lucide-react";

/** Section heading with icon tile. */
export function SectionHeader({
  icon,
  title,
  description,
  right,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-gradient text-white shadow-md shadow-brand-pink/20">
          {icon}
        </span>
        <div>
          <h2 className="text-xl font-bold text-slate-900 leading-tight">{title}</h2>
          {description ? <p className="text-sm text-slate-500 mt-0.5 max-w-2xl">{description}</p> : null}
        </div>
      </div>
      {right}
    </div>
  );
}

const TONES: Record<string, { box: string; icon: string }> = {
  slate: { box: "bg-slate-100 text-slate-600", icon: "text-slate-600" },
  amber: { box: "bg-amber-100 text-amber-600", icon: "text-amber-600" },
  emerald: { box: "bg-emerald-100 text-emerald-600", icon: "text-emerald-600" },
  rose: { box: "bg-rose-100 text-rose-600", icon: "text-rose-600" },
  sky: { box: "bg-sky-100 text-sky-600", icon: "text-sky-600" },
  violet: { box: "bg-violet-100 text-violet-600", icon: "text-violet-600" },
  orange: { box: "bg-orange-100 text-orange-600", icon: "text-orange-600" },
};

export function StatCard({
  label,
  value,
  icon,
  tone = "slate",
  hint,
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  tone?: keyof typeof TONES;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
        <span className={`grid h-9 w-9 place-items-center rounded-xl ${TONES[tone].box}`}>{icon}</span>
      </div>
      <p className="mt-2 text-3xl font-extrabold text-slate-900 tabular-nums">{value}</p>
      {hint ? <p className="text-xs text-slate-400 mt-0.5">{hint}</p> : null}
    </div>
  );
}

export function ProgressBar({ value, max, tone = "orange" }: { value: number; max: number; tone?: "orange" | "emerald" }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all ${tone === "emerald" ? "bg-emerald-500" : "bg-brand-gradient"}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  accepted: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  rejected: "bg-rose-50 text-rose-700 ring-rose-200",
  none: "bg-slate-50 text-slate-400 ring-slate-200",
};
const STATUS_TEXT: Record<string, string> = {
  pending: "Pending review",
  accepted: "Accepted",
  rejected: "Rejected",
  none: "Not filled",
};

export function StatusPill({ status }: { status?: string | null }) {
  const k = status && STATUS_STYLE[status] ? status : "none";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${STATUS_STYLE[k]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${k === "pending" ? "bg-amber-500" : k === "accepted" ? "bg-emerald-500" : k === "rejected" ? "bg-rose-500" : "bg-slate-300"}`} />
      {STATUS_TEXT[k]}
    </span>
  );
}

/** Pencil → (Save ✓ | Cancel ✕) controls for one table row. */
export function RowActions({
  editing,
  saving,
  onEdit,
  onSave,
  onCancel,
  disabled,
  showCancel = true,
}: {
  showCancel?: boolean;
  editing: boolean;
  saving: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  disabled?: boolean;
}) {
  if (!editing) {
    return (
      <button
        type="button"
        onClick={onEdit}
        disabled={disabled}
        title="Edit"
        className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:border-brand-orange hover:bg-brand-50 hover:text-brand-orange transition-colors disabled:opacity-40"
      >
        <Pencil size={16} />
      </button>
    );
  }
  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        title="Save"
        className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-500 text-white shadow-sm hover:bg-emerald-600 transition-colors disabled:opacity-60"
      >
        {saving ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> : <Check size={18} strokeWidth={3} />}
      </button>
      {showCancel ? <button
        type="button"
        onClick={onCancel}
        disabled={saving}
        title="Cancel"
        className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-colors"
      >
        <X size={17} />
      </button> : null}
    </div>
  );
}

/** Tick / cross / NA / pending glyphs used in the examination grid. */
export function Glyph({ kind }: { kind: "yes" | "no" | "na" | "pending" }) {
  if (kind === "yes")
    return (
      <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-100 text-emerald-600">
        <Check size={16} strokeWidth={3} />
      </span>
    );
  if (kind === "no")
    return (
      <span className="grid h-7 w-7 place-items-center rounded-full bg-rose-100 text-rose-600">
        <X size={16} strokeWidth={3} />
      </span>
    );
  if (kind === "na") return <span className="text-xs font-bold tracking-wide text-slate-400">NA</span>;
  return <Minus size={16} className="text-slate-300" />;
}

/** Row editor state: drafts per ALC, which rows are being edited / saved, and per-row errors. */
export function useRowEditor<T>() {
  const [drafts, setDrafts] = useState<Record<string, T>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [flash, setFlash] = useState<string | null>(null);

  return {
    drafts,
    saving,
    errors,
    flash,
    isEditing: (code: string) => code in drafts,
    start: (code: string, initial: T) => {
      setErrors((e) => ({ ...e, [code]: "" }));
      setDrafts((d) => ({ ...d, [code]: initial }));
    },
    set: (code: string, v: T) => setDrafts((d) => ({ ...d, [code]: v })),
    cancel: (code: string) => {
      setDrafts((d) => {
        const n = { ...d };
        delete n[code];
        return n;
      });
      setErrors((e) => ({ ...e, [code]: "" }));
    },
    async save(code: string, draft: T, task: (draft: T) => Promise<void>) {
      setSaving((s) => ({ ...s, [code]: true }));
      setErrors((e) => ({ ...e, [code]: "" }));
      try {
        await task(draft);
        setDrafts((d) => {
          const n = { ...d };
          delete n[code];
          return n;
        });
        setFlash(code);
        setTimeout(() => setFlash((f) => (f === code ? null : f)), 1800);
      } catch (err: any) {
        setErrors((e) => ({ ...e, [code]: err?.message || "Could not save." }));
      } finally {
        setSaving((s) => ({ ...s, [code]: false }));
      }
    },
  };
}

/** Bottom bar of a table: message + one Submit button (replaces the per-row Action column). */
export function SubmitBar({
  loading,
  message,
  onSubmit,
  label = "Submit",
  onBack,
  backLabel = "Back",
}: {
  loading: boolean;
  message: { type: "ok" | "error"; text: string } | null;
  onSubmit: () => void;
  label?: string;
  onBack?: () => void;
  backLabel?: string;
}) {
  return (
    <div className="pt-1 space-y-3">
      {message ? (
        <p className={`text-sm rounded-xl px-3 py-2 ${message.type === "ok" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-600"}`}>{message.text}</p>
      ) : null}
      <div className="flex flex-wrap items-center gap-3">
        {onBack ? (
          <button type="button" onClick={onBack} disabled={loading} className="rounded-xl border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-60">
            {backLabel}
          </button>
        ) : null}
        <button type="button" onClick={onSubmit} disabled={loading} className="bg-brand-gradient text-white font-semibold text-sm rounded-xl px-8 py-2.5 disabled:opacity-60">
          {loading ? "Submitting…" : label}
        </button>
      </div>
    </div>
  );
}

/** Pencil for saved rows. While editing: ✓ save (left) and ✕ cancel (right). */
export function EditToggle({ editing, saving, onEdit, onSave, onCancel }: { editing: boolean; saving?: boolean; onEdit: () => void; onSave: () => void; onCancel: () => void }) {
  if (!editing)
    return (
      <button type="button" onClick={onEdit} title="Edit" className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:border-brand-orange hover:bg-brand-50 hover:text-brand-orange transition-colors">
        <Pencil size={16} />
      </button>
    );
  return (
    <div className="flex items-center gap-1.5">
      <button type="button" onClick={onSave} disabled={saving} title="Save" className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-500 text-white shadow-sm hover:bg-emerald-600 transition-colors disabled:opacity-60">
        {saving ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> : <Check size={18} strokeWidth={3} />}
      </button>
      <button type="button" onClick={onCancel} disabled={saving} title="Cancel" className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 transition-colors">
        <X size={17} />
      </button>
    </div>
  );
}

/** Our own pop-up (instead of the browser alert). */
export function NoticeModal({ message, onClose, title = "Please check" }: { message: string | null; onClose: () => void; title?: string }) {
  if (!message) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 px-4" onClick={onClose} role="alertdialog" aria-modal="true">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-amber-100 text-amber-600 text-lg font-extrabold">!</span>
          <div>
            <h3 className="text-base font-bold text-slate-900">{title}</h3>
            <p className="mt-1 text-sm text-slate-600">{message}</p>
          </div>
        </div>
        <div className="mt-5 text-right">
          <button type="button" autoFocus onClick={onClose} className="bg-brand-gradient text-white font-semibold text-sm rounded-xl px-6 py-2">OK</button>
        </div>
      </div>
    </div>
  );
}
