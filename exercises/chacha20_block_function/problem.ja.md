# 課題
ChaCha20 は3種類の入力値が必要です。

鍵(key): 32バイト
ブロックカウンタ: ４バイト
Nonce: 12バイト

この入力値から、それぞれ4バイト単位でLittle Endian形式で読み込み、

cccccccc  cccccccc  cccccccc  cccccccc
kkkkkkkk  kkkkkkkk  kkkkkkkk  kkkkkkkk
kkkkkkkk  kkkkkkkk  kkkkkkkk  kkkkkkkk
bbbbbbbb  nnnnnnnn  nnnnnnnn  nnnnnnnn

c=定数 k=鍵 b=カウンタ n=Nonce

という初期状態を作ります。
ここで定数Cは、 ４バイト(0x61707865, 0x3320646e, 0x79622d32, 0x6b206574)=('expand 32-byte k')です。

この初期状態の ChaCha20 state に以下の8つのQUATERROUNTERの操作を

+ QUARTERROUND ( 0, 4, 8,12)
+ QUARTERROUND ( 1, 5, 9,13)
+ QUARTERROUND ( 2, 6,10,14)
+ QUARTERROUND ( 3, 7,11,15)
+ QUARTERROUND ( 0, 5,10,15)
+ QUARTERROUND ( 1, 6,11,12)
+ QUARTERROUND ( 2, 7, 8,13)
+ QUARTERROUND ( 3, 4, 9,14)

2ラウンドとして演算します。これを10回繰り返した状態と操作前の初期状態と2^32の剰余加算を行いChaCha20 stateが求まります。

入直値の Key, Nonce, Block Count が

Key:  000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f
Nonce: 000000090000004a00000000
Block Count: 1

の場合、ChaCha20 State の初期状態は、

 0x61707865  0x3320646e  0x79622d32  0x6b206574
 0x03020100  0x07060504  0x0b0a0908  0x0f0e0d0c
 0x13121110  0x17161514  0x1b1a1918  0x1f1e1d1c
 0x00000001  0x09000000  0x4a000000  0x00000000

になります。この初期状態から20ラウンドと初期状態との剰余加算した新しいChaCha20 Stateを求めなさい。

ChaCha Stateの16個の4バイト要素のうち0番目(一番先頭)のデータを16進数の文字列にして標準出力に出力しなさい。
