import { useEffect, useState } from "react";
import { expiresAtFromNow } from "../lib/time";
import { getRole } from "../lib/role";
import { getGroups } from "../lib/store";

export default function PostModal({ open, onClose, onCreate }) {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [location, setLocation] = useState("");
  const [tags, setTags] = useState("");
  const [expiresIn, setExpiresIn] = useState(30); // number
  const [servings, setServings] = useState(12);   // number
  const [err, setErr] = useState("");

  // audience targeting
  const [audience, setAudience] = useState("org"); // 'org' | 'groups'
  const [targetGroups, setTargetGroups] = useState([]);
  const [allGroups, setAllGroups] = useState([]);

  // photo (local preview only for MVP)
  const [photoFile, setPhotoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  // When modal opens, refresh groups and clear any old error
  useEffect(() => {
    if (open) {
      setAllGroups(getGroups());
      setErr("");
    }
  }, [open]);

  // Revoke object URL when preview changes or modal unmounts
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (!open) return null;

  function onPhoto(e) {
    const f = e.target.files?.[0] || null;
    setPhotoFile(f);
    // Revoke any existing URL before creating a new one
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(f ? URL.createObjectURL(f) : "");
  }

  function resetForm() {
    setTitle("");
    setDetails("");
    setLocation("");
    setTags("");
    setExpiresIn(30);
    setServings(12);
    setErr("");
    setPhotoFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl("");
    setAudience("org");
    setTargetGroups([]);
  }

  function submit(e) {
    e.preventDefault();
    if (getRole() !== "organizer") {
      setErr("Only organizers can post.");
      return;
    }
    if (!title || !location) {
      setErr("Title and Location are required.");
      return;
    }

    const cleanedTags = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const record = {
      id: String(Date.now()),
      title,
      details,
      location,
      tags: cleanedTags,
      expiresAt: expiresAtFromNow(Number(expiresIn)),
      servings: Number(servings) || 0,
      photoUrl: previewUrl || "",
      createdAt: new Date().toISOString(),
      visibility: audience, // 'org' or 'groups'
      targetGroups: audience === "groups" ? targetGroups : [],
    };

    onCreate?.(record);
    onClose?.();
    resetForm();
  }

  return (
    <div
      className="fixed inset-0 z-40 grid place-items-center bg-black/40 p-4"
      onClick={() => {
        onClose?.();
        resetForm();
      }}
    >
      <div
        className="w-full max-w-xl rounded-2xl border bg-white p-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Post Leftovers</h3>
          <button
            className="rounded-xl px-3 py-1 hover:bg-slate-100"
            onClick={() => {
              onClose?.();
              resetForm();
            }}
          >
            Close
          </button>
        </div>

        <form className="grid gap-3" onSubmit={submit}>
          {err && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-2 text-sm text-rose-700">
              {err}
            </div>
          )}

          <div>
            <label className="text-sm text-slate-600">Title</label>
            <input
              className="w-full rounded-xl border px-3 py-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Sushi Platters"
            />
          </div>

          <div>
            <label className="text-sm text-slate-600">Details</label>
            <textarea
              className="w-full rounded-xl border px-3 py-2"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="From Marketing event — sealed trays"
            />
          </div>

          <div>
            <label className="text-sm text-slate-600">Location</label>
            <input
              className="w-full rounded-xl border px-3 py-2"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Building B • Lounge"
            />
          </div>

          <div>
            <label className="text-sm text-slate-600">
              Tags (comma-separated)
            </label>
            <input
              className="w-full rounded-xl border px-3 py-2"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="vegan, sealed, contains gluten"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-slate-600">
                Expires In (minutes)
              </label>
              <input
                type="number"
                min="5"
                max="180"
                className="w-full rounded-xl border px-3 py-2"
                value={expiresIn}
                onChange={(e) =>
                  setExpiresIn(Math.max(0, Number(e.target.value || 0)))
                }
              />
            </div>
            <div>
              <label className="text-sm text-slate-600">Servings</label>
              <input
                type="number"
                min="1"
                className="w-full rounded-xl border px-3 py-2"
                value={servings}
                onChange={(e) =>
                  setServings(Math.max(0, Number(e.target.value || 0)))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-slate-600">Audience</label>
              <select
                className="w-full rounded-xl border px-3 py-2"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
              >
                <option value="org">Everyone in org</option>
                <option value="groups">Specific groups…</option>
              </select>
            </div>

            {audience === "groups" && (
              <div>
                <label className="text-sm text-slate-600">Choose groups</label>
                <div className="flex flex-wrap gap-2">
                  {allGroups.length === 0 ? (
                    <span className="text-sm text-slate-500">No groups yet.</span>
                  ) : (
                    allGroups.map((g) => {
                      const on = targetGroups.includes(g);
                      return (
                        <button
                          type="button"
                          key={g}
                          onClick={() => {
                            const next = on
                              ? targetGroups.filter((x) => x !== g)
                              : [...targetGroups, g];
                            setTargetGroups(next);
                          }}
                          className={`rounded-full px-3 py-1 text-sm ${
                            on
                              ? "bg-indigo-600 text-white"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {g}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="text-sm text-slate-600">Photo (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={onPhoto}
              className="w-full rounded-xl border px-3 py-2"
            />
            {previewUrl && (
              <img
                src={previewUrl}
                alt="preview"
                className="mt-2 h-40 w-full rounded-xl object-cover border"
              />
            )}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="rounded-xl px-4 py-2 hover:bg-slate-100"
              onClick={() => {
                onClose?.();
                resetForm();
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
            >
              Publish
            </button>
          </div>

          <p className="text-xs text-slate-500">
            Tip: Use common areas; posts auto-expire.
          </p>
        </form>
      </div>
    </div>
  );
}
