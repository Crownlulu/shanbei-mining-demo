# shanbei-mining-demo
陕北矿业 · 职称评定智能助手 演示内容

## 本地化说明（2026-09-17）

`index.html` 原来通过 Google Fonts CDN 和 jsdelivr CDN 加载字体（Noto Sans SC + Inter）和 ECharts 5.4.3，
客户现场网络不稳定时有加载失败风险。现已改为引用 `assets/` 目录下的本地文件，部署到 Vercel 后无需
依赖外网 CDN 连通性。

- `assets/fonts/` — Inter（完整拉丁字符集）+ Noto Sans SC（按页面实际用字做了字符子集化，从约 6MB
  压缩到约 430KB；如何重新生成子集见 `assets/fonts/README.md`）
- `assets/js/echarts.min.js` — ECharts 5.4.3，从 npm 包本地化

已用 headless Chromium 截图验证字体与图表在本地正常渲染，无控制台报错。
