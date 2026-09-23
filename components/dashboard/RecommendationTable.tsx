import type { RecommendationRow } from "@/lib/recommendations";

/**
 * Light, distinct pastel badge colors — cycled per District so every
 * district gets a consistent, easily distinguishable color across the
 * table (purely a display aid, same idea as SheetTable's GROUP_COLORS).
 */
const DISTRICT_COLORS = [
  "bg-emerald-50 text-emerald-700 border-emerald-200",
  "bg-sky-50 text-sky-700 border-sky-200",
  "bg-amber-50 text-amber-700 border-amber-200",
  "bg-violet-50 text-violet-700 border-violet-200",
  "bg-rose-50 text-rose-700 border-rose-200",
  "bg-teal-50 text-teal-700 border-teal-200",
  "bg-indigo-50 text-indigo-700 border-indigo-200",
  "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
];

const AREA_COLORS = [
  "bg-orange-50 text-orange-700 border-orange-200",
  "bg-slate-100 text-slate-700 border-slate-200",
];

function colorFor(value: string, palette: string[]) {
  if (!value) return "bg-slate-50 text-slate-400 border-slate-200";
  let hash = 0;
  for (let i = 0; i < value.length; i++) hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  return palette[hash % palette.length];
}

function Badge({ value, palette }: { value: string; palette: string[] }) {
  if (!value) return <span className="text-slate-300">—</span>;
  return (
    <span
      className={`inline-block rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap ${colorFor(
        value,
        palette
      )}`}
    >
      {value}
    </span>
  );
}

export default function RecommendationTable({
  rows,
  title,
}: {
  rows: RecommendationRow[];
  title: string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-brand-orange/10 text-brand-orange text-left">
            <th className="px-4 py-3 font-semibold whitespace-nowrap">ALC Code</th>
            <th className="px-4 py-3 font-semibold whitespace-nowrap">ALC Center Name</th>
            <th className="px-4 py-3 font-semibold whitespace-nowrap">District</th>
            <th className="px-4 py-3 font-semibold whitespace-nowrap">Area</th>
            <th className="px-4 py-3 font-semibold">{title}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.alcCode + i}
              className={i % 2 === 0 ? "bg-white" : "bg-orange-50/40"}
            >
              <td className="px-4 py-3 whitespace-nowrap font-medium text-slate-700">
                {row.alcCode}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-slate-600">{row.alcName}</td>
              <td className="px-4 py-3 whitespace-nowrap">
                <Badge value={row.district} palette={DISTRICT_COLORS} />
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <Badge value={row.area} palette={AREA_COLORS} />
              </td>
              <td className="px-4 py-3 text-slate-700">{row.message}</td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                No data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}