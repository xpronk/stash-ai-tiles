async function request(method, params) {
  return new Promise((resolve, reject) => {
    const httpMethod = $httpClient[method.toLowerCase()];
    httpMethod(params, (error, response, data) => {
      resolve({ error, response, data });
    });
  });
}

async function main() {
  const { error, response, data } = await request(
    "GET",
    "https://claude.ai/login"
  );

  if (error) {
    $done({ content: "Network Error", backgroundColor: "" });
    return;
  }

  if (response.status >= 200 && response.status < 400) {
    $done({ content: "Available", backgroundColor: "#88A788" });
  } else {
    $done({ content: "Blocked", backgroundColor: "" });
  }
}

(async () => {
  main()
    .then((_) => {})
    .catch((error) => {
      $done({});
    });
})();