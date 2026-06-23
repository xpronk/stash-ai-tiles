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
    "https://api.openai.com/compliance/cookie_requirements?_=" + Date.now()
  );
  if (error) { $done({ content: "Network Error", backgroundColor: "" }); return; }
  const cc = getCountry(response);
  if (String(data || "").toLowerCase().indexOf("unsupported_country") >= 0) {
    $done({ content: "Unsupported", backgroundColor: "" }); return;
  }
  $done({ content: cc ? "Available · " + cc : "Available", backgroundColor: "#88A788" });
}
(async () => { main().catch(() => $done({ content: "Error", backgroundColor: "" })); })();