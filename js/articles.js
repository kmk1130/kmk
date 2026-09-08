/* ============================================================
   文章数据
   新增文章：往 ARTICLES 数组里加一个对象即可。
   id 唯一，content 直接写 HTML 字符串。
   ============================================================ */

const ARTICLES = [
  {
    id: "html5-semantic",
    title: "用语义化 HTML 写出更清晰的结构",
    date: "2026-09-05",
    tags: ["HTML", "前端"],
    excerpt:
      "语义化标签不只是「规范」要求，它能提升可访问性、SEO，也让维护者一眼看懂页面结构。本文用几个常见场景聊聊怎么用对标签。",
    content: `
      <p>很多人写 HTML 时习惯堆 <code>&lt;div&gt;</code>，觉得反正 CSS 都能搞定。但语义化标签的价值，恰恰在于那些 <strong>CSS 管不到的地方</strong>：屏幕阅读器、搜索引擎、以及读你代码的同事。</p>

      <h2>为什么语义化重要</h2>
      <p>一个页面如果全是 <code>&lt;div&gt;</code>，浏览器和辅助技术只能看到一个「中性容器」，无法理解哪部分是导航、哪部分是正文。而使用 <code>&lt;header&gt;</code>、<code>&lt;nav&gt;</code>、<code>&lt;main&gt;</code>、<code>&lt;article&gt;</code> 等标签后，结构本身就在表达含义。</p>

      <blockquote>写 HTML 时先想「这是什么」，而不是「它长什么样」。</blockquote>

      <h2>常见标签怎么选</h2>
      <ul>
        <li><strong>&lt;nav&gt;</strong>：页面主导航或分页导航，不是所有链接列表都算。</li>
        <li><strong>&lt;article&gt;</strong>：可独立分发的一段完整内容，比如一篇博客文章。</li>
        <li><strong>&lt;section&gt;</strong>：有主题的一块内容，通常带一个标题。</li>
        <li><strong>&lt;aside&gt;</strong>：与主内容相关但属于次要的补充信息。</li>
      </ul>

      <h2>一个简单的页面骨架</h2>
      <pre><code>&lt;body&gt;
  &lt;header&gt;
    &lt;nav&gt;…&lt;/nav&gt;
  &lt;/header&gt;
  &lt;main&gt;
    &lt;article&gt;
      &lt;h1&gt;文章标题&lt;/h1&gt;
      &lt;p&gt;正文内容…&lt;/p&gt;
    &lt;/article&gt;
  &lt;/main&gt;
  &lt;footer&gt;…&lt;/footer&gt;
&lt;/body&gt;</code></pre>

      <h2>小结</h2>
      <p>语义化不是玄学，它是一套更省心的协作约定。下一次写页面时，不妨先花十秒想想用哪个标签更准确，长期收益会超出你的预期。</p>
    `,
  },
  {
    id: "css-grid-tips",
    title: "CSS Grid 五个实用小技巧",
    date: "2026-08-28",
    tags: ["CSS", "前端"],
    excerpt:
      "Grid 是布局利器，但有些细节容易忽略。这里整理了五个高频用法，从响应式卡片到自动填充，让你的布局更简洁。",
    content: `
      <p>CSS Grid 出现之后，很多以前要靠 <code>float</code> 和 <code>flex</code> 硬凑的布局，现在几行代码就能搞定。下面是我最常用的五个技巧。</p>

      <h2>1. 自动填充列</h2>
      <p>响应式卡片布局，一行放多少取决于容器宽度，不用写媒体查询：</p>
      <pre><code>.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}</code></pre>

      <h2>2. 内容撑开 + 居中</h2>
      <p>让某个子项在网格里水平垂直居中：</p>
      <pre><code>.item {
  place-self: center; /* align-self + justify-self */
}</code></pre>

      <h2>3. 万能居中容器</h2>
      <pre><code>.center {
  display: grid;
  place-items: center;
}</code></pre>

      <h2>4. 让元素重叠</h2>
      <p>给两个子项设置相同的行列位置，它们会叠在一起，常用于文字压在图片上：</p>
      <pre><code>.stack > * {
  grid-area: 1 / 1;
}</code></pre>

      <h2>5. 用 gap 替代 margin</h2>
      <p>不要再用 <code>margin</code> 在元素之间隔开距离，<code>gap</code> 只在相邻项之间生效，边缘不会有多余间距，代码也更清晰。</p>

      <p>掌握这几点，日常 80% 的布局需求都能轻松应对。</p>
    `,
  },
  {
    id: "js-event-delegation",
    title: "事件委托：少写监听器，多写一份好代码",
    date: "2026-08-15",
    tags: ["JavaScript", "前端"],
    excerpt:
      "列表里每个按钮都绑一个监听器，既啰嗦又浪费。事件委托利用冒泡机制，一个监听器就能处理成百上千个元素。",
    content: `
      <p>假设有一个待办列表，每项都有一个「删除」按钮。直觉做法是遍历所有按钮，给每个都 <code>addEventListener</code>。当列表动态增长时，新加的元素还得重新绑定，麻烦又容易漏。</p>

      <h2>什么是事件委托</h2>
      <p>利用事件冒泡：点击子元素时，事件会一路向上冒泡到父元素。我们只要在父容器上绑一个监听器，判断事件源头即可。</p>

      <h2>示例</h2>
      <pre><code>list.addEventListener('click', (e) =&gt; {
  const btn = e.target.closest('.delete-btn');
  if (!btn) return;
  btn.closest('li').remove();
});</code></pre>

      <p><code>closest()</code> 用来判断点击的是不是（或包含在）删除按钮里，避免点到别处也触发。</p>

      <h2>好处</h2>
      <ul>
        <li>内存占用更少：一个监听器代替 N 个。</li>
        <li>自动支持动态元素：新增节点无需重新绑定。</li>
        <li>逻辑集中：删除相关的逻辑都在一起。</li>
      </ul>

      <blockquote>凡是「同类元素重复绑定同一行为」的场景，优先考虑事件委托。</blockquote>

      <p>当然，不是所有事件都冒泡（比如 <code>focus</code>、<code>blur</code>），这种情况需要配合捕获阶段或用 <code>focusin</code>/<code>focusout</code>。但绝大多数点击场景，委托都是更优解。</p>
    `,
  },
  {
    id: "git-commit-habits",
    title: "写好 Git 提交信息的三条约定",
    date: "2026-08-02",
    tags: ["Git", "工具"],
    excerpt:
      "一个清晰规范的 commit message，是团队协作的隐形资产。这篇文章聊聊我一直在用的三条约定，以及一条主线：说清楚「为什么」。",
    content: `
      <p>很多人的提交信息是「fix」「update」「改了一点」——过两周回头看，完全想不起当时改了什么、为什么改。好的提交信息能救命。</p>

      <h2>约定一：一行概括做了什么</h2>
      <p>第一行用祈使句，简短（建议 50 字符内），像在给代码下指令：</p>
      <pre><code>feat: 支持文章按标签筛选
fix: 修复暗色模式下代码块对比度
refactor: 抽离日期格式化函数</code></pre>

      <h2>约定二：常用前缀</h2>
      <ul>
        <li><code>feat</code>：新增功能</li>
        <li><code>fix</code>：修复 bug</li>
        <li><code>refactor</code>：重构，不改行为</li>
        <li><code>docs</code>：文档</li>
        <li><code>style</code>：格式、不影响逻辑</li>
        <li><code>chore</code>：杂项、构建等</li>
      </ul>

      <h2>约定三：正文解释「为什么」</h2>
      <p>当改动复杂时，空一行后写正文，重点说明动机和取舍，而不是复述代码。</p>

      <blockquote>提交信息回答的不是「改了什么」（代码已说明），而是「为什么改」。</blockquote>

      <h2>小结</h2>
      <p>规范的价值在团队协作中会被放大：别人能快速看懂历史、定位问题、回顾决策。从现在开始，把提交信息当成写给未来的自己的信。</p>
    `,
  },
  {
    id: "shell-shortcuts",
    title: "让你的终端快人一步：常用 Shell 快捷键",
    date: "2026-07-20",
    tags: ["Shell", "工具"],
    excerpt:
      "离开方向键和鼠标，用键盘在命令行里飞。这篇文章整理了最值得记住的一组 Shell 快捷键，熟练之后效率翻倍。",
    content: `
      <p>很多人在终端里还在用方向键一个字符一个字符地挪，或者用鼠标反复选中。其实 Shell 自带一套强大的编辑快捷键，学会之后再也回不去了。</p>

      <h2>移动光标</h2>
      <ul>
        <li><code>Ctrl + A</code>：跳到行首</li>
        <li><code>Ctrl + E</code>：跳到行尾</li>
        <li><code>Alt + B</code> / <code>Alt + F</code>：按单词左右移动</li>
      </ul>

      <h2>删除与修改</h2>
      <ul>
        <li><code>Ctrl + W</code>：删除光标前一个单词</li>
        <li><code>Ctrl + U</code>：删除光标前所有内容</li>
        <li><code>Ctrl + K</code>：删除光标后所有内容</li>
        <li><code>Ctrl + L</code>：清屏（等同于 clear）</li>
      </ul>

      <h2>历史命令</h2>
      <ul>
        <li><code>Ctrl + R</code>：反向搜索历史命令（最常用！）</li>
        <li><code>!!</code>：重复上一条命令</li>
      </ul>

      <blockquote>Ctrl + R 是投入产出比最高的一个快捷键，没有之一。</blockquote>

      <p>一开始不用全记住，挑两三个最常用的（比如 <code>Ctrl + A/E</code> 和 <code>Ctrl + R</code>），形成肌肉记忆后再慢慢扩展。</p>
    `,
  },
  {
    id: "css-dark-mode",
    title: "用 CSS 变量实现优雅的暗色模式",
    date: "2026-07-05",
    tags: ["CSS", "前端"],
    excerpt:
      "一套 CSS 变量 + 一个 data 属性，就能做出跟随系统、又可手动切换的暗色模式。本文拆解完整的实现思路，并处理跟随系统偏好的细节。",
    content: `
      <p>暗色模式几乎是现代网站的标配。好消息是，用 CSS 变量（自定义属性）来实现，代码量很少，维护成本也低。</p>

      <h2>核心思路</h2>
      <p>把颜色都定义成变量放在 <code>:root</code>，切换主题时只改变量的值，而不是重写一堆选择器。</p>

      <pre><code>:root {
  --bg: #ffffff;
  --text: #1c1e2a;
}
:root[data-theme="dark"] {
  --bg: #0e1016;
  --text: #e8e9ef;
}
body {
  background: var(--bg);
  color: var(--text);
}</code></pre>

      <h2>跟随系统偏好</h2>
      <p>用 <code>prefers-color-scheme</code> 媒体查询检测系统偏好：</p>
      <pre><code>@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { /* 深色变量 */ }
}</code></pre>

      <h2>手动切换并记忆</h2>
      <p>通过 JS 给 <code>&lt;html&gt;</code> 设置 <code>data-theme</code> 属性，并用 <code>localStorage</code> 记住用户选择：</p>
      <pre><code>const saved = localStorage.getItem('theme');
const theme = saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
document.documentElement.setAttribute('data-theme', theme);</code></pre>

      <h2>小结</h2>
      <p>变量把「主题」从具体的颜色值中解耦出来，这让新增一个主题、或微调配色都变得非常轻松。本项目正是用这套方式实现的暗色模式，你可以直接查看源码。</p>
    `,
  },
];
