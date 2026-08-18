export default function LoadingSkeleton() {
  return (
    <div className="p-5 space-y-4">
      <div className="skeleton h-28 w-full rounded-2xl" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-20 rounded-2xl" />
        ))}
      </div>
      <div className="skeleton h-64 w-full rounded-2xl" />
      <div className="skeleton h-96 w-full rounded-2xl" />
    </div>
  );
}
