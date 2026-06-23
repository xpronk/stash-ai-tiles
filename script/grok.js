
var TITLE = "Grok";
var CHECK_URL = "https://grok.com";
var MODE = "normal";
var COUNTRY_MAP = {"US": "美国", "JP": "日本", "SG": "新加坡", "HK": "香港", "TW": "台湾", "KR": "韩国", "GB": "英国", "UK": "英国", "DE": "德国", "FR": "法国", "CA": "加拿大", "AU": "澳大利亚", "NL": "荷兰", "TR": "土耳其", "IN": "印度", "TH": "泰国", "MY": "马来西亚", "PH": "菲律宾", "ID": "印尼", "VN": "越南", "BR": "巴西", "AR": "阿根廷", "MX": "墨西哥", "CN": "中国", "MO": "澳门"};
var TICK = String(Date.now());

function statusCode(r){ return r ? (r.status || r.statusCode || 0) : 0; }
function cname(code, name){
  if (name && String(name).length > 0 && name !== 'undefined') return String(name);
  if (!code) return '未知地区';
  code = String(code).toUpperCase();
  return COUNTRY_MAP[code] || code;
}
function nowHHMM(){
  var d = new Date();
  function p(n){ return n < 10 ? '0' + n : '' + n; }
  return p(d.getHours()) + ':' + p(d.getMinutes());
}
function doneTile(label, country){
  var bg = label.indexOf('✅') === 0 ? '#16803C' : (label.indexOf('⚠️') === 0 ? '#B7791F' : '#8A1538');
  $done({ title: TITLE, content: label + ' · ' + country + ' · ' + nowHHMM(), backgroundColor: bg });
}
function addNoCache(url){ return url + (url.indexOf('?') >= 0 ? '&' : '?') + '_t=' + TICK; }
function httpGet(url, cb){
  $httpClient.get({
    url: addNoCache(url),
    headers: {
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
      'Accept': 'text/html,application/json,*/*',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    }
  }, cb);
}
function detectCountry(cb){
  httpGet('http://ip-api.com/json/?lang=zh-CN&fields=status,country,countryCode', function(e,r,d){
    try { var j=JSON.parse(d||'{}'); if(!e && j.status==='success') return cb(cname(j.countryCode, j.country)); } catch(x){}
    httpGet('https://ipwho.is/', function(e2,r2,d2){
      try { var j2=JSON.parse(d2||'{}'); if(!e2 && j2.success!==false) return cb(cname(j2.country_code, j2.country)); } catch(x){}
      httpGet('https://api.ip.sb/geoip', function(e3,r3,d3){
        try { var j3=JSON.parse(d3||'{}'); if(!e3) return cb(cname(j3.country_code, j3.country)); } catch(x){}
        cb('未知地区');
      });
    });
  });
}
function checkService(country){
  httpGet(CHECK_URL, function(error, response, data){
    var code = statusCode(response);
    var body = data || '';
    if (MODE === 'netflix') {
      if (error || code === 403 || code === 451 || code === 0) return doneTile('❌ 不可用', country);
      if (code === 404 || body.indexOf('Not Available') >= 0 || body.indexOf('not available') >= 0) return doneTile('⚠️ 仅自制', country);
      if (code >= 200 && code < 400) return doneTile('✅ 解锁', country);
      return doneTile('⚠️ 待确认', country);
    }
    var ok = !error && code >= 200 && code < 400;
    if (!ok && (code === 301 || code === 302 || code === 307 || code === 308)) ok = true;
    doneTile(ok ? '✅ 可用' : '❌ 不可用', country);
  });
}
detectCountry(checkService);
