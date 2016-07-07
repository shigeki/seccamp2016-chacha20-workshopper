const assert = require('assert');
const uint32 = 0xffffffff;
const fourbytes = 0xffffffff + 1;


function LeftRotate(x, n) {
  assert(n > 0);
  assert(32 > n);
  var lowmask = uint32 >>> n;
  var himask = (~lowmask & uint32) >>> 0;
  var xhi = (x & himask) >>> 32 - n;
  var xlow = ((x & lowmask) << n) >>> 0;
  var ret = Plus(xhi, xlow);
  return ret;
}


function Plus(a, b) {
  a += b;
  a %= fourbytes;
  return a;
}


function RoundOperation(a, b, c, d) {
  // 1.
  a = Plus(a, b);
  d ^= a;
  d = LeftRotate(d, 16);
  // 2.
  c = Plus(c, d);
  b ^= c;
  b = LeftRotate(b, 12);
  // 3.
  a = Plus(a, b);
  d ^= a;
  d = LeftRotate(d, 8);
  // 4.
  c = Plus(c, d);
  b ^= c;
  b = LeftRotate(b, 7);
  var buf = new Buffer(16);
  buf.writeUInt32BE(a, 0);
  buf.writeUInt32BE(b, 4);
  buf.writeUInt32BE(c, 8);
  buf.writeUInt32BE(d, 12);
  return buf;
}

var a = 0x11111111;
var b = 0x01020304;
var c = 0x9b8d6f43;
var d = 0x01234567;

var r = RoundOperation(a, b, c, d);

console.log(r.toString('hex'));
