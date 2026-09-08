/* ============================================================
   代码手记 · 主逻辑
   主题切换、文章列表渲染、标签筛选、搜索、文章页渲染
   ============================================================ */

(function () {
  "use strict";

  /* ---------- 主题切换 ---------- */
  const THEME_KEY = "blog-theme";

  // 安全读写 localStorage：隐私模式 / file:// 等场景可能抛异常
  function safeGetLocalStorage(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }

  function safeSetLocalStorage(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      /* 忽略：记忆失败不影响主题功能 */
    }
  }

  function getInitialTheme() {
    const saved = safeGetLocalStorage(THEME_KEY);
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    safeSetLocalStorage(THEME_KEY, theme);
  }

  function initTheme() {
    const theme = getInitialTheme();
    applyTheme(theme);
    const toggle = document.getElementById("theme-toggle");
    if (toggle) {
      toggle.setAttribute("aria-pressed", String(theme === "dark"));
      toggle.addEventListener("click", () => {
        const current =
          document.documentElement.getAttribute("data-theme") === "dark"
            ? "light"
            : "dark";
        applyTheme(current);
        toggle.setAttribute("aria-pressed", String(current === "dark"));
      });
    }
  }

  /* ---------- 工具函数 ---------- */

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function readingTime(content) {
    // 去掉 HTML 标签后按中文阅读速度估算（约 400 字/分钟）
    const text = content.replace(/<[^>]*>/g, "");
    const minutes = Math.max(1, Math.round(text.length / 400));
    return `${minutes} 分钟阅读`;
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr + "T00:00:00");
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y} 年 ${m} 月 ${day} 日`;
  }

  function sortByDateDesc(list) {
    return [...list].sort((a, b) => (a.date < b.date ? 1 : -1));
  }

  /* ---------- 卡片渲染 ---------- */

  function tagHtml(tags) {
    return tags
      .map((t) => `<span class="card-tag">${escapeHtml(t)}</span>`)
      .join("");
  }

  function articleCardHTML(article) {
    return `
      <a class="article-card" href="article.html?id=${encodeURIComponent(article.id)}">
        <div class="card-tags">${tagHtml(article.tags)}</div>
        <h3 class="card-title">${escapeHtml(article.title)}</h3>
        <p class="card-excerpt">${escapeHtml(article.excerpt)}</p>
        <div class="card-meta">
          <span>${escapeHtml(formatDate(article.date))}</span>
          <span class="dot">·</span>
          <span>${escapeHtml(readingTime(article.content))}</span>
        </div>
      </a>
    `;
  }

  /* ---------- 首页：列表 + 筛选 + 搜索 ---------- */

  function initHome() {
    const listEl = document.getElementById("article-list");
    if (!listEl) return;

    const searchInput = document.getElementById("search-input");
    const tagFilterEl = document.getElementById("tag-filter");
    const emptyState = document.getElementById("empty-state");
    const listTitle = document.getElementById("list-title");
    const resultCount = document.getElementById("result-count");

    let activeTag = "全部";
    let query = "";

    // 收集所有标签（保持出现顺序去重）
    const allTags = [];
    ARTICLES.forEach((a) =>
      a.tags.forEach((t) => {
        if (!allTags.includes(t)) allTags.push(t);
      })
    );

    function renderTagChips() {
      const chips = ["全部", ...allTags];
      tagFilterEl.innerHTML = chips
        .map(
          (tag) =>
            `<button class="tag-chip${tag === activeTag ? " active" : ""}" data-tag="${escapeHtml(tag)}">${escapeHtml(tag)}</button>`
        )
        .join("");
    }

    function matchesFilter(article) {
      const matchTag = activeTag === "全部" || article.tags.includes(activeTag);
      const q = query.trim().toLowerCase();
      const matchQuery =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.excerpt.toLowerCase().includes(q) ||
        article.tags.some((t) => t.toLowerCase().includes(q));
      return matchTag && matchQuery;
    }

    function renderList() {
      const filtered = sortByDateDesc(ARTICLES).filter(matchesFilter);
      listEl.innerHTML = filtered.map(articleCardHTML).join("");
      emptyState.hidden = filtered.length > 0;

      const label = activeTag === "全部" ? "全部文章" : `标签：${activeTag}`;
      listTitle.textContent = label;
      resultCount.textContent = `${filtered.length} 篇`;
    }

    // 标签点击（事件委托）
    tagFilterEl.addEventListener("click", (e) => {
      const chip = e.target.closest(".tag-chip");
      if (!chip) return;
      activeTag = chip.dataset.tag;
      renderTagChips();
      renderList();
    });

    // 搜索（输入防抖）
    let debounceTimer;
    searchInput.addEventListener("input", () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        query = searchInput.value;
        renderList();
      }, 150);
    });

    renderTagChips();
    renderList();
  }

  /* ---------- 文章页 ---------- */

  function initArticlePage() {
    const contentEl = document.getElementById("post-content");
    if (!contentEl) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const article = ARTICLES.find((a) => a.id === id) || ARTICLES[0];

    // 填充标题与元信息
    document.title = `${article.title} · 代码手记`;
    document.getElementById("post-title").textContent = article.title;
    document.getElementById("post-date").textContent = formatDate(article.date);
    document.getElementById("post-reading-time").textContent =
      readingTime(article.content);

    const tagsEl = document.getElementById("post-tags");
    tagsEl.innerHTML = article.tags
      .map((t) => `<span class="post-tag">${escapeHtml(t)}</span>`)
      .join("");

    // 正文（content 为受信任的作者内容）
    contentEl.innerHTML = article.content;

    // 相关文章：标签有交集，排除当前文章，最多 3 篇
    const related = sortByDateDesc(
      ARTICLES.filter(
        (a) =>
          a.id !== article.id &&
          a.tags.some((t) => article.tags.includes(t))
      )
    ).slice(0, 3);

    const relatedEl = document.getElementById("post-related");
    if (related.length > 0) {
      document.getElementById("related-list").innerHTML = related
        .map(articleCardHTML)
        .join("");
    } else {
      relatedEl.hidden = true;
    }

    // 找不到文章时回填 URL（file:// 下可能抛 SecurityError，故忽略异常）
    if (!id) {
      try {
        history.replaceState(null, "", `article.html?id=${article.id}`);
      } catch (e) {
        /* 忽略 */
      }
    }
  }

  /* ---------- 页脚年份 ---------- */

  function initFooter() {
    document.querySelectorAll("#year").forEach((el) => {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ---------- 启动 ---------- */

  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initFooter();
    initHome();
    initArticlePage();
  });
})();
