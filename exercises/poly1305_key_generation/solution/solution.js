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

function ChaCha20Block(key, nonce, count) {
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
  return StatePlus(init_state, state);
}

function ChaCha20KeyStream(key, nonce, count_buf) {
  var key_stream = new Buffer(64);
  var state = ChaCha20Block(key, nonce, count_buf);
  for(var i = 0; i < state.length; i++) {
    key_stream.writeUInt32BE(state[i].readUInt32LE(0), 4*i);
  }
  return key_stream;
}


var key = new Buffer('808182838485868788898a8b8c8d8e8f909192939495969798999a9b9c9d9e9f', 'hex');
var nonce = new Buffer('000000000001020304050607', 'hex');
var counter = (new Buffer(4)).fill(0);

var block = ChaCha20KeyStream(key, nonce, counter);

console.log(block.slice(0, 32).toString('hex'));
