import { useMemo, useState } from "react";
import { getGroups, addGroup, removeGroup } from "../lib/store";
import { getRole } from "../lib/role";

export default function GroupsManager({ onChange }) {
  const [groups, setGroups] = useState(getGroups());
  const [name, setName] = useState("");
  const role = getRole(); // simple guard for now

  const normalizedExisting = useMemo(
    () => new Set(groups.map(g => g.trim().toLowerCase())),
    [groups]
  );

  function handleAdd() {
    const raw = name.trim();
    if (!raw) return;
    const lc = raw.toLowerCase();
    if (normalizedExisting.has(lc)) return; // duplicate (case-insensitive)
    const next = addGroup(raw);
    setGroups(next);
    setName("");
    onChange?.(next);
  }

  function handleDelete(g) {
    const next = removeGroup(g);
    setGroups(next);
    onChange?.(next);
  }

  function onKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  }

  const canManage = role === "organizer"; // adjust when you add "admin"

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold">Groups (departments/buildings)</h3>
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 rounded-xl border px-3 py-2"
          placeholder="e.g., Building B or Engineering"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={!canManage}
        />
        <button
          className={`rounded-xl px-3 py-2 text-white ${
            canManage ? "bg-slate-900 hover:bg-slate-800" : "bg-slate-300 cursor-not-allowed"
          }`}
          onClick={handleAdd}
          disabled={!canManage || !name.trim() || normalizedExisting.has(name.trim().toLowerCase())}
          title={!canManage ? "Only organizers can manage groups" : ""}
        >
          Add
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {groups.length === 0 ? (
          <p className="text-sm text-slate-600">No groups yet.</p>
        ) : (
          groups.map(g => (
            <span
              key={g}
              className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm"
            >
              {g}
              <button
                className={`rounded-full px-2 text-xs ${
                  canManage ? "bg-slate-200 hover:bg-slate-300" : "bg-slate-200 cursor-not-allowed"
                }`}
                onClick={() => canManage && handleDelete(g)}
                disabled={!canManage}
                title={!canManage ? "Only organizers can delete" : ""}
              >
                ×
              </button>
            </span>
          ))
        )}
      </div>
    </div>
  );
}
