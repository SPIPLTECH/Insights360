import { AlertTriangle } from "lucide-react";
import type { DataServiceError } from "@/lib/dataService";

export default function ErrorState({ error, onRetry }: { error: DataServiceError; onRetry: () => void }) {
  const hint =
    error.code === "CONFIG"
      ? "Check that GOOGLE_SHEETS_API_KEY and GOOGLE_SHEET_1_ID are set in .env.local, then restart the dev server so it picks up the new values."
      : "Check that both Google Sheets are shared as \"Anyone with the link – Viewer\", and that tab names match Index-1, Index-2, Index-3, Index-4 exactly.";

  return (
    <div className="card p-8 m-4 flex flex-col items-center text-center gap-3">
      <AlertTriangle className="text-amber-500" size={36} />
      <h2 className="font-semibold text-lg text-slate-800">Couldn't load dashboard data</h2>
      <p className="text-sm text-slate-500 max-w-md">{error.message}</p>
      <p className="text-xs text-slate-400 max-w-md">{hint}</p>
      <button
        onClick={onRetry}
        className="mt-2 bg-brand-gradient text-white text-sm font-medium px-4 py-2 rounded-lg"
      >
        Try again
      </button>
    </div>
  );
}
