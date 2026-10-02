/**
 * EdgeEver Code Pro Plugin
 * 专业级语法高亮引擎与代码块美化器
 * 原生深度适配 EdgeEver 编辑器与全语法高亮
 */

// ==================== 1. 专业级多语言高亮引擎 ====================
const GRAMMARS = {
  abap: [
    // 行注释：行首 * 或任意位置的 "
    { type: "comment", pattern: /(?:^\*|\n\*)[^\r\n]*|"[^\r\n]*/g },
    // 字符串：单引号、反引号、管道字符串
    { type: "string", pattern: /'(?:''|[^'\r\n])*'|`(?:``|[^`\r\n])*`|\|(?:\\\||[^|\r\n])*\|/g },
    // 系统变量：SY-*, SYST-*
    { type: "abap-system-var", pattern: /\b(?:SY|SYST)-[A-Z0-9_]+\b/gi },
    // 数字
    { type: "number", pattern: /\b\d+(?:\.\d+)?\b/g },
    // ABAP 全量核心关键字与控制语句
    {
      type: "keyword",
      pattern:
        /\b(?:REPORT|PROGRAM|DATA|TYPES|CONSTANTS|STATICS|PARAMETERS|SELECT-OPTIONS|FIELD-SYMBOLS|CLASS|ENDCLASS|INTERFACE|ENDINTERFACE|METHOD|ENDMETHOD|MODULE|ENDMODULE|FORM|ENDFORM|FUNCTION|ENDFUNCTION|DO|ENDDO|WHILE|ENDWHILE|LOOP|ENDLOOP|AT|ENDAT|IF|ELSEIF|ELSE|ENDIF|CASE|WHEN|ENDCASE|TRY|CATCH|CLEANUP|ENDTRY|CHECK|EXIT|CONTINUE|RETURN|REJECT|STOP|CALL|METHOD|RECEIVING|IMPORTING|EXPORTING|CHANGING|TABLES|EXCEPTIONS|PERFORM|SUBMIT|LEAVE|RAISE|MESSAGE|SELECT|SINGLE|FROM|INTO|CORRESPONDING|FIELDS|WHERE|GROUP|BY|HAVING|ORDER|APPENDING|INSERT|UPDATE|MODIFY|DELETE|COMMIT|WORK|ROLLBACK|OPEN|FETCH|CLOSE|READ|TABLE|APPEND|SORT|ASSIGN|UNASSIGN|CLEAR|FREE|MOVE|MOVE-CORRESPONDING|CONCATENATE|SPLIT|CONDENSE|TRANSLATE|REPLACE|SEARCH|SHIFT|DESCRIBE|COMPUTE|ADD|SUBTRACT|MULTIPLY|DIVIDE|TYPE|LIKE|REF|TO|VALUE|INITIAL|OPTIONAL|DEFAULT|STANDARD|SORTED|HASHED|INDEX|KEY|WITH|TRANSPORTING|NO|FIELDS|UP|ROWS|EQ|NE|LT|LE|GT|GE|AND|OR|NOT|BETWEEN|IN|LIKE|IS|ASSIGNED|BOUND|DEFINITION|IMPLEMENTATION|PUBLIC|PROTECTED|PRIVATE|ABSTRACT|FINAL|FOR|TESTING|INHERITING|INTERFACES|EVENTS|ALIASES|CREATE|OBJECT|SET|GET|HANDLER|ACTIVATION|STATUS|TITLEBAR)\b/gi,
    },
    // 操作符与箭头指针
    { type: "operator", pattern: /->|=>|[-+*\/=<>~]|&&|\|\|/g },
  ],

  javascript: [
    { type: "comment", pattern: /\/\*[\s\S]*?\*\/|\/\/[^\r\n]*/g },
    { type: "string", pattern: /(["'`])(?:\\[\s\S]|(?!\1)[^\\])*\1/g },
    {
      type: "keyword",
      pattern:
        /\b(?:async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|export|extends|finally|for|from|function|get|if|import|in|instanceof|let|new|of|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield|type|interface|enum|implements)\b/g,
    },
    { type: "number", pattern: /\b(?:0[xX][0-9a-fA-F]+|0[bB][01]+|\d+(?:\.\d+)?)\b/g },
    { type: "function", pattern: /\b[a-zA-Z_$][a-zA-Z0-9_$]*(?=\s*\()/g },
    { type: "operator", pattern: /[-+*\/%=!&|<>^?~:]+/g },
  ],

  python: [
    { type: "comment", pattern: /#[^\r\n]*/g },
    { type: "string", pattern: /(?:"""[\s\S]*?"""|'''[\s\S]*?'''|(["'])(?:\\[\s\S]|(?!\1)[^\\])*\1)/g },
    {
      type: "keyword",
      pattern:
        /\b(?:and|as|assert|async|await|break|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|raise|return|try|while|with|yield|True|False|None)\b/g,
    },
    { type: "number", pattern: /\b\d+(?:\.\d+)?\b/g },
    { type: "function", pattern: /\b[a-zA-Z_][a-zA-Z0-9_]*(?=\s*\()/g },
    { type: "operator", pattern: /[-+*\/%=!&|<>^~:]+/g },
  ],

  sql: [
    { type: "comment", pattern: /--[^\r\n]*|\/\*[\s\S]*?\*\//g },
    { type: "string", pattern: /'(?:''|[^'\r\n])*'/g },
    {
      type: "keyword",
      pattern:
        /\b(?:SELECT|FROM|WHERE|INSERT|INTO|UPDATE|DELETE|JOIN|LEFT|RIGHT|INNER|OUTER|FULL|CROSS|ON|ORDER|BY|GROUP|HAVING|LIMIT|OFFSET|UNION|ALL|AS|DISTINCT|CREATE|TABLE|INDEX|VIEW|DROP|ALTER|PRIMARY|KEY|FOREIGN|REFERENCES|CHECK|DEFAULT|NULL|NOT|AND|OR|IN|BETWEEN|LIKE|IS|EXISTS|CASE|WHEN|THEN|ELSE|END)\b/gi,
    },
    { type: "number", pattern: /\b\d+(?:\.\d+)?\b/g },
    { type: "function", pattern: /\b(?:COUNT|SUM|AVG|MIN|MAX|COALESCE|NOW|CONCAT|SUBSTRING|TRIM)\b/gi },
    { type: "operator", pattern: /[-+*\/=<>!&|]+/g },
  ],

  json: [
    { type: "keyword", pattern: /"(?:\\.|[^\\"\r\n])*"(?=\s*:)/g },
    { type: "string", pattern: /"(?:\\.|[^\\"\r\n])*"/g },
    { type: "number", pattern: /-?\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/g },
    { type: "keyword", pattern: /\b(?:true|false|null)\b/g },
    { type: "operator", pattern: /[{}[\]:,]/g },
  ],

  bash: [
    { type: "comment", pattern: /#[^\r\n]*/g },
    { type: "string", pattern: /(["'])(?:\\[\s\S]|(?!\1)[^\\])*\1/g },
    {
      type: "keyword",
      pattern: /\b(?:if|then|else|elif|fi|for|while|until|do|done|in|case|esac|function|return|exit|export|local)\b/g,
    },
    { type: "abap-system-var", pattern: /\$[a-zA-Z0-9_?*#@!$-]+/g },
    { type: "function", pattern: /\b[a-zA-Z_][a-zA-Z0-9_-]*(?=\s*\()/g },
  ],
};

GRAMMARS.typescript = GRAMMARS.javascript;
GRAMMARS.ts = GRAMMARS.javascript;
GRAMMARS.js = GRAMMARS.javascript;
GRAMMARS.py = GRAMMARS.python;
GRAMMARS.sh = GRAMMARS.bash;
GRAMMARS.shell = GRAMMARS.bash;

// 常用语言选项列表
const SUPPORTED_LANGUAGES = [
  { id: "abap", label: "ABAP" },
  { id: "javascript", label: "JavaScript" },
  { id: "typescript", label: "TypeScript" },
  { id: "python", label: "Python" },
  { id: "sql", label: "SQL" },
  { id: "json", label: "JSON" },
  { id: "bash", label: "Bash" },
  { id: "html", label: "HTML" },
  { id: "css", label: "CSS" },
  { id: "java", label: "Java" },
  { id: "cpp", label: "C++" },
  { id: "c", label: "C" },
  { id: "csharp", label: "C#" },
  { id: "go", label: "Go" },
  { id: "rust", label: "Rust" },
  { id: "yaml", label: "YAML" },
  { id: "markdown", label: "Markdown" },
  { id: "plaintext", label: "Plain Text" },
];

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function highlightCode(code, lang) {
  const rules = GRAMMARS[lang] || GRAMMARS.abap;
  const matches = [];

  for (const rule of rules) {
    let match;
    const re = new RegExp(rule.pattern.source, rule.pattern.flags);
    while ((match = re.exec(code)) !== null) {
      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        text: match[0],
        type: rule.type,
      });
    }
  }

  // 按起始位置与长度排序
  matches.sort((a, b) => a.start - b.start || (b.end - b.start) - (a.end - a.start));

  // 消除重叠 Token
  const nonOverlapping = [];
  let lastEnd = 0;
  for (const m of matches) {
    if (m.start >= lastEnd) {
      nonOverlapping.push(m);
      lastEnd = m.end;
    }
  }

  // 组装最终带高亮 class 的 HTML
  let html = "";
  let cursor = 0;
  for (const m of nonOverlapping) {
    if (m.start > cursor) {
      html += escapeHtml(code.slice(cursor, m.start));
    }
    const hljsClass =
      m.type === "keyword"
        ? "hljs-keyword"
        : m.type === "comment"
        ? "hljs-comment"
        : m.type === "string"
        ? "hljs-string"
        : m.type === "number"
        ? "hljs-number"
        : m.type === "function"
        ? "hljs-built_in"
        : "hljs-variable";

    html += `<span class="token ${m.type} ${hljsClass}">${escapeHtml(m.text)}</span>`;
    cursor = m.end;
  }
  if (cursor < code.length) {
    html += escapeHtml(code.slice(cursor));
  }
  return html;
}

// 跨平台健壮复制代码到剪贴板
async function copyCodeToClipboard(text, block) {
  // 1. EdgeEver 桌面端专用原生桥接（最高优先级）
  if (typeof window !== "undefined" && window.edgeeverDesktop?.copyText) {
    try {
      const ok = await window.edgeeverDesktop.copyText(text);
      if (ok) return true;
    } catch (_) {}
  }

  // 2. 尝试触发 EdgeEver 自带的原生复制按钮
  const nativeBtn = block?.querySelector(".edgeever-code-copy-button");
  if (nativeBtn) {
    try {
      nativeBtn.click();
      return true;
    } catch (_) {}
  }

  // 3. 浏览器 Clipboard API
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (_) {}
  }

  // 4. 标准 execCommand 离屏文本框兜底
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    ta.style.top = "0";
    ta.setAttribute("readonly", "");
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  } catch (_) {
    return false;
  }
}

// ==================== 2. 插件主生命周期定义 ====================
export default {
  async activate(context) {
    const settings = {
      showMacDots: true,
      showLanguageBadge: true,
      showCollapseButton: true,
      showCopyButton: true,
      showLineNumbers: true,
      autoDetectAbap: true,
      codeTheme: "one-dark",
    };

    const loadSettings = async () => {
      try {
        const dots = await context.settings.get("show_mac_dots");
        const lang = await context.settings.get("show_language_badge");
        const collapse = await context.settings.get("show_collapse_button");
        const copy = await context.settings.get("show_copy_button");
        const lines = await context.settings.get("show_line_numbers");
        const abap = await context.settings.get("auto_detect_abap");
        const theme = await context.settings.get("code_theme");

        if (dots !== null) settings.showMacDots = dots;
        if (lang !== null) settings.showLanguageBadge = lang;
        if (collapse !== null) settings.showCollapseButton = collapse;
        if (copy !== null) settings.showCopyButton = copy;
        if (lines !== null) settings.showLineNumbers = lines;
        if (abap !== null) settings.autoDetectAbap = abap;
        if (theme) settings.codeTheme = theme;
      } catch (e) {}
    };

    await loadSettings();

    // 点击外部时关闭所有已打开的语言选择菜单
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".edgeever-code-lang-selector")) {
        document.querySelectorAll(".edgeever-code-lang-selector.open").forEach((el) => {
          el.classList.remove("open");
        });
      }
    });

    /**
     * 判断文本是否包含明显的 ABAP 语法特征
     */
    function detectIsAbap(codeText) {
      return /\b(REPORT\s+[A-Z0-9_]+|DATA:?|TYPES:?|FORM\s+[A-Z0-9_]+|CALL\s+METHOD|CALL\s+FUNCTION|SELECT\s+SINGLE|TABLES:?|CLASS\s+[A-Z0-9_]+\s+DEFINITION|METHOD\s+[A-Z0-9_]+|ENDMETHOD|ENDFORM|ENDSELECT|SY-SUBRC|MOVE-CORRESPONDING)\b/i.test(
        codeText
      );
    }

    /**
     * 更新代码块语言属性并通知 TipTap
     */
    function changeCodeBlockLanguage(block, sourceEl, newLangId) {
      block.setAttribute("data-language", newLangId);
      block.dataset.language = newLangId;

      // 尝试通知 TipTap 编辑器更新节点语言属性
      try {
        const pm = document.querySelector(".ProseMirror");
        let editor = pm?.pmViewDesc?.view?.editor;
        if (!editor && pm) {
          const fiberKey = Object.keys(pm).find(
            (k) => k.startsWith("__reactFiber$") || k.startsWith("__reactInternalInstance$")
          );
          if (fiberKey) {
            let fiber = pm[fiberKey];
            while (fiber) {
              if (fiber.memoizedProps?.editor) {
                editor = fiber.memoizedProps.editor;
                break;
              }
              fiber = fiber.return;
            }
          }
        }
        if (editor?.commands) {
          editor.commands.focus();
          editor.commands.updateAttributes("codeBlock", { language: newLangId });
        }
      } catch (_) {}

      // 强制重绘高亮
      delete block.dataset.codeProProcessed;
      beautifyCodeBlock(block, true);
    }

    /**
     * 对单个代码块执行 UI 装饰与语法高亮
     */
    function beautifyCodeBlock(block, forceRehighlight = false) {
      if (block.classList.contains("edgeever-mermaid-code-block") && !block.classList.contains("is-source-visible")) {
        return;
      }

      if (!forceRehighlight && block.dataset.codeProProcessed === "true") return;

      const sourceEl = block.querySelector(".edgeever-code-source") || block.querySelector("code") || block;
      if (!sourceEl) return;

      const rawText = sourceEl.innerText || sourceEl.textContent || "";
      if (!rawText.trim()) return;

      // 1. 语言识别与嗅探
      let detectedLang = (block.getAttribute("data-language") || block.dataset.language || "").trim().toLowerCase();
      if (!detectedLang || detectedLang === "plaintext") {
        const classList = Array.from(block.classList).concat(Array.from(sourceEl.classList));
        const langClass = classList.find((c) => c.startsWith("language-"));
        if (langClass) {
          detectedLang = langClass.replace("language-", "").toLowerCase();
        }
      }

      // ABAP 自动嗅探
      if ((!detectedLang || detectedLang === "plaintext") && settings.autoDetectAbap) {
        if (detectIsAbap(rawText)) {
          detectedLang = "abap";
          block.setAttribute("data-language", "abap");
        }
      }

      detectedLang = detectedLang || "plaintext";
      const matchedLang =
        SUPPORTED_LANGUAGES.find((l) => l.id === detectedLang) || {
          id: detectedLang,
          label: detectedLang.toUpperCase(),
        };

      const linesCount = rawText.split("\n").length;

      // 2. 标记与样式类应用
      block.classList.add("edgeever-code-pro-block");
      block.classList.remove(
        "edgeever-theme-one-dark",
        "edgeever-theme-github-dark",
        "edgeever-theme-tokyo-night",
        "edgeever-theme-github-light"
      );
      block.classList.add(`edgeever-theme-${settings.codeTheme}`);

      // 3. 构建/更新顶部 Mac 风格工具栏
      let toolbar = block.querySelector(".edgeever-code-pro-toolbar");
      if (!toolbar) {
        toolbar = document.createElement("div");
        toolbar.className = "edgeever-code-pro-toolbar";
        toolbar.setAttribute("contenteditable", "false");
        block.insertBefore(toolbar, block.firstChild);
      } else {
        toolbar.innerHTML = "";
      }

      const left = document.createElement("div");
      left.className = "edgeever-code-pro-left";

      // Mac 三色圆点（黄色圆点支持点击折叠/展开）
      if (settings.showMacDots) {
        const dots = document.createElement("div");
        dots.className = "edgeever-code-mac-dots";
        dots.innerHTML =
          '<span class="edgeever-code-dot red"></span><span class="edgeever-code-dot yellow" title="点击折叠/展开代码"></span><span class="edgeever-code-dot green"></span>';
        dots.querySelector(".yellow").onclick = (e) => {
          e.stopPropagation();
          toggleCollapse();
        };
        left.appendChild(dots);
      }

      // 折叠提示标签引用
      let collapseHintEl = null;

      // 可编辑/切换的语言徽标
      if (settings.showLanguageBadge) {
        const langSelector = document.createElement("div");
        langSelector.className = "edgeever-code-lang-selector";

        const badgeBtn = document.createElement("button");
        badgeBtn.type = "button";
        badgeBtn.className = "edgeever-code-lang-badge";
        badgeBtn.title = "点击切换代码语言";
        badgeBtn.innerHTML = `
          <span class="edgeever-code-lang-text">${matchedLang.label}</span>
          <svg class="edgeever-code-lang-chevron" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m6 9 6 6 6-6"/></svg>
        `;

        const menu = document.createElement("div");
        menu.className = "edgeever-code-lang-menu";

        SUPPORTED_LANGUAGES.forEach((l) => {
          const item = document.createElement("button");
          item.type = "button";
          item.className = `edgeever-code-lang-item${l.id === detectedLang ? " active" : ""}`;
          item.textContent = l.label;
          item.onclick = (e) => {
            e.stopPropagation();
            langSelector.classList.remove("open");
            changeCodeBlockLanguage(block, sourceEl, l.id);
          };
          menu.appendChild(item);
        });

        badgeBtn.onclick = (e) => {
          e.stopPropagation();
          const isOpen = langSelector.classList.contains("open");
          document.querySelectorAll(".edgeever-code-lang-selector.open").forEach((el) => {
            el.classList.remove("open");
          });
          if (!isOpen) {
            langSelector.classList.add("open");
          }
        };

        langSelector.appendChild(badgeBtn);
        langSelector.appendChild(menu);
        left.appendChild(langSelector);

        // 折叠行数提示
        collapseHintEl = document.createElement("span");
        collapseHintEl.className = "edgeever-code-collapsed-hint";
        collapseHintEl.textContent = `(已折叠 ${linesCount} 行)`;
        collapseHintEl.style.display = block.classList.contains("is-collapsed") ? "inline" : "none";
        collapseHintEl.onclick = (e) => {
          e.stopPropagation();
          toggleCollapse();
        };
        left.appendChild(collapseHintEl);
      }

      toolbar.appendChild(left);

      // 右侧操作区域
      const right = document.createElement("div");
      right.className = "edgeever-code-pro-right";

      // 折叠/展开控制逻辑
      let collapseBtn = null;
      function toggleCollapse() {
        const isCollapsed = block.classList.toggle("is-collapsed");
        if (collapseBtn) {
          collapseBtn.innerHTML = isCollapsed
            ? `
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
            <span>展开</span>
          `
            : `
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
            <span>折叠</span>
          `;
        }
        if (collapseHintEl) {
          collapseHintEl.style.display = isCollapsed ? "inline" : "none";
        }
      }

      // 折叠/展开按钮
      if (settings.showCollapseButton) {
        collapseBtn = document.createElement("button");
        collapseBtn.className = "edgeever-code-tool-btn edgeever-code-collapse-btn";
        collapseBtn.type = "button";
        collapseBtn.setAttribute("contenteditable", "false");
        const isCollapsed = block.classList.contains("is-collapsed");
        collapseBtn.innerHTML = isCollapsed
          ? `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
          <span>展开</span>
        `
          : `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="18 15 12 9 6 15"></polyline>
          </svg>
          <span>折叠</span>
        `;
        collapseBtn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleCollapse();
        };
        right.appendChild(collapseBtn);
      }

      // 右侧复制按钮（全面对接桌面端与网页端剪贴板）
      if (settings.showCopyButton) {
        const copyBtn = document.createElement("button");
        copyBtn.className = "edgeever-code-tool-btn edgeever-code-copy-btn";
        copyBtn.type = "button";
        copyBtn.setAttribute("contenteditable", "false");
        copyBtn.innerHTML = `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          <span>复制</span>
        `;
        copyBtn.onclick = async (e) => {
          e.preventDefault();
          e.stopPropagation();
          const textToCopy = sourceEl.innerText || sourceEl.textContent || "";
          const ok = await copyCodeToClipboard(textToCopy, block);
          if (ok) {
            copyBtn.classList.add("copied");
            const span = copyBtn.querySelector("span");
            if (span) span.textContent = "已复制 ✓";
            setTimeout(() => {
              copyBtn.classList.remove("copied");
              if (span) span.textContent = "复制";
            }, 2000);
          }
        };
        right.appendChild(copyBtn);
      }

      toolbar.appendChild(right);

      // 4. 行号槽管理
      let existingGutter = block.querySelector(".edgeever-code-line-numbers");
      if (existingGutter) existingGutter.remove();

      if (settings.showLineNumbers && linesCount > 1) {
        block.classList.add("has-line-numbers");
        const lineNumbers = document.createElement("div");
        lineNumbers.className = "edgeever-code-line-numbers";
        lineNumbers.setAttribute("contenteditable", "false");
        lineNumbers.setAttribute("aria-hidden", "true");
        let numbersHtml = "";
        for (let num = 1; num <= linesCount; num++) {
          numbersHtml += `<span class="edgeever-code-line-number">${num}</span>`;
        }
        lineNumbers.innerHTML = numbersHtml;
        block.insertBefore(lineNumbers, sourceEl);
      } else {
        block.classList.remove("has-line-numbers");
      }

      // 5. 语法着色（核心逻辑）：
      // 只要语言是 ABAP 或用户手动指定了语言，且当前非编辑输入聚焦态，执行高亮
      const isEditing = document.activeElement === sourceEl || sourceEl.contains(document.activeElement);
      if (!isEditing) {
        const langKey = GRAMMARS[detectedLang] ? detectedLang : detectedLang === "abap" ? "abap" : null;
        if (langKey) {
          sourceEl.innerHTML = highlightCode(rawText, langKey);
        }
      }

      block.dataset.codeProProcessed = "true";
    }

    function processAllCodeBlocks() {
      const blocks = document.querySelectorAll(
        ".edgeever-code-block:not([data-code-pro-processed='true']), pre:not([data-code-pro-processed='true'])"
      );
      blocks.forEach((b) => beautifyCodeBlock(b, false));
    }

    function refreshAllCodeBlocks() {
      document.querySelectorAll(".edgeever-code-pro-block").forEach((el) => {
        delete el.dataset.codeProProcessed;
        el.querySelector(".edgeever-code-pro-toolbar")?.remove();
        el.querySelector(".edgeever-code-line-numbers")?.remove();
        el.classList.remove("has-line-numbers");
      });
      processAllCodeBlocks();
    }

    // 监听设置变化实时热重载
    context.events.on("settings.changed", async () => {
      await loadSettings();
      refreshAllCodeBlocks();
    });

    // 监听 DOM 树变动（笔记切换、代码块插入、内容更新）
    let debounceTimer = null;
    const observer = new MutationObserver(() => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(processAllCodeBlocks, 60);
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // 初始执行
    processAllCodeBlocks();
    setTimeout(processAllCodeBlocks, 300);

    // 注册手动刷新命令
    context.commands.register({
      id: "code-pro-refresh",
      title: "刷新所有代码块高亮与美化",
      listed: false,
      run() {
        refreshAllCodeBlocks();
        context.ui.showNotice("代码高亮与美化已全部刷新完成！");
      },
    });

    // 卸载与清理
    return () => {
      observer.disconnect();
      document.querySelectorAll(".edgeever-code-pro-toolbar").forEach((b) => b.remove());
      document.querySelectorAll(".edgeever-code-line-numbers").forEach((g) => g.remove());
      document.querySelectorAll(".edgeever-code-pro-block").forEach((p) => {
        delete p.dataset.codeProProcessed;
        p.classList.remove(
          "edgeever-code-pro-block",
          "has-line-numbers",
          "is-collapsed",
          "edgeever-theme-one-dark",
          "edgeever-theme-github-dark",
          "edgeever-theme-tokyo-night",
          "edgeever-theme-github-light"
        );
      });
    };
  },
};
