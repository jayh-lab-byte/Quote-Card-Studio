const prefix = 'quote-card-studio:';
export function readStorage(name, fallback) {
  try { return JSON.parse(localStorage.getItem(prefix + name)) ?? fallback; }
  catch { return fallback; }
}
export function writeStorage(name, value) {
  try { localStorage.setItem(prefix + name, JSON.stringify(value)); }
  catch { /* The editor remains usable when browser storage is unavailable. */ }
}
