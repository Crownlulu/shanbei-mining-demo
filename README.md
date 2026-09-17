# shanbei-mining-demo
陕北矿业 · 职称评审申报系统（员工填报端演示原型）

线上地址：https://shanbei-demo.vercel.app （每次推送到 main 分支后，Vercel 自动构建并更新）

技术栈：Vite + React 18 + Ant Design 5

## 本地开发

```bash
npm install      # 第一次需要
npm run dev      # 本地预览，浏览器打开终端显示的地址
npm run build    # 本地试构建（可选，Vercel 会自动构建）
```

改完后正常 `git add` / `git commit` / `git push` 即可，不需要手动上传构建结果。

## 目录
- `src/data.js`：演示数据、填写说明、字段帮助（政策依据均为示例）
- `src/checks.js`：智能检查规则
- `src/status.js`：统一的状态文字和颜色
- `src/pages/`：工作台、申报表、提交前检查、申报记录、政策文件

## 历史版本
旧版单页 Demo（v2）保存在标签 `v2-legacy` 中：`git checkout v2-legacy` 可查看。

## 演示路线（约 5 分钟）
1. 工作台：条件自查显示继续教育学时不足
2. 申报表 → 申报信息：点“申报方式”的问号；切到“破格申报”并选依据，系统提示不成立，再切回
3. 逐项修正：证书编号、2025 学时、上传聘任文件、补获奖排名、业绩加数字
4. 提交前检查 → 勾选承诺 → 提交
5. 申报记录 → “模拟退回修改” → 重新上传业绩证明 → 重新提交
6. “模拟审核通过”，查看完整审批记录
