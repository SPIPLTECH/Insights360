export default function RecommendationTabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "rounded-xl px-4 py-2.5 text-sm font-semibold text-white bg-brand-orange shadow-sm whitespace-nowrap"
          : "rounded-xl px-4 py-2.5 text-sm font-semibold text-brand-orange border border-brand-orange/50 bg-brand-orange/5 hover:bg-brand-orange/10 whitespace-nowrap"
      }
    >
      {label}
    </button>
  );
}