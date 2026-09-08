# 代码手记 · 个人技术博客

一个纯 **HTML5 + CSS + JavaScript** 实现的个人技术博客，零依赖、零构建，直接用浏览器打开即可运行。

## 功能

- 📄 文章列表 + 详情页（数据驱动，改数据即新增文章）
- 🏷️ 标签筛选
- 🔍 关键词搜索（标题 / 摘要 / 标签）
- 🌗 暗色 / 亮色主题切换，跟随系统偏好，并用 localStorage 记忆选择
- 📱 响应式布局，手机、桌面都好看
- 🔗 相关文章推荐（按标签交集）

## 目录结构

```
demo/
├── index.html        首页（文章列表）
├── article.html      文章详情页
├── about.html        关于页
├── favicon.svg       站点图标
├── .gitignore        忽略规则
├── css/
│   └── style.css     全部样式（含主题变量）
└── js/
    ├── articles.js   文章数据
    ├── main.js       渲染 / 筛选 / 搜索 / 主题切换
    └── sorting.js    三种排序算法（node js/sorting.js 运行验证）
```

## 快速开始

直接用浏览器打开 `index.html` 即可。也可以起一个本地静态服务器：

```bash
# 在项目目录下执行（任选其一）
python3 -m http.server 8000
# 或
npx serve .
```

然后访问 http://localhost:8000 。

## 如何新增文章

打开 `js/articles.js`，往 `ARTICLES` 数组里加一个对象即可：

```js
{
  id: "my-new-post",              // 唯一，会出现在 URL 里
  title: "文章标题",
  date: "2026-09-08",             // 用于排序与显示
  tags: ["前端", "JavaScript"],   // 用于标签筛选与相关推荐
  excerpt: "一段摘要，显示在卡片上。",
  content: `                       // 正文，直接写 HTML 字符串
    <p>第一段……</p>
    <h2>小标题</h2>
    <pre><code>代码示例</code></pre>
  `,
}
```

无需改其他任何文件，首页列表、标签、搜索、详情页都会自动生效。

## 排序算法

`js/sorting.js` 实现了三种经典排序算法：冒泡排序、快速排序、归并排序。

```bash
node js/sorting.js   # 输出排序结果与正确性校验
```
