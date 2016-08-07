const Poly1305 = require('seccamp2016-tls-poly1305');

const key = new Buffer('85d6be7857556d337f4452fe42d506a80103808afb0db2fd4abff6af4149f51b', 'hex');
const msg = new Buffer('Cryptographic Forum Research Group');
var tag = Poly1305.Poly1305Mac(msg, key);
console.log(tag.toString('hex'));