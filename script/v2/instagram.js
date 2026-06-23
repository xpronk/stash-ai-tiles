async function request(method, params) {
  return new Promise((resolve) => {
    $httpClient[method.toLowerCase()](params, (error, response, data) => {
      resolve({ error, response, data });
    });
  });
}

async function main() {
  const tik = Date.now();
  const { error, response } = await request(
    "GET",
    "https://www.instagram.com?_=" + tik
  );
  if (error) { $done({ content: "Network Error", backgroundColor: "#E4405F" }); return; }
  const s = response ? (response.status || response.statusCode || 0) : 0;
  if ((s >= 200 && s < 500) || s === 401 || s === 403) {
    $done({ content: "Available", backgroundColor: "#E4405F" });
  } else {
    $done({ content: "Not Available", backgroundColor: "#E4405F" });
  }
}
(async () => { main().catch(() => $done({ content: "Error", backgroundColor: "#E4405F" })); })();