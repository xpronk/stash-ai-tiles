async function request(method, params) {
  return new Promise((resolve) => {
    $httpClient[method.toLowerCase()](params, (error, response, data) => {
      resolve({ error, response, data });
    });
  });
}

async function checkTitle(id) {
  const r = await request("GET", "https://www.netflix.com/title/" + id);
  if (r.error) return "";
  const headers = (r.response || {}).headers || {};
  const url = headers["X-Originating-Url"] || headers["x-originating-url"] || "";
  if (!url) return "";
  const parts = url.split("/");
  const loc = parts[3];
  if (loc === "title") return "US";
  return (loc && loc.split("-")[0] || "").toUpperCase();
}

async function main() {
  var c = await checkTitle(70143836);
  if (c) { $done({ content: "No Restriction (" + c + ")", backgroundColor: "#E50914" }); return; }
  c = await checkTitle(80197526);
  if (c) { $done({ content: "Originals Only (" + c + ")", backgroundColor: "#E50914" }); return; }
  $done({ content: "Not Available", backgroundColor: "" });
}
(async () => { main().catch(() => $done({ content: "Error", backgroundColor: "" })); })();