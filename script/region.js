async function request(method, params) {
  return new Promise((resolve) => {
    $httpClient[method.toLowerCase()](params, (error, response, data) => {
      resolve({ error, response, data });
    });
  });
}

function parseCountry(data) {
  if (!data) return "";
  const m = String(data).match(/loc=([A-Z]{2})/);
  return m ? m[1] : "";
}

async function main() {
  const r = await request("GET", "https://www.cloudflare.com/cdn-cgi/trace?_=" + Date.now());
  if (r.error) { $done({ content: "??", backgroundColor: "" }); return; }
  const cc = parseCountry(r.data);
  $done({ content: cc || "??", backgroundColor: cc ? "#2563EB" : "" });
}
(async () => { main().catch(() => $done({ content: "??", backgroundColor: "" })); })();