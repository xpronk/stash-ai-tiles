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

async function getCountry() {
  const tik = Date.now();
  const r = await request("GET", "https://www.cloudflare.com/cdn-cgi/trace?_=" + tik);
  if (!r.error) {
    const cc = parseCountry(r.data);
    if (cc) return cc;
  }
  const r2 = await request("GET", "https://api.ip.sb/geoip?_=" + tik);
  return parseCountry(r2.data) || "";
}

async function main() {
  const tik = Date.now();
  const [cc, sr] = await Promise.all([
    getCountry(),
    request("GET", "https://www.youtube.com/premium?_=" + tik)
  ]);
  if (sr.error) { $done({ content: "Network Error", backgroundColor: "" }); return; }
  const d = String(sr.data || "").toLowerCase();
  if (d.indexOf("youtube premium is not available in your country") >= 0) {
    $done({ content: "Not Available", backgroundColor: "" }); return;
  }
  if (d.indexOf("ad-free") >= 0) {
    $done({ content: "Available \u00b7 " + (cc || "??"), backgroundColor: "#FF0000" }); return;
  }
  $done({ content: "Unknown", backgroundColor: "" });
}
(async () => { main().catch(() => $done({ content: "Error", backgroundColor: "" })); })();