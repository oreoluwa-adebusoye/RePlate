import { useState } from 'react';

export default function Login({ onJoin }) {
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  function submit(e){
    e.preventDefault();
    if (code.trim().toLowerCase() === "join-demo") {
      localStorage.setItem('authed', '1');
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
        <input className="mt-3 w-full rounded-xl border px-3 py-2" placeholder="Enter join code"
          value={code} onChange={e=>setCode(e.target.value)} />
        <button className="mt-3 w-full rounded-xl bg-indigo-600 py-2 text-white">Continue</button>
        <p className="mt-2 text-xs text-slate-500">Try <strong>join-demo</strong></p>
      </form>
    </div>
  );
}
