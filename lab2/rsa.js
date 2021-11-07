const { BigInteger } = require('jsbn');
var crypto = require('crypto');

function parseBigInt(str, r) {
  return new BigInteger(str, r);
}

function linebrk(buf, n) {
  var s = buf.toString('ascii');
  var ret = '';
  var i = 0;
  while (i + n < s.length) {
    ret += s.substring(i, i + n) + '\n';
    i += n;
  }
  return ret + s.substring(i, s.length);
}

// PKCS#1 (type 2, random) pad input string s to n bytes, and return a bigint
function pkcs1pad2(s, n) {
  if (n < s.length + 11) {
    throw new Error(
      'Message too long for RSA (n=' + n + ', l=' + s.length + ')'
    );
    return null;
  }
  var ba = new Array();
  var i = s.length - 1;
  while (i >= 0 && n > 0) {
    var c = s.charCodeAt(i--);
    if (c < 128) {
      ba[--n] = c;
    } else if (c > 127 && c < 2048) {
      ba[--n] = (c & 63) | 128;
      ba[--n] = (c >> 6) | 192;
    } else {
      ba[--n] = (c & 63) | 128;
      ba[--n] = ((c >> 6) & 63) | 128;
      ba[--n] = (c >> 12) | 224;
    }
  }
  ba[--n] = 0;
  var rng = new SecureRandom();
  var x = new Array();
  while (n > 2) {
    // random non-zero pad
    x[0] = 0;
    while (x[0] == 0) rng.nextBytes(x);
    ba[--n] = x[0];
  }
  ba[--n] = 2;
  ba[--n] = 0;
  return new BigInteger(ba);
}

// Undo PKCS#1 (type 2, random) padding and, if valid, return the plaintext
function pkcs1unpad2(d, n) {
  var b = d.toByteArray();
  var i = 0;
  while (i < b.length && b[i] == 0) ++i;

  if (b.length - i != n - 1 || b[i] != 2) return null;
  ++i;
  while (b[i] != 0) if (++i >= b.length) return null;

  var ret = [];
  while (++i < b.length) {
    var c = b[i] & 255;
    ret.push(c);
  }
  return new Buffer(ret);
}

class SecureRandom {
  nextBytes(ba) {
    var random = crypto.randomBytes(ba.length);
    for (var i = 0; i < ba.length; ++i) {
      ba[i] = random[i];
    }
  }
}

class RSAKey {
  constructor() {
    this.n = null;
    this.e = 0;
    this.d = null;
    this.p = null;
    this.q = null;
    this.dmp1 = null;
    this.dmq1 = null;
    this.coeff = null;
  }

  generate(B, E) {
    var rng = new SecureRandom();
    var qs = B >> 1;
    this.e = parseInt(E, 16);
    var ee = new BigInteger(E, 16);
    while (true) {
      while (true) {
        this.p = new BigInteger(B - qs, 1, rng);
        if (
          this.p.subtract(BigInteger.ONE).gcd(ee).compareTo(BigInteger.ONE) ==
            0 &&
          this.p.isProbablePrime(10)
        ) {
          break;
        }
      }
      while (true) {
        this.q = new BigInteger(qs, 1, rng);
        if (
          this.q.subtract(BigInteger.ONE).gcd(ee).compareTo(BigInteger.ONE) ==
            0 &&
          this.q.isProbablePrime(10)
        ) {
          break;
        }
      }
      if (this.p.compareTo(this.q) <= 0) {
        var t = this.p;
        this.p = this.q;
        this.q = t;
      }
      var p1 = this.p.subtract(BigInteger.ONE);
      var q1 = this.q.subtract(BigInteger.ONE);
      var phi = p1.multiply(q1);
      if (phi.gcd(ee).compareTo(BigInteger.ONE) == 0) {
        this.n = this.p.multiply(this.q);
        this.d = ee.modInverse(phi);
        this.dmp1 = this.d.mod(p1);
        this.dmq1 = this.d.mod(q1);
        this.coeff = this.q.modInverse(this.p);
        break;
      }
    }
  }

  // Return the PKCS#1 RSA decryption of "ctext".
  // "ctext" is an even-length hex string and the output is a plain string.

  decrypt(ctext) {
    var c = parseBigInt(ctext, 16);
    var m = this.doPrivate(c);
    if (m == null) {
      return null;
    }
    return pkcs1unpad2(m, (this.n.bitLength() + 7) >> 3);
  }

  // Return the PKCS#1 RSA encryption of "text" as an even-length hex string
  encrypt(text) {
    var m = pkcs1pad2(text, (this.n.bitLength() + 7) >> 3);
    if (m == null) {
      return null;
    }
    var c = this.doPublic(m);
    if (c == null) {
      return null;
    }
    var h = c.toString(16);
    if ((h.length & 1) == 0) {
      return h;
    } else {
      return '0' + h;
    }
  }

  // Perform raw public operation on "x": return x^e (mod n)
  doPublic(x) {
    return x.modPowInt(this.e, this.n);
  }

  // Perform raw private operation on "x": return x^d (mod n)
  doPrivate(x) {
    if (this.p == null || this.q == null) return x.modPow(this.d, this.n);

    var xp = x.mod(this.p).modPow(this.dmp1, this.p);
    var xq = x.mod(this.q).modPow(this.dmq1, this.q);

    while (xp.compareTo(xq) < 0) {
      xp = xp.add(this.p);
    }
    return xp
      .subtract(xq)
      .multiply(this.coeff)
      .mod(this.p)
      .multiply(this.q)
      .add(xq);
  }
}

module.exports = { RSAKey, linebrk };
