export default function SkeletonCard(){
  return (
    <div className="animate-pulse rounded-2xl border bg-white p-4 shadow-sm">
      <div className="mb-2 h-4 w-1/3 rounded bg-slate-200"></div>
      <div className="mb-2 h-3 w-full rounded bg-slate-100"></div>
      <div className="mb-2 h-3 w-2/3 rounded bg-slate-100"></div>
      <div className="mt-3 h-8 w-28 rounded bg-slate-200"></div>
    </div>
  );
}
