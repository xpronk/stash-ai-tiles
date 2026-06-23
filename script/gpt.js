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
    "https://api.openai.com/compliance/cookie_requirements?_=" + tik
  );
  if (error) { $done({ content: "Network Error", backgroundColor: "" }); return; }
  if (String(data || "").toLowerCase().indexOf("unsupported_country") >= 0) {
    $done({ content: "Unsupported", backgroundColor: "" }); return;
  }
  const { error: e2, data: d2 } = await request(
    "GET",
    "https://www.cloudflare.com/cdn-cgi/trace?_=" + tik
  );
  const cc = e2 ? "" : parseCFTrace(d2);
  $done({ content: cc ? "Available \u00b7 " + cc : "Available", backgroundColor: "#88A788" });
}
(async () => { main().catch(() => $done({ content: "Error", backgroundColor: "" })); })();