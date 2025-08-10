import { useEffect, useState } from "react";

// Components (make sure these files exist from earlier steps)
import RoleToggle from "./components/RoleToggle";
import Feed from "./components/Feed";
import PostModal from "./components/PostModal";
import SkeletonCard from "./components/SkeletonCard";

// Helpers
import { getRole } from "./lib/role";
import { getOrgName } from './lib/store';

// Fake Login page (local-only gate)
function Login({ onJoin }) {
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  function submit(e){
    e.preventDefault();
    if (code.trim().toLowerCase() === "join-demo") {
      localStorage.setItem("authed", "1");
      onJoin?.();
    } else {
      setErr("Invalid join code");
    }
  }
  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-indigo-600 to-fuchsia-500">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl bg-white p-5 shadow">
        <h1 className="text-lg font-semibold">Join Organization</h1>
        {err && <div className="mt-2 rounded border border-rose-200 bg-rose-50 p-2 text-sm text-rose-700">{err}</div>}
        <input
          className="mt-3 w-full rounded-xl border px-3 py-2"
          placeholder="Enter join code"
          value={code}
          onChange={(e)=>setCode(e.target.value)}
        />
        <button className="mt-3 w-full rounded-xl bg-indigo-600 py-2 text-white">
          Continue
        </button>
        <p className="mt-2 text-xs text-slate-500">Try <strong>join-demo</strong></p>
      </form>
    </div>
  );
}

// ---------- Seed data (now includes servings + photoUrl) ----------
<h1 className="text-lg font-semibold">{getOrgName()} — Leftover Alerts</h1>

const seed = [
  {
    id: "1",
    title: "Sushi Platters",
    details: "From Leadership Summit — sealed trays",
    location: "Building B • Lounge",
    tags: ["org-wide","contains fish","sealed"],
    servings: 14,
    photoUrl: "",
    expiresAt: new Date(Date.now()+45*60*1000).toISOString(),
    createdAt: new Date().toISOString(),
    visibility: 'org',
    targetGroups: [],

  },
  {
    id: "2",
    title: "Veggie Pizza",
    details: "Bring your own container",
    location: "Student Center Lobby",
    tags: ["vegetarian","contains gluten"],
    servings: 8,
    photoUrl: "",
    expiresAt: new Date(Date.now()+25*60*1000).toISOString(),
    createdAt: new Date().toISOString()
  }
];

export default function App(){
  // ---- fake login gate ----
  const authed = localStorage.getItem("authed") === "1";
  const [role, setRole] = useState(getRole());
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(null); // null = show skeletons

  // Simulate loading + seed data
  useEffect(()=>{
    const id = setTimeout(()=> setItems(seed), 500);
    return ()=>clearTimeout(id);
  }, []);

  // Auto-hide expired posts every 30s
  useEffect(()=>{
    const tick = () => {
      setItems(prev => {
        if (!Array.isArray(prev)) return prev;
        const now = Date.now();
        return prev.filter(x => new Date(x.expiresAt).getTime() > now);
      });
    };
    const id = setInterval(tick, 30000);
    return ()=>clearInterval(id);
  }, []);

  function addItem(rec){
    // Ensure servings + optional photoUrl exist
    const normalized = { servings: 12, photoUrl: "", ...rec };
    setItems(prev => [normalized, ...(prev || [])]);
  }

  // Decrement servings on claim
  function onClaim(postId){
    setItems(prev => prev?.map(x => x.id === postId ? { ...x, servings: Math.max((x.servings||0) - 1, 0) } : x));
  }

  if (!authed) return <Login onJoin={()=>location.reload()} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <h1 className="text-lg font-semibold">Leftover Alerts — MVP</h1>
          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-slate-600 sm:inline">
              {role === "organizer" ? "Organizer" : "Member"}
            </span>
            <button
              className={`rounded-full px-4 py-2 text-sm font-medium shadow
                ${role === "organizer" ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-slate-300/60 text-slate-600 cursor-not-allowed"}`}
              disabled={role !== "organizer"}
              onClick={()=>setOpen(true)}
            >
              Post Leftovers
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto grid max-w-5xl gap-6 px-4 py-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* skeleton while loading */}
          {items === null ? (
            <div className="space-y-3">
              <SkeletonCard/><SkeletonCard/><SkeletonCard/>
            </div>
          ) : (
            <Feed items={items} onClaim={onClaim} />
          )}
        </div>
        <aside className="space-y-3">
          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <h3 className="mb-2 font-semibold">Filters (coming soon)</h3>
            <div className="text-sm text-slate-600">Tag chips + search next.</div>
          </div>
          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <h3 className="mb-2 font-semibold">Notifications</h3>
            <p className="text-sm text-slate-600">Slack/SMS after posting works.</p>
          </div>
          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <h3 className="mb-2 font-semibold">Session</h3>
            <button
              className="rounded-xl bg-slate-800 px-3 py-1.5 text-white"
              onClick={()=>{ localStorage.removeItem("authed"); location.reload(); }}
            >
              Sign out (demo)
            </button>
          </div>
        </aside>
      </main>

      {/* Floating role switch */}
      <RoleToggle onChange={setRole} />

      {/* Create Post modal */}
      <PostModal open={open} onClose={()=>setOpen(false)} onCreate={addItem} />
    </div>
  );
}
