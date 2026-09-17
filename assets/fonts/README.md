# 字体本地化说明

`assets/fonts/` 下的字体文件是从 npm 包本地化并（对 Noto Sans SC）做了字符子集化的：

- `inter-*.woff2` — 来自 `@fontsource/inter`，未做子集化（拉丁字符集本身很小，24KB/字重）。
- `noto-sans-sc-*.woff2` — 来自 `@fontsource/noto-sans-sc`，用 `pyftsubset` 子集化为 `index.html`
  页面实际用到的汉字（约 550 个），每个字重压缩到 85-90KB（原始完整字符集约 1.1-1.2MB/字重）。

## 如果给 Demo 新增了中文文案，如何重新生成子集

新增的汉字如果不在当前子集里，浏览器会自动 fallback 到系统默认字体（不会报错，但字体会不统一）。
重新生成步骤：

```bash
npm install echarts@5.4.3 @fontsource/inter @fontsource/noto-sans-sc
pip install fonttools brotli --break-system-packages

python3 - <<'EOF'
import re
html = open("index.html", encoding="utf-8").read()
text = re.sub(r'<[^>]+>', ' ', html)
chars = set(ch for ch in text if ord(ch) > 0x2E80)
open("used_chars.txt", "w", encoding="utf-8").write(''.join(sorted(chars)))
EOF

for w in 300 400 500 600 700; do
  pyftsubset "node_modules/@fontsource/noto-sans-sc/files/noto-sans-sc-chinese-simplified-${w}-normal.woff2" \
    --output-file="assets/fonts/noto-sans-sc-${w}.woff2" \
    --text-file=used_chars.txt \
    --unicodes="U+0020-007E,U+2018,U+2019,U+201C,U+201D,U+2013,U+2014,U+2026,U+3000-303F,U+FF00-FFEF" \
    --flavor=woff2 --layout-features='*'
done
```

或者，如果不想折腾子集化，可以直接把完整字符集的文件（`node_modules/@fontsource/noto-sans-sc/files/*-normal.woff2`）
拷过来覆盖，牺牲一点体积（约 6MB 总量）换取不用管字符覆盖问题。
