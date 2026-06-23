const TITLE = "X / Twitter";
const CHECK_URL = "https://x.com";
const MODE = "normal";
const COUNTRY_MAP = {"US": "美国", "JP": "日本", "SG": "新加坡", "HK": "香港", "TW": "台湾", "KR": "韩国", "GB": "英国", "UK": "英国", "DE": "德国", "FR": "法国", "CA": "加拿大", "AU": "澳大利亚", "NL": "荷兰", "TR": "土耳其", "IN": "印度", "TH": "泰国", "MY": "马来西亚", "PH": "菲律宾", "ID": "印尼", "VN": "越南", "BR": "巴西", "AR": "阿根廷", "MX": "墨西哥", "CN": "中国", "MO": "澳门"};

function request(method, params) {
  return new Promise((resolve) => {
    const httpMethod = $httpClient[method.toLowerCase()];
    httpMethod(params, (error, response, data) => {
      resolve({ error, response, data });
    });
  });
}

function hhmm() {
  const d = new Date();
  const p = (n) => n < 10 ? '0' + n : '' + n;
  return p(d.getHours()) + ':' + p(d.getMinutes());
}

function code(response) {
  return response ? (response.status || response.statusCode || 0) : 0;
}

function countryName(c) {
  if (!c) return '未知地区';
  c = String(c).toUpperCase();
  return COUNTRY_MAP[c] || c;
}

function finish(content, color) {
  $done({ content: content + ' · ' + hhmm(), backgroundColor: color || '' });
}

async function main() {
  if (MODE === 'region') {
    const r = await request('GET', CHECK_URL + '?t=' + Date.now());
    if (r.error) return finish('❌ 地区检测失败', '#8A1538');
    try {
      const j = JSON.parse(r.data || '{}');
      return finish('🌐 ' + countryName(j.country), '#2563EB');
    } catch (e) {
      return finish('❌ 地区检测失败', '#8A1538');
    }
  }

  const r = await request('GET', CHECK_URL + (CHECK_URL.indexOf('?') >= 0 ? '&' : '?') + 't=' + Date.now());
  const s = code(r.response);
  const data = String(r.data || '');

  if (r.error) return finish('Network Error', '#8A1538');

  if (MODE === 'netflix') {
    if (s === 403 || s === 451 || s === 0) return finish('❌ 不可用', '#8A1538');
    if (s === 404 || data.toLowerCase().includes('not available')) return finish('⚠️ 仅自制', '#B7791F');
    if (s >= 200 && s < 400) return finish('✅ 解锁', '#16803C');
    return finish('⚠️ 待确认', '#B7791F');
  }

  if (MODE === 'youtube') {
    const lower = data.toLowerCase();
    if (lower.includes('youtube premium is not available in your country')) return finish('❌ 不可用', '#8A1538');
    if (s >= 200 && s < 500) return finish('✅ 可用', '#16803C');
    return finish('❌ 不可用', '#8A1538');
  }

  if ((s >= 200 && s < 500) || s === 401 || s === 403) return finish('✅ 可用', '#16803C');
  return finish('❌ 不可用', '#8A1538');
}

(async () => {
  main().catch((e) => {
    $done({ content: 'Script Error · ' + hhmm(), backgroundColor: '#8A1538' });
  });
})();
