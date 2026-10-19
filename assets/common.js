// Settings. On github.io, owner/repo are detected automatically.
// If you use a custom domain, set them by hand: CFG.owner='your-user'; CFG.repo='your-repo';
const CFG = { owner: null, repo: null, branch: 'main', file: 'data/history.json', yes: 'YES', no: 'NO' };
(() => {
  const h = location.hostname;
  if (h.endsWith('.github.io')) {
    CFG.owner = h.split('.')[0];
    const seg = location.pathname.split('/')[1] || '';
    CFG.repo = seg && !seg.includes('.') ? seg : h;
  }
})();
const apiUrl = () => `https://api.github.com/repos/${CFG.owner}/${CFG.repo}/contents/${CFG.file}`;

// Reads straight from the GitHub API so changes show up immediately (no wait for a Pages rebuild).
async function loadHistory() {
  if (CFG.owner) {
    try {
      const r = await fetch(apiUrl() + `?ref=${CFG.branch}`, { headers: { Accept: 'application/vnd.github.raw+json' }, cache: 'no-store' });
      if (r.ok) return await r.json();
    } catch (e) {}
  }
  const r = await fetch(CFG.file + '?t=' + Date.now(), { cache: 'no-store' });
  return r.json();
}
const sorted = h => [...h].sort((a, b) => new Date(a.at) - new Date(b.at));
const current = h => sorted(h).at(-1);
function fmtDur(ms) {
  const m = Math.floor(ms / 60000), d = Math.floor(m / 1440), hr = Math.floor(m % 1440 / 60), mi = m % 60;
  if (d) return `${d}d ${hr}h`;
  if (hr) return `${hr}h ${mi}m`;
  return `${mi}m`;
}
const fmtDate = t => new Date(t).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
function nav(active) {
  const l = [['index.html', 'Status'], ['stats.html', 'History'], ['admin.html', 'Admin']];
  document.body.insertAdjacentHTML('afterbegin', '<nav>' + l.map(([u, t]) => `<a href="${u}"${u === active ? ' aria-current="page"' : ''}>${t}</a>`).join('') + '</nav>');
}
