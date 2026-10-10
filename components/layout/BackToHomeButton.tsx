const HOME_URL = process.env.NEXT_PUBLIC_HOME_URL || "/";

export default function BackToHomeButton() {
  return (
    <a
      href={HOME_URL}
      className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-brand-orange/50 hover:bg-brand-50 hover:text-brand-pink"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m15 18-6-6 6-6" />
      </svg>
      Back to Home
    </a>
  );
}