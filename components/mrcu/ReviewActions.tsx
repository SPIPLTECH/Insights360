"use client";

import { STATUS_BADGE } from "@/components/dcu/constants";

/** Action / status cell for one submission row. */
export default function ReviewActions({
  s,
  busy,
  onAccept,
  onOpenReject,
  onRetry,
}: {
  s: any;
  busy: boolean;
  onAccept: () => void;
  onOpenReject: () => void;
  onRetry: () => void;
}) {
  if (s.status === "pending") {
    return (
      <div className="flex gap-2">
        <button
          onClick={onAccept}
          disabled={busy}
          className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg px-3 py-1.5 disabled:opacity-50"
        >
          {busy ? "Saving…" : "Accept"}
        </button>
        <button
          onClick={onOpenReject}
          disabled={busy}
          className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold rounded-lg px-3 py-1.5 disabled:opacity-50"
        >
          Reject
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${STATUS_BADGE[s.status]}`}>{s.status}</span>
      {s.sheetSynced ? (
        <p className="text-[11px] text-emerald-600">✓ Sheet updated</p>
      ) : (
        <div>
          <p className="text-[11px] text-amber-600" title={s.sheetError || ""}>
            ⚠ Sheet not updated
          </p>
          <button
            onClick={onRetry}
            disabled={busy}
            className="mt-1 text-[11px] font-semibold text-brand-orange underline disabled:opacity-50"
          >
            {busy ? "Retrying…" : "Retry sheet sync"}
          </button>
        </div>
      )}
      {s.status === "rejected" && s.reviewNote ? <p className="text-[11px] text-slate-400">Reason: {s.reviewNote}</p> : null}
    </div>
  );
}
