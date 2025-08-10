import PostCard from "./PostCard";

export default function Feed({ items, onClaim }) {
  if (!items.length) {
    return (
      <div className="rounded-2xl border bg-white p-6 text-center text-slate-600 shadow-sm">
        No active posts yet.
      </div>
    );
  }
  return (
    <section className="space-y-3">
      {items.map(item => <PostCard key={item.id} item={item} onClaim={onClaim} />)}
    </section>
  );
}
