/**
 * District matching that tolerates the spelling variants seen in the sheets
 * (English / Marathi / Hindi, e.g. "Gondia" vs "Gondiya"). The DCU login stores
 * ONE spelling, while the sheet may use another — an exact string compare then
 * finds zero ALCs. Matching ignores case, spaces and punctuation.
 */
const DISTRICT_GROUPS: string[][] = [
  ["nagpur", "nagpurcity", "नागपूर", "नागपुर"],
  ["chandrapur", "chanda", "chandrpur", "चंद्रपूर", "चंद्रपुर"],
  ["bhandara", "bhandra", "भंडारा"],
  ["gondiya", "gondia", "gondya", "gondiaa", "gondea", "gondiy", "गोंदिया", "गोंदीया"],
  ["gadchiroli", "gadchirolli", "gadhchiroli", "gadchiroly", "गडचिरोली"],
  ["wardha", "vardha", "wardhaa", "वर्धा"],
];

const norm = (s: string) => (s ?? "").toLowerCase().replace(/[^a-z\u0900-\u097f]/g, "");

/** All accepted spellings (normalised) for a district name. */
function variantsOf(district: string): string[] {
  const n = norm(district);
  const group = DISTRICT_GROUPS.find((g) => g.some((a) => norm(a) === n));
  return (group ?? [district]).map(norm).filter(Boolean);
}

/** True if a sheet cell (e.g. "Gondiya", "gondia ", "Gondia District") belongs to `userDistrict`. */
export function sameDistrict(cellValue: string | undefined | null, userDistrict: string): boolean {
  const x = norm(cellValue ?? "");
  if (!x) return false;
  return variantsOf(userDistrict).some((v) => x === v || x.includes(v));
}
