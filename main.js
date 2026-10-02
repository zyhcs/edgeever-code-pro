/**
 * EdgeEver Code Pro Plugin
 * 专业级语法高亮引擎与代码块美化器
 */

// ==================== 1. 轻量化标准 Prism 语法引擎核心 ====================
const Prism = {
  languages: {},
  Token: function (type, content, alias) {
    this.type = type;
    this.content = content;
    this.alias = alias;
  },
  tokenize: function (text, grammar) {
    const rest = grammar.rest;
    if (rest) {
      for (const token in rest) {
        grammar[token] = rest[token];
      }
      delete grammar.rest;
    }

    const tokenList = [text];
    for (const token in grammar) {
      if (!grammar.hasOwnProperty(token) || !grammar[token]) continue;

      let patterns = grammar[token];
      patterns = Array.isArray(patterns) ? patterns : [patterns];

      for (let j = 0; j < patterns.length; ++j) {
        const patternObj = patterns[j];
        const pattern = patternObj.pattern || patternObj;
        const inside = patternObj.inside;
        const lookbehind = Boolean(patternObj.lookbehind);
        const lookbehindLength = 0;
        const alias = patternObj.alias;

        for (let i = 0; i < tokenList.length; i++) {
          const str = tokenList[i];
          if (tokenList.length > 20000) break; // 保护
          if (typeof str !== "string") continue;

          pattern.lastIndex = 0;
          const match = pattern.exec(str);
          if (!match) continue;

          let from = match.index;
          const matchStr = match[0];
          let content = matchStr;

          if (lookbehind && match[1]) {
            const lb = match[1].length;
            from += lb;
            content = content.slice(lb);
          }

          const to = from + content.length;
          const before = str.slice(0, from);
          const after = str.slice(to);

          const args = [i, 1];
          if (before) args.push(before);

          const wrapped = new Prism.Token(
            token,
            inside ? Prism.tokenize(content, inside) : content,
            alias
          );
          args.push(wrapped);
          if (after) args.push(after);

          tokenList.splice.apply(tokenList, args);
          i += args.length - 2;
        }
      }
    }
    return tokenList;
  },
  encode: function (tokens) {
    if (typeof tokens === "string") {
      return tokens
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }
    if (Array.isArray(tokens)) {
      return tokens.map(Prism.encode).join("");
    }
    const content = Prism.encode(tokens.content);
    const classes = ["token", tokens.type];
    if (tokens.alias) {
      classes.push(tokens.alias);
    }
    return `<span class="${classes.join(" ")}">${content}</span>`;
  },
  highlight: function (text, grammar) {
    if (!grammar) return Prism.encode(text);
    const tokens = Prism.tokenize(text, grammar);
    return Prism.encode(tokens);
  },
};

// ==================== 2. 官方标准语言语法定义库 ====================

// 2.1 完整 SAP ABAP 语法定义
Prism.languages.abap = {
  "abap-comment": [
    { pattern: /^\*.*$/m, greedy: true },
    { pattern: /".*$/m, greedy: true },
  ],
  "abap-string": {
    pattern: /'(?:''|[^'\r\n])*'|`[^`\r\n]*`/,
    greedy: true,
  },
  "abap-system-var": {
    pattern: /\bSY-[A-Z0-9_]+\b/i,
    alias: "symbol",
  },
  "abap-keyword": {
    pattern: /\b(?:ADD|ADD-CORRESPONDING|ADJACENT|AFTER|ALIASES|ALL|ANALYZER|AND|ANY|APPEND|APPENDING|AS|ASCENDING|ASSIGN|ASSIGNED|ASSIGNING|AT|AUTHORITY-CHECK|BACK|BEGIN|BINARY|BLANK|BLOCK|BOUND|BREAK|BREAK-POINT|BUFFER|BY|CALL|CASE|CATCH|CEIL|CENTERED|CHAIN|CHECK|CLASS|CLASS-DATA|CLASS-METHODS|CLEAR|CLIENT|CLOSE|CN|CO|COLLECT|COMMUNICATION|COMPARING|COMPONENT|COMPONENTS|COMPUTE|CONCATENATE|CONDENSE|CONSTANTS|CONTEXT|CONTEXTS|CONTINUE|CONTROLS|CONVERT|COPY|CORRESPONDING|COUNT|CP|CREATE|CS|CURRENCY|CUSTOMER-FUNCTION|DATA|DATABASE|DATAINFO|DATATYPE|DATE|DECIMALS|DEFAULT|DEFINE|DEFINITION|DELETE|DELETING|DEMAND|DESCENDING|DESCRIBE|DESTINATION|DETAIL|DIALOG|DIRECTORY|DIVIDE|DIVIDE-CORRESPONDING|DO|DUPLICATES|DURING|DYNAMIC|EDIT|EDITOR-CALL|ELSE|ELSEIF|END|END-OF-DEFINITION|END-OF-PAGE|END-OF-SELECTION|ENDAT|ENDCASE|ENDCATCH|ENDCHAIN|ENDCLASS|ENDDO|ENDFORM|ENDFUNCTION|ENDIF|ENDINTERFACE|ENDLOOP|ENDMETHOD|ENDMODULE|ENDON|ENDPROVIDE|ENDSELECT|ENDTRY|ENDWHILE|ENTRY|EQ|EQUAL|ERRORMESSAGE|EVENTS|EXCEPT|EXCEPTION|EXCEPTIONS|EXEC|EXECUTE|EXIT|EXIT-COMMAND|EXPAND|EXPORT|EXPORTING|EXTRACT|FETCH|FIELD|FIELD-GROUPS|FIELD-SYMBOLS|FIELDS|FIND|FIRST|FLOOR|FOR|FORM|FORMAT|FORWARD|FREE|FROM|FUNCTION|FUNCTION-POOL|GE|GENERATE|GET|GIVING|GREATER|GROUP|HANDLER|HAVING|HEADER|HELP-REQUEST|HIDE|HIGH|HOLD|ID|IDENTIFICATION|IF|IGNORE|IMPLEMENTATION|IMPORT|IMPORTING|IN|INCLUDE|INCLUDING|INCREMENT|INDEX|INDEX-LINE|INFOS|INITIAL|INITIALIZATION|INNER|INPUT|INSERT|INSTANCE|INSTANCES|INTERFACE|INTERFACES|INTERVALS|INTO|INVERSE|IS|JOIN|KEY|LANGUAGE|LAST|LE|LEADING|LEAVE|LEFT|LEFT-JUSTIFIED|LEQ|LESS|LIKE|LINE|LINE-COUNT|LINE-SELECTION|LINE-SIZE|LINES|LIST-PROCESSING|LOAD|LOAD-OF-PROGRAM|LOCAL|LOCALE|LOG-POINT|LOG10|LOOP|LOW|LOWER|M|MATCH|MATCHCODE|MAX|MAXIMUM|MEDIUM|MEMORY|MESSAGE|MESSAGE-ID|MESSAGES|METHOD|METHODS|MIN|MINIMUM|MOD|MODE|MODIF|MODIFIER|MODIFY|MODULE|MOVE|MOVE-CORRESPONDING|MULTIPLY|MULTIPLY-CORRESPONDING|NEW|NEW-LINE|NEW-PAGE|NEXT|NO|NO-EXTENSION|NO-GAP|NO-GAPS|NO-GROUPING|NO-HEADING|NO-SCROLLING|NO-SIGN|NO-TITLE|NO-TOP-OF-PAGE|NO-ZERO|NODES|NON-UNIQUE|NOT|NP|NS|NULL|O|OBJECT|OBJECTS|OBLIGATORY|OCCURRENCE|OCCURRENCES|OCCURS|OF|OFF|OFFSET|ON|OPEN|OPTION|OPTIONAL|OPTIONS|OR|ORDER|OTHERS|OUTER|OUTPUT|OUTPUT-LENGTH|OVERLAY|PACK|PACKAGE|PAGE|PAGES|PARAMETER|PARAMETERS|PART|PERFORM|PERFORMING|PF-STATUS|PLACES|POOL|POSITION|PRINT|PRINT-CONTROL|PRIVATE|PROCESS|PROGRAM|PROPERTY|PROTECTED|PROVIDE|PUBLIC|PUSH|PUT|RADIOBUTTON|RAISE|RAISING|RANGE|RANGES|READ|RECEIVE|RECEIVING|REDIFINITION|REFERENCE|REFRESH|REGEX|REJECT|REPLACE|REPLACEMENT|REPORT|RESERVE|RESET|RESOLUTION|RESPECTING|RESPONSIBLE|RESULT|RESULTS|RETAIN|RETURN|RETURNING|RIGHT|RIGHT-JUSTIFIED|ROLLBACK|ROUND|ROWS|RUN|SCAN|SCREEN|SCROLL|SCROLL-BOUNDARY|SCROLLING|SEARCH|SECTION|SELECT|SELECTION|SELECTION-SCREEN|SELECTION-SET|SELECTION-SETS|SELECTION-TABLE|SELECTIONS|SEND|SEPARATE|SEPARATED|SET|SHARED|SHIFT|SIGN|SINGLE|SIZE|SKIP|SKIPPING|SORT|SORTABLE|SORTED|SPACE|SPECIFIED|SPLIT|STANDARD|STAMP|START-OF-SELECTION|STARTING|STATICS|STATUS|STOP|STRUCTURE|STRUCTURES|SUBKEY|SUBMATCHES|SUBMIT|SUBTRACT|SUBTRACT-CORRESPONDING|SUM|SUMMARY|SUPPRESS|SYMBOL|SYNTAX-CHECK|TABLE|TABLES|TABSTRIP|TIME|TITLE|TITLEBAR|TO|TOP-OF-PAGE|TRAILING|TRANSACTION|TRANSFER|TRANSLATE|TRUNC|TRUNCATE|TRUNCATION|TRY|TYPE|TYPE-POOL|TYPE-POOLS|TYPES|ULINE|UNDER|UNIQUE|UNIT|UNPACK|UNTIL|UP|UPDATE|UPPER|USER-COMMAND|USING|VALUE|VALUES|VIA|WAIT|WHEN|WHERE|WHILE|WINDOW|WITH|WITH-HEADING|WITHOUT|WORD|WORK|WRITE|ZONE)\b/i,
    alias: "keyword",
  },
  "abap-type": {
    pattern: /\b(?:C|N|D|T|I|INT1|INT2|INT4|INT8|P|DECFLOAT16|DECFLOAT34|F|STRING|X|XSTRING|BAPIPAREX|BAPIRET2)\b/i,
    alias: "type",
  },
  "abap-number": /\b\d+(?:\.\d+)?\b/,
  operator: /[-+*\/=<>~]|->|=>|->\*|&|\b(?:AND|OR|NOT|EQ|NE|LT|LE|GT|GE|IS\s+INITIAL|IS\s+NOT\s+INITIAL|IS\s+BOUND|IS\s+ASSIGNED)\b/i,
  punctuation: /[,.:()]/,
};

// 2.2 JavaScript / TypeScript 核心定义
Prism.languages.javascript = {
  comment: [
    { pattern: /\/\/.*/, greedy: true },
    { pattern: /\/\*[\s\S]*?\*\//, greedy: true },
  ],
  string: { pattern: /(["'`])(?:\\[\s\S]|(?!\1)[^\\])*\1/, greedy: true },
  keyword: /\b(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
  boolean: /\b(?:true|false)\b/,
  function: /\b[a-zA-Z_$][\w$]*(?=\s*(?:\.\s*)?\()/i,
  number: /\b(?:(?:0[xX][\dA-Fa-f]+|0[bB][01]+|0[oO][0-7]+)|(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?)\b/,
  operator: /--|\+\+|&&|\|\||=>|<=|>=|==|!=|\*\*|[-+*\/%&|^!=<>?~:]/,
  punctuation: /[{}[\];(),.:]/,
};
Prism.languages.js = Prism.languages.javascript;
Prism.languages.typescript = Prism.languages.javascript;
Prism.languages.ts = Prism.languages.javascript;

// 2.3 Python
Prism.languages.python = {
  comment: { pattern: /#.*/, greedy: true },
  "string-interpolation": { pattern: /[bBfFuUrR]?"""[\s\S]*?"""|[bBfFuUrR]?'''[\s\S]*?'''/, greedy: true },
  string: { pattern: /(?:[bBfFuUrR]?(["'])(?:\\[\s\S]|(?!\1)[^\\])*\1)/, greedy: true },
  keyword: /\b(?:and|as|assert|async|await|break|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|raise|return|try|while|with|yield)\b/,
  boolean: /\b(?:True|False|None)\b/,
  function: /\b[a-z_]\w*(?=\s*\()/i,
  number: /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\d+)(?:e[+-]?\d+)?j?\b/i,
  operator: /[-+*\/%&|^~=<>!:]+|\b(?:and|or|not|in|is)\b/,
  punctuation: /[{}[\];(),.]/,
};
Prism.languages.py = Prism.languages.python;

// 2.4 SQL
Prism.languages.sql = {
  comment: [
    { pattern: /--.*/, greedy: true },
    { pattern: /\/\*[\s\S]*?\*\//, greedy: true },
  ],
  string: { pattern: /'(?:''|[^'\\]|\\.)*'/, greedy: true },
  keyword: /\b(?:SELECT|INSERT|UPDATE|DELETE|FROM|WHERE|AND|OR|JOIN|INNER|OUTER|LEFT|RIGHT|GROUP|BY|ORDER|HAVING|LIMIT|OFFSET|AS|ON|IN|NOT|NULL|IS|CREATE|TABLE|DROP|ALTER|VIEW|INDEX|TRIGGER|PROCEDURE|FUNCTION|DATABASE|VALUES|SET|DEFAULT|CASE|WHEN|THEN|ELSE|END|UNION|ALL|DISTINCT|PRIMARY|KEY|FOREIGN|REFERENCES|CHECK|CONSTRAINT)\b/i,
  boolean: /\b(?:TRUE|FALSE)\b/i,
  number: /\b\d+(?:\.\d+)?\b/,
  operator: /[-+*\/=<>!%&|^~]+/,
  punctuation: /[{}[\];(),.:]/,
};

// 2.5 JSON
Prism.languages.json = {
  property: { pattern: /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?=\s*:)/, lookbehind: true, greedy: true },
  string: { pattern: /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?!\s*:)/, lookbehind: true, greedy: true },
  number: /-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,
  boolean: /\b(?:true|false)\b/,
  null: /\bnull\b/,
  punctuation: /[{}[\];,:]/,
};

// 2.6 Bash / Shell
Prism.languages.bash = {
  comment: { pattern: /(^|[\s#])#.*/, lookbehind: true, greedy: true },
  string: [
    { pattern: /(["'])(?:\\[\s\S]|(?!\1)[^\\])*\1/, greedy: true },
  ],
  variable: /\$+(?:[a-zA-Z0-9_?#*@!$]+|\{[a-zA-Z0-9_?#*@!$]+\})/,
  keyword: /\b(?:if|then|else|elif|fi|case|esac|for|while|until|do|done|in|function|select|return|exit)\b/,
  boolean: /\b(?:true|false)\b/,
  operator: /&&|\|\||;;|<<|>>|[=!<>~+*/%&-]/,
  punctuation: /[{}[\];(),]/,
};
Prism.languages.sh = Prism.languages.bash;
Prism.languages.shell = Prism.languages.bash;

// 语言别名表与展示名称映射
const LANG_MAP = {
  abap: { id: "abap", label: "ABAP" },
  js: { id: "javascript", label: "JavaScript" },
  javascript: { id: "javascript", label: "JavaScript" },
  ts: { id: "typescript", label: "TypeScript" },
  typescript: { id: "typescript", label: "TypeScript" },
  py: { id: "python", label: "Python" },
  python: { id: "python", label: "Python" },
  sql: { id: "sql", label: "SQL" },
  json: { id: "json", label: "JSON" },
  bash: { id: "bash", label: "Bash" },
  sh: { id: "bash", label: "Shell" },
  shell: { id: "bash", label: "Shell" },
  html: { id: "javascript", label: "HTML" },
  css: { id: "javascript", label: "CSS" },
  java: { id: "javascript", label: "Java" },
  c: { id: "javascript", label: "C" },
  cpp: { id: "javascript", label: "C++" },
  go: { id: "javascript", label: "Go" },
  rust: { id: "javascript", label: "Rust" },
};

// ==================== 3. 插件核心激活入口与生命周期 ====================

export default {
  async activate(context) {
    let settings = {
      showMacDots: true,
      showLanguageBadge: true,
      showCopyButton: true,
      showLineNumbers: true,
      autoDetectAbap: true,
      codeTheme: "one-dark",
    };

    // 读取持久化设置
    const loadSettings = async () => {
      try {
        const dots = await context.settings.get("show_mac_dots");
        const lang = await context.settings.get("show_language_badge");
        const copy = await context.settings.get("show_copy_button");
        const lines = await context.settings.get("show_line_numbers");
        const abap = await context.settings.get("auto_detect_abap");
        const theme = await context.settings.get("code_theme");

        if (dots !== null) settings.showMacDots = dots;
        if (lang !== null) settings.showLanguageBadge = lang;
        if (copy !== null) settings.showCopyButton = copy;
        if (lines !== null) settings.showLineNumbers = lines;
        if (abap !== null) settings.autoDetectAbap = abap;
        if (theme) settings.codeTheme = theme;
      } catch (e) {}
    };

    await loadSettings();

    // 监听设置变化实时热重载
    context.events.on("settings.changed", async () => {
      await loadSettings();
      // 清除旧渲染并重新执行
      document.querySelectorAll("pre.edgeever-code-pro-block").forEach((pre) => {
        delete pre.dataset.codeProProcessed;
        const bar = pre.querySelector(".edgeever-code-pro-toolbar");
        if (bar) bar.remove();
        const gutters = pre.querySelectorAll(".edgeever-code-line-numbers");
        gutters.forEach((g) => g.remove());
      });
      processAllCodeBlocks();
    });

    /**
     * 对单个代码块执行高亮与 UI 包装
     */
    function beautifyCodeBlock(pre) {
      if (pre.dataset.codeProProcessed === "true") return;

      const code = pre.querySelector("code");
      if (!code) return;

      const rawText = code.textContent || "";
      if (!rawText.trim()) return;

      // 1. 语言识别与嗅探
      let detectedLang = "";
      const classList = Array.from(code.classList).concat(Array.from(pre.classList));
      const langClass = classList.find((c) => c.startsWith("language-"));
      if (langClass) {
        detectedLang = langClass.replace("language-", "").toLowerCase();
      } else if (pre.dataset.language) {
        detectedLang = pre.dataset.language.toLowerCase();
      }

      // 若未指定语言且启用了 ABAP 智能嗅探
      if (!detectedLang && settings.autoDetectAbap) {
        if (
          /\b(REPORT\s+[A-Z0-9_]+|DATA:?|TYPES:?|FORM\s+[A-Z0-9_]+|CALL\s+FUNCTION|SELECT\s+SINGLE|TABLES:?)\b/i.test(
            rawText
          )
        ) {
          detectedLang = "abap";
        }
      }

      detectedLang = detectedLang || "text";
      const langMeta = LANG_MAP[detectedLang] || { id: detectedLang, label: detectedLang.toUpperCase() };

      // 2. 语法高亮着色
      const grammar = Prism.languages[langMeta.id] || Prism.languages.abap;
      const highlightedHtml = Prism.highlight(rawText, grammar);

      // 3. 构建现代代码块 DOM
      pre.classList.add("edgeever-code-pro-block");
      // 应用当前主题类
      pre.classList.remove(
        "edgeever-theme-one-dark",
        "edgeever-theme-github-dark",
        "edgeever-theme-tokyo-night",
        "edgeever-theme-github-light"
      );
      pre.classList.add(`edgeever-theme-${settings.codeTheme}`);

      // 3.1 构建顶部 Mac Toolbar
      const toolbar = document.createElement("div");
      toolbar.className = "edgeever-code-pro-toolbar";

      const left = document.createElement("div");
      left.className = "edgeever-code-pro-left";

      if (settings.showMacDots) {
        const dots = document.createElement("div");
        dots.className = "edgeever-code-mac-dots";
        dots.innerHTML = '<span class="edgeever-code-dot red"></span><span class="edgeever-code-dot yellow"></span><span class="edgeever-code-dot green"></span>';
        left.appendChild(dots);
      }

      if (settings.showLanguageBadge) {
        const badge = document.createElement("span");
        badge.className = "edgeever-code-lang-badge";
        badge.textContent = langMeta.label;
        left.appendChild(badge);
      }

      toolbar.appendChild(left);

      // 右侧复制按钮
      if (settings.showCopyButton) {
        const copyBtn = document.createElement("button");
        copyBtn.className = "edgeever-code-copy-btn";
        copyBtn.type = "button";
        copyBtn.innerHTML = `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          <span>复制</span>
        `;
        copyBtn.onclick = (e) => {
          e.stopPropagation();
          navigator.clipboard.writeText(rawText).then(() => {
            copyBtn.classList.add("copied");
            copyBtn.querySelector("span").textContent = "已复制 ✓";
            setTimeout(() => {
              copyBtn.classList.remove("copied");
              copyBtn.querySelector("span").textContent = "复制";
            }, 2000);
          });
        };
        toolbar.appendChild(copyBtn);
      }

      // 3.2 构建内容及行号槽
      code.innerHTML = highlightedHtml;

      const linesCount = rawText.split("\n").length;
      if (settings.showLineNumbers && linesCount > 1) {
        const contentWrap = document.createElement("div");
        contentWrap.className = "edgeever-code-pro-content";

        const lineNumbers = document.createElement("div");
        lineNumbers.className = "edgeever-code-line-numbers";
        let numbersHtml = "";
        for (let num = 1; num <= linesCount; num++) {
          numbersHtml += `<span class="edgeever-code-line-number">${num}</span>`;
        }
        lineNumbers.innerHTML = numbersHtml;

        contentWrap.appendChild(lineNumbers);
        code.parentNode.insertBefore(contentWrap, code);
        contentWrap.appendChild(code);
      }

      pre.insertBefore(toolbar, pre.firstChild);
      pre.dataset.codeProProcessed = "true";
    }

    function processAllCodeBlocks() {
      const root = document.querySelector(".ProseMirror, .tiptap, article") || document.body;
      const pres = root.querySelectorAll("pre:not([data-code-pro-processed='true'])");
      pres.forEach(beautifyCodeBlock);
    }

    // 防抖监听 DOM
    let debounceTimer = null;
    const observer = new MutationObserver(() => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(processAllCodeBlocks, 80);
    });

    observer.observe(document.body, { childList: true, subtree: true });
    processAllCodeBlocks();

    // 注册手动刷新命令
    context.commands.register({
      id: "code-pro-refresh",
      title: "刷新所有代码块高亮与美化",
      listed: false,
      run() {
        document.querySelectorAll("pre.edgeever-code-pro-block").forEach((el) => {
          delete el.dataset.codeProProcessed;
          el.querySelector(".edgeever-code-pro-toolbar")?.remove();
          el.querySelector(".edgeever-code-line-numbers")?.remove();
        });
        processAllCodeBlocks();
        context.ui.showNotice("代码高亮与美化已全部刷新完成！");
      },
    });

    // 卸载与清理
    return () => {
      observer.disconnect();
      document.querySelectorAll(".edgeever-code-pro-toolbar").forEach((b) => b.remove());
      document.querySelectorAll(".edgeever-code-line-numbers").forEach((g) => g.remove());
      document.querySelectorAll("pre.edgeever-code-pro-block").forEach((p) => {
        delete p.dataset.codeProProcessed;
        p.classList.remove("edgeever-code-pro-block");
      });
    };
  },
};
