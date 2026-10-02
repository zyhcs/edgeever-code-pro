# EdgeEver Code Pro

> 专为 EdgeEver 打造的专业级语法高亮与现代代码块体验增强插件。

---

## ✨ 核心特性

- 💎 **完整 SAP ABAP 语法支持**：基于 Prism.js 官方标准 ABAP 语法规则，精准识别 OpenSQL、内表操作（`LOOP AT`、`READ TABLE`）、函数与类定义（`FORM/ENDFORM`、`MODULE`、`METHOD`）、数据声明（`DATA`、`TYPES`、`TABLES`）及系统变量（`SY-*`）。
- 🌐 **多语系开箱即用**：同时内置支持 JavaScript、TypeScript、Python、SQL、JSON、Bash/Shell 等主流技术栈。
- 🖥️ **Mac 窗口风格代码栏**：红黄绿经典三色点，搭配精致的圆角卡片化边框与轻微外阴影。
- 🏷️ **代码语言提示徽标**：代码块左上角清晰标注当前语言（`ABAP`、`PYTHON` 等）。
- 📋 **平滑一键复制代码**：右上角配备幽灵按钮，点击自动复制并给予 `✓ 已复制` 状态动效反馈。
- 🔢 **美观无侵入行号**：支持行号列（Line Numbers），复制内容时纯净无杂质，不选中文本行号。
- 🎨 **多款经典主题切换**：内置 One Dark Pro、GitHub Dark、Tokyo Night、GitHub Light 经典主题。

---

## 📁 目录结构

```text
edgeever-plugin-code-pro/
├── manifest.json   # 插件声明与 EdgeEver 宿主设置定义
├── main.js         # 独立单文件 Bundle（内置标准高亮引擎与 DOM 渲染）
├── styles.css       # 现代代码块主题与响应式样式表
└── README.md
```

---

## 🚀 分发与安装指南

### 方式一：通过 GitHub 仓库安装（推荐）

1. 在 GitHub 上打开公开仓库：[zyhcs/edgeever-code-pro](https://github.com/zyhcs/edgeever-code-pro)。
2. 将此目录下的 `manifest.json`、`main.js`、`styles.css` 提交至仓库根目录。
3. 创建一个 GitHub Release（Tag 设为 `v1.0.0`），并将 `manifest.json`、`main.js`、`styles.css` 作为附件上传到该 Release。
4. 打开 EdgeEver，进入「**插件市场**」，在地址栏输入你的 GitHub 仓库地址：
   ```text
   https://github.com/zyhcs/edgeever-code-pro
   ```
   点击安装即可！

### 方式二：本地开发预览

在 EdgeEver 桌面端中，支持直接读取本地 Extension 路径进行调试。
