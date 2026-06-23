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
    request("GET", "https://poe.com" + "?" + "_=" + tik)
  ]);
  let cc = "";
  try { const j = JSON.parse(cr.data || "{}"); if (j.country) cc = String(j.country).toUpperCase(); } catch(e) {}
  if (sr.error) { $done({ content: "Network Error", backgroundColor: "" }); return; }
  const s = sr.response ? (sr.response.status || sr.response.statusCode || 0) : 0;
  if ((s >= 200 && s < 500) || s === 401 || s === 403) {
    $done({ content: cc ? "Available · " + cc : "Available", backgroundColor: "#FF0000" });
  } else {
    $done({ content: "Not Available", backgroundColor: "" });
  }
}
(async () => { main().catch(() => $done({ content: "Error", backgroundColor: "" })); })();
