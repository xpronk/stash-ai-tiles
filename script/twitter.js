async function request(method, params) {
  return new Promise((resolve) => {
    $httpClient[method.toLowerCase()](params, (error, response, data) => {
      resolve({ error, response, data });
    });
  });
}

function parseCountry(data) {
  if (!data) return "";
  try {
    const j = JSON.parse(data);
    if (j.country) return String(j.country).toUpperCase();
    if (j.country_code) return String(j.country_code).toUpperCase();
    if (j.alpha2) return String(j.alpha2).toUpperCase();
    if (j.code) return String(j.code).toUpperCase();
  } catch(e) {}
  return "";
}

async function getCountry() {
  const tik = Date.now();
  const [r1, r2] = await Promise.all([
    request("GET", "https://api.ip.sb/geoip?_=" + tik),
    request("GET", "https://api.country.is/?t=" + tik)
  ]);
  return parseCountry(r1.data || "") || parseCountry(r2.data || "") || "";
}

// https://x.com and ? inserted by build script
async function main() {
  const tik = Date.now();
  const [cc, sr] = await Promise.all([
    getCountry(),
    request("GET", "https://x.com" + "?" + "_=" + tik)
  ]);
  if (sr.error) { $done({ content: "Network Error", backgroundColor: "" }); return; }
  const s = sr.response ? (sr.response.status || sr.response.statusCode || 0) : 0;
  if ((s >= 200 && s < 500) || s === 401 || s === 403) {
    $done({ content: cc ? "Available \u00b7 " + cc : "Available", backgroundColor: "#FF0000" });
  } else {
    $done({ content: "Not Available", backgroundColor: "" });
  }
}
(async () => { main().catch(() => $done({ content: "Error", backgroundColor: "" })); })();