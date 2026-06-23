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
  return parseCountry(r1.data || "") || parseCountry(r2.data || "") || "??";
}

async function main() {
  const cc = await getCountry();
  $done({ content: cc || "??", backgroundColor: cc && cc !== "??" ? "#2563EB" : "" });
}
(async () => { main().catch(() => $done({ content: "??", backgroundColor: "" })); })();