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
  const { error, response, data } = await request(
    "GET",
    "https://www.youtube.com/premium?_=" + tik
  );
  if (error) { $done({ content: "Network Error", backgroundColor: "" }); return; }
  const d = String(data || "").toLowerCase();
  if (d.indexOf("youtube premium is not available in your country") >= 0) {
    $done({ content: "Not Available", backgroundColor: "" }); return;
  }
  if (d.indexOf("ad-free") < 0) {
    $done({ content: "Unknown", backgroundColor: "" }); return;
  }
  const { error: e2, data: d2 } = await request(
    "GET",
    "https://www.cloudflare.com/cdn-cgi/trace?_=" + tik
  );
  const cc = e2 ? "" : parseCFTrace(d2);
  $done({ content: cc ? "Available \u00b7 " + cc : "Available", backgroundColor: "#FF0000" });
}
(async () => { main().catch(() => $done({ content: "Error", backgroundColor: "" })); })();