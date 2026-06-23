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
    request("GET", "https://www.youtube.com/premium?_=" + tik)
  ]);
  let cc = "";
  try { const j = JSON.parse(cr.data || "{}"); if (j.country) cc = String(j.country).toUpperCase(); } catch(e) {}
  if (sr.error) { $done({ content: "Network Error", backgroundColor: "" }); return; }
  const d = String(sr.data || "").toLowerCase();
  if (d.indexOf("youtube premium is not available in your country") >= 0) {
    $done({ content: "Not Available", backgroundColor: "" }); return;
  }
  if (d.indexOf("ad-free") >= 0) {
    $done({ content: cc ? "Available \u00b7 " + cc : "Available", backgroundColor: "#FF0000" }); return;
  }
  $done({ content: "Unknown", backgroundColor: "" });
}
(async () => { main().catch(() => $done({ content: "Error", backgroundColor: "" })); })();