import { useEffect, useMemo, useState } from "react";
import {
  getOrgName, setOrgName,
  getGroups, getUserGroups, setUserGroups
} from "../lib/store";

export default function Profile(){
  const [orgName, setOrg] = useState(getOrgName());
  const [savedOrg, setSavedOrg] = useState(orgName);
  const [groups, setGroups] = useState(getGroups());
  const [mine, setMine] = useState(getUserGroups());
  const [justSaved, setJustSaved] = useState(false);

  // Refresh groups whenever localStorage changes elsewhere (simple poll)
  useEffect(() => {
    const id = setInterval(() => {
      const latest = getGroups();
      // cheap deep compare
      if (JSON.stringify(latest) !== JSON.stringify(groups)) setGroups(latest);
    }, 800);
    return () => clearInterval(id);
  }, [groups]);

  const canSave = useMemo(() => {
    const trimmed = orgName.trim();
    return trimmed.length > 0 && trimmed !== savedOrg;
  }, [orgName, savedOrg]);

  function toggle(g){
    const has = mine.includes(g);
    const next = has ? mine.filter(x=>x!==g) : [...mine, g];
    setMine(next);
    setUserGroups(next);
  }

  function saveOrg(){
    const trimmed = orgName.trim();
    if (!trimmed) return;
    setOrgName(trimmed);
    setSavedOrg(trimmed);
    setJustSaved(true);
    setTimeout(()=>setJustSaved(false), 1200);
  }

  function onOrgKeyDown(e){
    if (e.key === "Enter" && canSave) {
      e.preventDefault();
      saveOrg();
    }
  }

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <h3 className="mb-3 font-semibold">Profile</h3>

      <label className="text-sm text-slate-600">Organization name</label>
      <div className="mt-1 flex gap-2">
        <input
          className="flex-1 rounded-xl border px-3 py-2"
          value={orgName}
          onChange={e=>setOrg(e.target.value)}
          onKeyDown={onOrgKeyDown}
          placeholder="Your Organization"
          aria-label="Organization name"
        />
        <button
          className={`rounded-xl px-3 py-2 text-white ${canSave ? "bg-slate-900 hover:bg-slate-800" : "bg-slate-300 cursor-not-allowed"}`}
          onClick={saveOrg}
          disabled={!canSave}
        >
          {justSaved ? "Saved ✓" : "Save"}
        </button>
      </div>

      <div className="mt-4">
        <h4 className="mb-2 text-sm font-medium text-slate-700">
          My groups {mine.length ? <span className="text-slate-500">({mine.length})</span> : null}
        </h4>
        {groups.length === 0 ? (
          <p className="text-sm text-slate-600">No groups yet. Ask an admin to create some.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {groups.map(g => {
              const on = mine.includes(g);
              return (
                <button
                  key={g}
                  onClick={()=>toggle(g)}
                  aria-pressed={on}
                  className={`rounded-full px-3 py-1 text-sm transition ${
                    on ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {g}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
