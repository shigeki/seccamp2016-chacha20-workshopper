# 課題
ChaCha20-Poly1305でAEADを構成する場合、Poly1305Macで利用する鍵はカウンター値０のKeyStreamを用います。

ChaCha20鍵: 808182838485868788898a8b8c8d8e8f909192939495969798999a9b9c9d9e9f
Nonce: 000000000001020304050607

の場合にPoly1305Macで利用する鍵を16進数の文字列にして標準出力に出力しなさい。
