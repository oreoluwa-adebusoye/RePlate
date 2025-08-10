export function expiresAtFromNow(mins=30){
  return new Date(Date.now() + mins*60*1000).toISOString();
}
export function formatCountdown(iso){
  const ms = new Date(iso).getTime() - Date.now();
  if (ms <= 0) return "expired";
  const m = Math.floor(ms/60000), s = Math.floor((ms%60000)/1000);
  return `${m}m ${s}s`;
}
