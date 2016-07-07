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


var a = 0x11111111;
var b = 0x01020304;
var c = 0x77777777;
var d = 0x01234567;

c = Plus(c, d);
b = b ^ c;
b = LeftRotate(b, 7);
console.log(b);
