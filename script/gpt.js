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
    request("GET", "https://api.openai.com/compliance/cookie_requirements?_=" + tik)
  ]);
  if (sr.error) { $done({ content: "Network Error", backgroundColor: "" }); return; }
  if (String(sr.data || "").toLowerCase().indexOf("unsupported_country") >= 0) {
    $done({ content: "Unsupported", backgroundColor: "" }); return;
  }
  $done({ content: "Available \u00b7 " + (cc || "??"), backgroundColor: "#88A788" });
}
(async () => { main().catch(() => $done({ content: "Error", backgroundColor: "" })); })();