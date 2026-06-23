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

// https://grok.com and ? replaced by build script
async function main() {
  const tik = Date.now();
  const [cc, sr] = await Promise.all([
    getCountry(),
    request("GET", "https://grok.com" + "?" + "_=" + tik)
  ]);
  if (sr.error) { $done({ content: "Network Error", backgroundColor: "" }); return; }
  const s = sr.response ? (sr.response.status || sr.response.statusCode || 0) : 0;
  if ((s >= 200 && s < 500) || s === 401 || s === 403) {
    $done({ content: "Available \u00b7 " + (cc || "??"), backgroundColor: "#FF0000" });
  } else {
    $done({ content: "Not Available", backgroundColor: "" });
  }
}
(async () => { main().catch(() => $done({ content: "Error", backgroundColor: "" })); })();