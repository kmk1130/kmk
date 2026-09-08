# kmk 项目 · 代码问题清单（dev 分支）

> 分析时间：2026-09-08
> 范围：`index.html`、`article.html`、`about.html`、`css/style.css`、`js/articles.js`、`js/main.js`、`js/sorting.js`、`README.md`

## 概览

| # | 严重级别 | 文件（位置） | 问题 |
|---|---------|-------------|------|
| 1 | 🔴 高 | `js/main.js:13,22` | `localStorage` 访问无异常保护，可能导致整页脚本崩溃 |
| 2 | 🔴 高 | `css/style.css:90` | `color-mix()` 缺少回退背景，旧浏览器下 sticky 顶栏无背景 |
| 3 | 🔴 高 | `js/main.js:228` + 三个 HTML | 暗色模式存在「白屏闪烁」（FOUC） |
| 4 | 🟡 中 | `js/sorting.js:46` | 快速排序在有序/重复数据下退化为 O(n²) 且递归过深 |
| 5 | 🟡 中 | `js/main.js:214` | `history.replaceState` 在 file:// 下可能抛异常 |
| 6 | 🟡 中 | `README.md` | 目录结构未包含 `js/sorting.js`，文档与代码不同步 |
| 7 | 🟢 低 | 三个 HTML 的 theme-toggle | 主题切换按钮缺少 `aria-pressed` 状态 |
| 8 | 🟢 低 | 三个 HTML 的页脚 | 「回到顶部」链接指向首页而非滚动到顶部 |
| 9 | 🟢 低 | `about.html` | 加载了用不到的 `articles.js` |
| 10 | 🟢 低 | 全局 | 缺少 favicon 与 `.gitignore` |

---

## 详细说明

### 1. 🔴 `localStorage` 访问无异常保护，可能导致整页脚本崩溃

- **位置**：`js/main.js:13`（`getInitialTheme`）、`js/main.js:22`（`applyTheme`）
- **现象**：在隐私浏览模式、用户禁用 cookie、或部分 `file://` 直开场景下，`localStorage.getItem` / `setItem` 会抛出 `SecurityError` 或 `QuotaExceededError`。
- **影响**：`initTheme()` 是 `DOMContentLoaded` 回调里第一个被调用的函数（`js/main.js:228-233`）。它一旦抛异常，后面的 `initFooter()`、`initHome()`、`initArticlePage()` 全部不会执行 → 文章列表空白、文章页空白，页面整体失效。
- **建议**：封装一层安全的存储读写，读写都放在 `try/catch` 内，失败时静默降级（主题仍能跟随系统偏好，只是不记忆选择）：

```js
function safeGet(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}
function safeSet(key, value) {
  try { localStorage.setItem(key, value); } catch { /* 忽略 */ }
}
```

---

### 2. 🔴 `color-mix()` 缺少回退背景，旧浏览器下 sticky 顶栏无背景

- **位置**：`css/style.css:90`
- **现象**：`.site-header` 的背景只用了 `background: color-mix(in srgb, var(--bg) 82%, transparent);`。`color-mix()` 是较新特性（Chrome 111+ / Safari 16.2+ / Firefox 113+），不支持的浏览器会**忽略整条声明**。
- **影响**：此时顶栏背景为透明，而它又是 `position: sticky; top: 0`，页面滚动时正文文字会从导航文字下方穿透显示，可读性严重下降。
- **建议**：在 `color-mix` 之前先声明一条纯色回退（支持新特性的浏览器会用后面的 `color-mix` 覆盖它）：

```css
.site-header {
  background: var(--bg); /* 回退 */
  background: color-mix(in srgb, var(--bg) 82%, transparent);
}
```

---

### 3. 🔴 暗色模式存在「白屏闪烁」（FOUC）

- **位置**：`js/main.js:228`（`DOMContentLoaded` 才应用主题）；`index.html` / `article.html` / `about.html` 均受影响
- **现象**：主题是通过 `main.js` 在文档解析完成后才设置 `data-theme`。脚本在 `<body>` 末尾加载，且默认 `:root` 是亮色。
- **影响**：系统偏好深色的用户每次打开/刷新页面，都会先闪一下白色背景再变成深色，体验割裂。
- **建议**：在 `<head>` 内联一小段脚本，在 `<body>` 渲染之前就写入 `data-theme`：

```html
<script>
  try {
    var t = localStorage.getItem("blog-theme") ||
      (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", t);
  } catch (e) {}
</script>
```

---

### 4. 🟡 快速排序在有序/重复数据下退化为 O(n²) 且递归过深

- **位置**：`js/sorting.js:46`（`const pivot = a[hi];`）
- **现象**：Lomuto 分区固定取最右元素为基准。
- **影响**：对已排序、逆序或大量重复元素的数据，分区极不平衡，退化为 O(n²)；且递归深度可达 O(n)，大数据量下有栈溢出风险。当前 demo 用 20 个随机数所以不明显，但作为通用算法存在隐患。
- **建议**：改为随机 pivot 或「三数取中」（median-of-three）：

```js
const m = (lo + hi) >> 1;
// 简单三数取中：把 a[lo]/a[m]/a[hi] 的中位数换到 a[hi]
if (a[lo] > a[m]) [a[lo], a[m]] = [a[m], a[lo]];
if (a[lo] > a[hi]) [a[lo], a[hi]] = [a[hi], a[lo]];
if (a[m] > a[hi]) [a[m], a[hi]] = [a[hi], a[m]];
const pivot = a[hi];
```

---

### 5. 🟡 `history.replaceState` 在 file:// 下可能抛异常

- **位置**：`js/main.js:214`
- **现象**：文章页在缺少 `id` 参数时调用 `history.replaceState(null, "", ...)`。
- **影响**：直接双击 HTML 打开（`file://`，origin 为 `null`）时，部分浏览器会抛 `SecurityError`，中断脚本执行。虽然该分支只在「手动去掉 URL 参数」时触发，但属于潜在崩溃点。
- **建议**：用 `try/catch` 包裹，或仅在 http/https 协议下执行。

---

### 6. 🟡 README 目录结构未包含 `js/sorting.js`

- **位置**：`README.md` 的「目录结构」一节
- **影响**：dev 分支新增了 `js/sorting.js`，但 README 只列出了 `js/articles.js` 与 `js/main.js`，新读者会漏掉排序算法文件及其 `node js/sorting.js` 的运行方式。
- **建议**：在目录结构和功能说明中补上 `js/sorting.js`。

---

### 7. 🟢 主题切换按钮缺少 `aria-pressed` 状态

- **位置**：`index.html` / `article.html` / `about.html` 的 `<button id="theme-toggle">`；`js/main.js:29`
- **影响**：屏幕阅读器用户无法获知当前处于亮色还是深色主题。
- **建议**：切换时同步更新 `aria-pressed`（或 `aria-label`）：

```js
toggle.setAttribute("aria-pressed", String(current === "dark"));
```

---

### 8. 🟢 页脚「回到顶部」链接指向首页而非滚动到顶部

- **位置**：三个 HTML 的页脚 `<a href="index.html" class="footer-link">回到顶部 ↑</a>`
- **影响**：文案（回到顶部）与行为（跳转首页）不一致，可能让用户误触后离开当前文章。
- **建议**：改为 `href="#"` 配合 `scroll-behavior: smooth`，或绑定 `window.scrollTo({ top: 0 })`。

---

### 9. 🟢 `about.html` 加载了用不到的 `articles.js`

- **位置**：`about.html` 底部的 `<script src="js/articles.js">`
- **影响**：`articles.js` 含全部文章正文（约 3KB+），about 页完全用不到，却每次都要下载解析，轻微浪费。
- **建议**：about 页移除对 `articles.js` 的引用（`main.js` 的 `initHome`/`initArticlePage` 都有空值守卫，不会报错）。

---

### 10. 🟢 缺少 favicon 与 `.gitignore`

- **位置**：仓库全局
- **影响**：
  - 浏览器标签页无站点图标，辨识度低。
  - 无 `.gitignore`，后续若加入 `node_modules/`、构建产物、`.DS_Store` 等容易被误提交。
- **建议**：补一个 `favicon`（可用 emoji 或简单 SVG），并添加 `.gitignore`（至少忽略 `node_modules/`、`.DS_Store`、`dist/` 等）。
