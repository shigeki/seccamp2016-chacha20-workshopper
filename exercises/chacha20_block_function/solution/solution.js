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

function QuarterRound(state, x, y, z, w) {
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

function ChaCha20InitState(key, nonce, count) {
  var i;
  var key_list = [];
  for(i = 0; i < key.length; i += 4) {
    var k = key.slice(i, i + 4);
    var b = new Buffer(4);
    b.writeUInt32BE(key.readUInt32LE(i), 0);
    key_list.push(b);
  }
  var nonce_list = [];
  for(i = 0; i < nonce.length; i += 4) {
    var b = new Buffer(4);
    b.writeUInt32BE(nonce.readUInt32LE(i), 0);
    nonce_list.push(b);
  }

  var state = [
    new Buffer('61707865', 'hex'),
    new Buffer('3320646e', 'hex'),
    new Buffer('79622d32', 'hex'),
    new Buffer('6b206574', 'hex'),
    key_list[0],
    key_list[1],
    key_list[2],
    key_list[3],
    key_list[4],
    key_list[5],
    key_list[6],
    key_list[7],
    count,
    nonce_list[0],
    nonce_list[1],
    nonce_list[2]
  ];
  return state;
}

function StateDup(a) {
  var b = [];
  for(var i = 0; i < a.length; i++) {
    var buf = new Buffer(4);
    a[i].copy(buf);
    b.push(buf);
  }
  return b;
}

function StatePlus(a, b) {
  var c = [];
  for(var i = 0; i < 16; i++) {
    var buf = new Buffer(4);
    buf.writeUInt32BE(Plus(a[i].readUInt32BE(0), b[i].readUInt32BE(0)), 0);
    c.push(buf);
  }
  return c;
}

var key = new Buffer('000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f', 'hex');
var nonce = new Buffer('000000090000004a00000000', 'hex');
var count = new Buffer('00000001', 'hex');

var init_state = ChaCha20InitState(key, nonce, count);
var state = StateDup(init_state);
for(var i = 0; i < 10; i++) {
  QuarterRound(state, 0, 4,  8, 12);
  QuarterRound(state, 1, 5,  9, 13);
  QuarterRound(state, 2, 6, 10, 14);
  QuarterRound(state, 3, 7, 11, 15);
  QuarterRound(state, 0, 5, 10, 15);
  QuarterRound(state, 1, 6, 11, 12);
  QuarterRound(state, 2, 7,  8, 13);
  QuarterRound(state, 3, 4,  9, 14);
}
var final_state = StatePlus(init_state, state);
console.log(final_state[0].toString('hex'));

/* Final State is
 0xe4e7f110  0x15593bd1  0x1fdd0f50  0xc47120a3
 0xc7f4d1c7  0x0368c033  0x9aaa2204  0x4e6cd4c3
 0x466482d2  0x09aa9f07  0x05d7c214  0xa2028bd9
 0xd19c12b5  0xb94e16de  0xe883d0cb  0x4e3c50a2
*/