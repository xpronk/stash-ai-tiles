// YouTube availability tile for Stash
var TITLE = "YouTube";
var CHECK_URL = "https://www.youtube.com/premium";
var COUNTRY_MAP = {"US": "美国", "JP": "日本", "SG": "新加坡", "HK": "香港", "TW": "台湾", "KR": "韩国", "GB": "英国", "DE": "德国", "FR": "法国", "CA": "加拿大", "AU": "澳大利亚", "NL": "荷兰", "TR": "土耳其", "IN": "印度", "TH": "泰国", "MY": "马来西亚", "PH": "菲律宾", "ID": "印尼", "VN": "越南", "BR": "巴西", "AR": "阿根廷", "MX": "墨西哥", "CN": "中国"};

function getStatus(response) {
  if (!response) return 0;
  return response.status || response.statusCode || 0;
}

function countryName(code) {
  if (!code) return '未知地区';
  code = String(code).toUpperCase();
  return COUNTRY_MAP[code] || code;
}

function doneTile(label, country) {
  var bg = label.indexOf('✅') === 0 ? '#16803C' : (label.indexOf('⚠️') === 0 ? '#B7791F' : '#8A1538');
  $done({
    title: TITLE,
    content: label + ' · ' + country,
    backgroundColor: bg
  });
}

function checkService(country) {
  var req = {
    url: CHECK_URL,
    headers: {
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
      'Accept': 'text/html,application/json,*/*'
    }
  };
  $httpClient.get(req, function(error, response, data) {
  var code = getStatus(response);
  var ok = !error && code >= 200 && code < 500;
  var label = ok ? '✅ 可用' : '❌ 不可用';
  doneTile(label, country);
  });
}

$httpClient.get('https://ipapi.co/json/', function(error, response, data) {
  var country = '未知地区';
  try {
    var info = JSON.parse(data || '{}');
    country = countryName(info.country_code || info.country);
  } catch (e) {}
  checkService(country);
});
