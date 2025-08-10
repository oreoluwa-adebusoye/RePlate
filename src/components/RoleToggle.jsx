import { getRole, setRole } from "../lib/role";

export default function RoleToggle({ onChange }) {
  const role = getRole();
  function choose(r){ setRole(r); onChange?.(r); }

  return (
    <div className="fixed bottom-4 right-4 z-50 rounded-2xl border bg-white/80 backdrop-blur px-3 py-2 text-sm text-slate-700 shadow">
      <span className="mr-2 font-medium">Role:</span>
      <button
        className={`mr-1 rounded-xl px-3 py-1 ${role==='member'?'bg-indigo-600 text-white':'hover:bg-slate-100'}`}
        onClick={()=>choose('member')}
      >Member</button>
      <button
        className={`rounded-xl px-3 py-1 ${role==='organizer'?'bg-indigo-600 text-white':'hover:bg-slate-100'}`}
        onClick={()=>choose('organizer')}
      >Organizer</button>
    </div>
  );
}
