const uint32 = 0xffffffff;
const fourbytes = 0xffffffff + 1;


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
console.log(b);
