async function request(method, params) {
  return new Promise((resolve) => {
    $httpClient[method.toLowerCase()](params, (error, response, data) => {
      resolve({ error, response, data });
    });
  });
}

function parseCFTrace(text) {
  var m = (text || "").match(/loc=([A-Z]{2})/);
  return m ? m[1] : "";
}

async function main() {
  const tik = Date.now();
  const { error, response } = await request(
    "GET",
    "https://www.netflix.com/?_=" + tik
  );
  if (error) { $done({ content: "Network Error", backgroundColor: "#E50914" }); return; }
  const s = response ? (response.status || response.statusCode || 0) : 0;
  if (!((s >= 200 && s < 500) || s === 401 || s === 403)) {
    $done({ content: "Not Available", backgroundColor: "#E50914" }); return;
  }
  var cc = "";
  var h = response && response.headers ? response.headers : {};
  var u = h["X-Originating-Url"] || h["x-originating-url"] || "";
  var m = u.match(/netflix\.com\/([a-z]{2}(?:-[a-z]{2})?)\b/i);
  if (m) cc = m[1].toUpperCase();
  if (!cc) {
    var loc = h["Location"] || h["location"] || "";
    m = loc.match(/netflix\.com\/([a-z]{2}(?:-[a-z]{2})?)\b/i);
    if (m) cc = m[1].toUpperCase();
  }
  $done({ content: cc ? "Available \u00b7 " + cc : "Available", backgroundColor: "#E50914" });
}
(async () => { main().catch(() => $done({ content: "Error", backgroundColor: "#E50914" })); })();