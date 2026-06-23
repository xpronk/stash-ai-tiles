
var TITLE = "Claude";
var CHECK_URL = "https://claude.ai";
var MODE = "normal";
var COUNTRY_MAP = {"US": "美国", "JP": "日本", "SG": "新加坡", "HK": "香港", "TW": "台湾", "KR": "韩国", "GB": "英国", "UK": "英国", "DE": "德国", "FR": "法国", "CA": "加拿大", "AU": "澳大利亚", "NL": "荷兰", "TR": "土耳其", "IN": "印度", "TH": "泰国", "MY": "马来西亚", "PH": "菲律宾", "ID": "印尼", "VN": "越南", "BR": "巴西", "AR": "阿根廷", "MX": "墨西哥", "CN": "中国", "MO": "澳门"};
var TICK = String(Date.now());

function code(r){ return r ? (r.status || r.statusCode || 0) : 0; }
function addTick(u){ return u + (u.indexOf('?') >= 0 ? '&' : '?') + '_t=' + TICK; }
function cname(c){ if(!c) return '未知地区'; c=String(c).toUpperCase(); return COUNTRY_MAP[c] || c; }
function hhmm(){ var d=new Date(); var h=d.getHours(); var m=d.getMinutes(); return (h<10?'0':'')+h+':' +(m<10?'0':'')+m; }
function done(label,country){
  var bg = label.indexOf('✅')===0 ? '#16803C' : (label.indexOf('⚠️')===0 ? '#B7791F' : '#8A1538');
  $done({title:TITLE, content:label+' · '+country+' · '+hhmm(), backgroundColor:bg});
}
function getCountry(cb){
  // Stash 对 object 参数不稳定，必须用纯 URL 字符串
  $httpClient.get(addTick('https://api.country.is/'), function(e,r,d){
    try { var j=JSON.parse(d||'{}'); if(!e && j.country) return cb(cname(j.country)); } catch(x) {}
    $httpClient.get(addTick('http://ip-api.com/json/?fields=status,countryCode'), function(e2,r2,d2){
      try { var j2=JSON.parse(d2||'{}'); if(!e2 && j2.countryCode) return cb(cname(j2.countryCode)); } catch(x) {}
      cb('未知地区');
    });
  });
}
function check(country){
  $httpClient.get(addTick(CHECK_URL), function(e,r,d){
    var s=code(r); var body=d||'';
    if(MODE==='netflix'){
      if(e || s===0 || s===403 || s===451) return done('❌ 不可用', country);
      if(s===404 || body.indexOf('Not Available')>=0 || body.indexOf('not available')>=0) return done('⚠️ 仅自制', country);
      if(s>=200 && s<400) return done('✅ 解锁', country);
      return done('⚠️ 待确认', country);
    }
    var ok = !e && ((s>=200 && s<400) || s===401 || s===403);
    done(ok ? '✅ 可用' : '❌ 不可用', country);
  });
}
getCountry(check);
