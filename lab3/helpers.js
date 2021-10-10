const utf8ToBin = function (s) {
  s = unescape(encodeURIComponent(s));
  var chr,
    i = 0,
    l = s.length,
    out = '';
  for (; i < l; i++) {
    chr = s.charCodeAt(i).toString(2);
    while (chr.length % 8 != 0) {
      chr = '0' + chr;
    }
    out += chr;
  }
  return out;
};

// Binary to UTF-8
const binToUtf8 = function (s) {
  var i = 0,
    l = s.length,
    chr,
    out = '';
  for (; i < l; i += 8) {
    chr = parseInt(s.substr(i, 8), 2).toString(16);
    out += '%' + (chr.length % 2 == 0 ? chr : '0' + chr);
  }
  return decodeURIComponent(out);
};

module.exports = { binToUtf8, utf8ToBin };
