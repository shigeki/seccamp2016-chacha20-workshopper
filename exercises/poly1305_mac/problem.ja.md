# 課題
seccamp2016-tls-poly1305 モジュールの Poly1305Mac(msg, key) 関数を使って以下のメーッセージの Poly1305 の Mac 値を計算しなさい。

鍵(Hex文字列): 85d6be7857556d337f4452fe42d506a80103808afb0db2fd4abff6af4149f51b
メッセージ:   Cryptographic Forum Research Group

入力(msg, key)とMac計算の出力は共に Buffer 型データになります。

MACデータは、16進数の文字列にして標準出力に出力しなさい。

(hint)
モジュールインストールの仕方
npm install seccamp2016-tls-poly1305

関数の呼び出し方
const Poly1305 = require('seccamp2016-tls-poly1305');
const Poly1305Mac = Poly1305.Poly1305Mac;
