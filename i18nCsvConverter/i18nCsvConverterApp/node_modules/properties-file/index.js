exports.parse = function(string) {
  var object = {};
  string.split(/(\n|\r\n)/).forEach(function(s) {
    s = s.trim();
    if(!s) {
      return;
    }
    var eqIndex = s.indexOf("=");
    if(eqIndex < 0) {
      return;
    }
    var key = s.substr(0, eqIndex).trim();
    var value = s.substr(eqIndex + 1).trim();
    object[key] = value;
  });
  return object;
};

exports.stringify = function(object) {
  var strings = [];
  for(var k in object) {
    strings.push(k + "=" + object[k]);
  }
  return strings.join("\n");
};