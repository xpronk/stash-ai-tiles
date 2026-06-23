const TITLE = "Instagram";
const CHECK_URL = "https://www.instagram.com";
const MODE = "normal";
function request(method, params) {
  return new Promise((resolve) => {
    $httpClient[method.toLowerCase()](params, (e, r, d) => resolve({e, r, d}));
  });
}
function code(r) { return r ? (r.status || r.statusCode || 0) : 0; }
async function main() {
  const tik = Date.now();
  let info = '??';
  const cr = request('GET', 'https://api.country.is/?t=' + tik);
  const sr = request('GET', CHECK_URL + (CHECK_URL.indexOf('?') >= 0 ? '&' : '?') + '_=' + tik);
  const [c, s] = await Promise.all([cr, sr]);
  try { const j = JSON.parse(c.d || '{}'); if (!c.e && j.country) info = String(j.country).toUpperCase(); } catch(e) {}
  const st = code(s.r);
  const d = String(s.d || '');
  if (s.e) { $done({ content: 'Network Error', backgroundColor: '#6B7280' }); return; }
  if (MODE === 'netflix') {
    if (st === 403 || st === 451 || st === 0) { $done({ content: 'Not Available', backgroundColor: '#6B7280' }); return; }
    if (st >= 200 && st < 400) { $done({ content: 'Available · ' + info, backgroundColor: '#DC2626' }); return; }
    $done({ content: 'Only Originals · ' + info, backgroundColor: '#9A3412' });
    return;
  }
  if (MODE === 'youtube') {
    const lo = d.toLowerCase();
    if (lo.includes('youtube premium is not available in your country')) { $done({ content: 'Not Available', backgroundColor: '#6B7280' }); return; }
    if (st >= 200 && st < 500) { $done({ content: 'Available · ' + info, backgroundColor: '#DC2626' }); return; }
    $done({ content: 'Not Available', backgroundColor: '#6B7280' });
    return;
  }
  if ((st >= 200 && st < 500) || st === 401 || st === 403) {
    $done({ content: 'Available · ' + info, backgroundColor: '#DC2626' });
  } else {
    $done({ content: 'Not Available', backgroundColor: '#6B7280' });
  }
}
(async () => { main().catch(() => $done({ content: 'Error', backgroundColor: '#6B7280' })); })();
