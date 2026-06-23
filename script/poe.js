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
    "https://poe.com?_=" + tik
  );
  if (error) { $done({ content: "Network Error", backgroundColor: "" }); return; }
  const s = response ? (response.status || response.statusCode || 0) : 0;
  if (!((s >= 200 && s < 500) || s === 401 || s === 403)) {
    $done({ content: "Not Available", backgroundColor: "" }); return;
  }
  const { error: e2, data: d2 } = await request(
    "GET",
    "https://www.cloudflare.com/cdn-cgi/trace?_=" + tik
  );
  const cc = e2 ? "" : parseCFTrace(d2);
  $done({ content: cc ? "Available \u00b7 " + cc : "Available", backgroundColor: "#FF0000" });
}
(async () => { main().catch(() => $done({ content: "Error", backgroundColor: "" })); })();