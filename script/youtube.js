async function request(method, params) {
  return new Promise((resolve) => {
    $httpClient[method.toLowerCase()](params, (error, response, data) => {
      resolve({ error, response, data });
    });
  });
}

function getCountry(response) {
  if (!response || !response.headers) return "";
  var h = response.headers;
  return (h["cf-ipcountry"] || h["CF-IPCountry"] || h["x-geo-country"] ||
          h["X-Geo-Country"] || h["x-region"] || h["X-Region"] ||
          h["cloudfront-viewer-country"] || "").toUpperCase();
}

async function main() {
  const { error, response, data } = await request(
    "GET",
    "https://www.youtube.com/premium?_=" + Date.now()
  );
  if (error) { $done({ content: "Network Error", backgroundColor: "" }); return; }
  const d = String(data || "").toLowerCase();
  const cc = getCountry(response);
  if (d.indexOf("youtube premium is not available in your country") >= 0) {
    $done({ content: "Not Available", backgroundColor: "" }); return;
  }
  if (d.indexOf("ad-free") >= 0) {
    $done({ content: cc ? "Available · " + cc : "Available", backgroundColor: "#FF0000" }); return;
  }
  $done({ content: "Unknown", backgroundColor: "" });
}
(async () => { main().catch(() => $done({ content: "Error", backgroundColor: "" })); })();