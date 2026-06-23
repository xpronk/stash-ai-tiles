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
  const tik = Date.now();
  const { error, response, data } = await request(
    "GET",
    "https://poe.com" + "?" + "_=" + tik
  );
  if (error) { $done({ content: "Network Error", backgroundColor: "" }); return; }
  const s = response ? (response.status || response.statusCode || 0) : 0;
  if ((s >= 200 && s < 500) || s === 401 || s === 403) {
    const cc = getCountry(response);
    $done({ content: cc ? "Available · " + cc : "Available", backgroundColor: "#FF0000" });
  } else {
    $done({ content: "Not Available", backgroundColor: "" });
  }
}
(async () => { main().catch(() => $done({ content: "Error", backgroundColor: "" })); })();