import { useEffect, useState } from "react";
import { formatCountdown } from "../lib/time";
import { hasClaimed, markClaimed } from "../lib/claims";

// Emoji tags for quick visual pop
const TAG_EMOJI = {
  vegan: "🥗",
  vegetarian: "🥦",
  halal: "🕌",
  "contains dairy": "🥛",
  "contains gluten": "🌾",
  "contains nuts": "🥜",
  sealed: "🔒",
  "contains fish": "🐟",
};

export default function PostCard({ item, onClaim }) {
  const [left, setLeft] = useState(formatCountdown(item.expiresAt));
  const [claimed, setClaimed] = useState(hasClaimed(item.id));

  useEffect(() => {
    const id = setInterval(() => setLeft(formatCountdown(item.expiresAt)), 1000);
    return () => clearInterval(id);
  }, [item.expiresAt]);

  const expired = left === "expired";
  const servings = Math.max(item.servings || 0, 0);
  const disabled = expired || servings <= 0 || claimed;

  function handleClaim() {
    if (disabled) return;
    setClaimed(true);
    markClaimed(item.id);
    onClaim?.(item.id);
  }

  return (
    <article className="rounded-2xl border bg-white p-4 shadow-sm transition hover:shadow-md">
      {/* Nice little gradient strip */}
      <div className="mb-3 h-1 w-full rounded bg-gradient-to-r from-indigo-500 to-fuchsia-500" />

      {item.photoUrl && (
        <img
          src={item.photoUrl}
          alt=""
          className="mb-3 h-40 w-full rounded-xl border object-cover"
        />
      )}

      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-base font-semibold">{item.title}</h3>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
            {expired ? "Expired" : `Ends in ${left}`}
          </span>
          <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700">
            {servings} servings
          </span>
        </div>
      </div>

      <p className="text-sm text-slate-600">{item.details}</p>
      <p className="mt-1 text-sm">
        <strong>Location:</strong> {item.location}
      </p>

      <div className="mt-2 flex flex-wrap gap-2">
        {(item.tags || []).map((t) => {
          const e = TAG_EMOJI[t.toLowerCase()] || "🏷️";
          return (
            <span
              key={t}
              className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700"
            >
              {e} {t}
            </span>
          );
        })}
      </div>

      <div className="mt-3 flex justify-end">
        <button
          onClick={handleClaim}
          disabled={disabled}
          className={`rounded-xl px-3 py-1.5 text-sm font-medium transition ${
            disabled
              ? "cursor-not-allowed bg-slate-200 text-slate-500"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          {claimed ? "Claimed" : "I’m on the way"}
        </button>
      </div>
    </article>
  );
}
