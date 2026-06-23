const TITLE = "出 口 地 区";
function request(method, params) {
  return new Promise((resolve) => {
    $httpClient[method.toLowerCase()](params, (e, r, d) => resolve({e, r, d}));
  });
}
async function main() {
  const r = await request('GET', 'https://api.country.is/?t=' + Date.now());
  if (r.e) { $done({ content: '??', backgroundColor: '#6B7280' }); return; }
  try {
    const j = JSON.parse(r.d || '{}');
    const cc = String(j.country || '').toUpperCase();
    $done({ content: cc || '??', backgroundColor: '#2563EB' });
  } catch (e) { $done({ content: '??', backgroundColor: '#6B7280' }); }
}
(async () => { main().catch(() => $done({ content: '??', backgroundColor: '#6B7280' })); })();
