async function request(method, params) {
  return new Promise((resolve) => {
    $httpClient[method.toLowerCase()](params, (error, response, data) => {
      resolve({ error, response, data });
    });
  });
}

async function main() {
  const r = await request("GET", "https://api.country.is/?t=" + Date.now());
  if (r.error) { $done({ content: "??", backgroundColor: "" }); return; }
  try {
    const j = JSON.parse(r.data || "{}");
    const cc = String(j.country || "").toUpperCase();
    $done({ content: cc || "??", backgroundColor: cc ? "#2563EB" : "" });
  } catch(e) { $done({ content: "??", backgroundColor: "" }); }
}
(async () => { main().catch(() => $done({ content: "??", backgroundColor: "" })); })();