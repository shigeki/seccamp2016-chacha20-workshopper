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


function RoundOperation(array) {
  var a = array[0].readUInt32BE(0);
  var b = array[1].readUInt32BE(0);
  var c = array[2].readUInt32BE(0);
  var d = array[3].readUInt32BE(0);

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

  array[0].writeUInt32BE(a, 0);
  array[1].writeUInt32BE(b, 0);
  array[2].writeUInt32BE(c, 0);
  array[3].writeUInt32BE(d, 0);
}

function QUARTERROUND(state, x, y, z, w) {
  var data = [];
  data[0] = state[x];
  data[1] = state[y];
  data[2] = state[z];
  data[3] = state[w];
  RoundOperation(data);
  state[x] = data[0];
  state[y] = data[1];
  state[z] = data[2];
  state[w] = data[3];
}

var chacha_state = [
  new Buffer('879531e0', 'hex'),
  new Buffer('c5ecf37d', 'hex'),
  new Buffer('516461b1', 'hex'),
  new Buffer('c9a62f8a', 'hex'),
  new Buffer('44c20ef3', 'hex'),
  new Buffer('3390af7f', 'hex'),
  new Buffer('d9fc690b', 'hex'),
  new Buffer('2a5f714c', 'hex'),
  new Buffer('53372767', 'hex'),
  new Buffer('b00a5631', 'hex'),
  new Buffer('974c541a', 'hex'),
  new Buffer('359e9963', 'hex'),
  new Buffer('5c971061', 'hex'),
  new Buffer('3d631689', 'hex'),
  new Buffer('2098d9d6', 'hex'),
  new Buffer('91dbd320', 'hex')
];

QUARTERROUND(chacha_state, 2, 7, 8, 13);

console.log(Buffer.concat(chacha_state).toString('hex'));
