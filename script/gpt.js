async function request(method, params) {
  return new Promise((resolve) => {
    $httpClient[method.toLowerCase()](params, (error, response, data) => {
      resolve({ error, response, data });
    });
  });
}

async function main() {
  const tik = Date.now();
  const [cr, sr] = await Promise.all([
    request("GET", "https://api.country.is/?t=" + tik),
    request("GET", "https://api.openai.com/compliance/cookie_requirements?_=" + tik)
  ]);
  let cc = "";
  try { const j = JSON.parse(cr.data || "{}"); if (j.country) cc = String(j.country).toUpperCase(); } catch(e) {}
  if (sr.error) { $done({ content: "Network Error", backgroundColor: "" }); return; }
  if (String(sr.data || "").toLowerCase().indexOf("unsupported_country") >= 0) {
    $done({ content: "Unsupported", backgroundColor: "" }); return;
  }
  $done({ content: cc ? "Available \u00b7 " + cc : "Available", backgroundColor: "#88A788" });
}
(async () => { main().catch(() => $done({ content: "Error", backgroundColor: "" })); })();