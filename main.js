/**
 * EdgeEver Code Pro Plugin
 * 专业级语法高亮引擎与代码块美化器
 * 原生深度适配 EdgeEver 编辑器与全语法高亮
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
        const alias = patternObj.alias;

        for (let i = 0; i < tokenList.length; i++) {
          const str = tokenList[i];
          if (tokenList.length > 20000) break;
          if (typeof str !== "string") continue;

          pattern.lastIndex = 0;
          const match = pattern.exec(str);
          if (!match) continue;

          let from = match.index;
          const matchStr = match[0];
          let content = matchStr;

          if (lookbehind && match[1]) {
            from += match[1].length;
            content = matchStr.slice(match[1].length);
          }

          const to = from + content.length;
          const before = str.slice(0, from);
          const after = str.slice(to);

          const tokenArgs = [i, 1];
          if (before) tokenArgs.push(before);

          const wrapped = inside
            ? new Prism.Token(token, Prism.tokenize(content, inside), alias)
            : new Prism.Token(token, content, alias);
          tokenArgs.push(wrapped);
          if (after) tokenArgs.push(after);

          tokenList.splice.apply(tokenList, tokenArgs);
          i += tokenArgs.length - 2;
        }
      }
    }
    return tokenList;
  },
  highlight: function (text, grammar) {
    const tokens = Prism.tokenize(text, grammar);
    return Prism.Token.stringify(tokens);
  },
};

Prism.Token.stringify = function (o) {
  if (typeof o === "string") {
    return o.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  if (Array.isArray(o)) {
    return o.map(Prism.Token.stringify).join("");
  }
  const classes = ["token", o.type];
  if (o.alias) {
    classes.push(o.alias);
  }
  return `<span class="${classes.join(" ")}">${Prism.Token.stringify(o.content)}</span>`;
};

// ==================== 2. SAP ABAP 语法定义 (标准扩展) ====================
Prism.languages.abap = {
  comment: [
    { pattern: /(^\*|\n\*).*$/m, greedy: true, alias: "abap-comment" },
    { pattern: /".*$/, greedy: true, alias: "abap-comment" },
  ],
  string: [
    { pattern: /'(?:''|[^'\r\n])*'/g, greedy: true, alias: "abap-string" },
    { pattern: /`(?:``|[^`\r\n])*`/g, greedy: true, alias: "abap-string" },
    { pattern: /\|(?:\\\||[^\|\r\n])*\|/g, greedy: true, alias: "abap-string" },
  ],
  "abap-system-var": {
    pattern: /\b(?:SY|SYST)-[A-Z0-9_]+\b/i,
    alias: "abap-system-var",
  },
  keyword: {
    pattern:
      /\b(?:REPORT|PROGRAM|FUNCTION-POOL|CLASS-POOL|INTERFACE-POOL|TYPE-POOL|TABLES|DATA|TYPES|CONSTANTS|STATICS|PARAMETERS|SELECT-OPTIONS|FIELD-SYMBOLS|CLASS|ENDCLASS|INTERFACE|ENDINTERFACE|METHOD|ENDMETHOD|MODULE|ENDMODULE|FORM|ENDFORM|FUNCTION|ENDFUNCTION|DO|ENDDO|WHILE|ENDWHILE|LOOP|ENDLOOP|AT|ENDAT|IF|ELSEIF|ELSE|ENDIF|CASE|WHEN|ENDCASE|TRY|CATCH|CLEANUP|ENDTRY|CHECK|EXIT|CONTINUE|RETURN|REJECT|STOP|CALL|PERFORM|SUBMIT|LEAVE|RAISE|MESSAGE|SELECT|SINGLE|FROM|INTO|CORRESPONDING|FIELDS|WHERE|GROUP|BY|HAVING|ORDER|APPENDING|INSERT|UPDATE|MODIFY|DELETE|COMMIT|WORK|ROLLBACK|OPEN|FETCH|CLOSE|READ|TABLE|APPEND|SORT|ASSIGN|UNASSIGN|CLEAR|FREE|MOVE|CONCATENATE|SPLIT|CONDENSE|TRANSLATE|REPLACE|SEARCH|SHIFT|DESCRIBE|COMPUTE|ADD|SUBTRACT|MULTIPLY|DIVIDE|TYPE|LIKE|REF|TO|VALUE|INITIAL|OPTIONAL|DEFAULT|STANDARD|SORTED|HASHED|INDEX|KEY|WITH|TRANSPORTING|NO|FIELDS|UP|ROWS|WHERE|EQ|NE|LT|LE|GT|GE|AND|OR|NOT|BETWEEN|IN|LIKE|IS|ASSIGNED|BOUND|INITIAL|EXPORTING|IMPORTING|CHANGING|RECEIVING|EXCEPTIONS|OTHERS|USING|TABLES|DEFINING|DEFINITION|IMPLEMENTATION|PUBLIC|PROTECTED|PRIVATE|ABSTRACT|FINAL|FOR|TESTING|INHERITING|INTERFACES|EVENTS|ALIASES|CREATE|OBJECT|SET|GET|HANDLER|ACTIVATION|STATUS|TITLEBAR)\b/i,
    alias: "abap-keyword",
  },
  function: {
    pattern: /\b(?:CONV|COND|SWITCH|CAST|EXACT|REDUCE|FILTER|CORRESPONDING|LINE_EXISTS|LINE_INDEX|VALUE)\b|\b[A-Za-z0-9_]+(?=\s*\()/i,
    alias: "abap-function",
  },
  number: /\b\d+(?:\.\d+)?\b/,
  operator: /[-+*\/=<>~]|->|=>|->\*|&&|\|\|/,
  punctuation: /[,.:()]/,
};

// ==================== 3. 主流编程语言轻量化高亮支持 ====================
Prism.languages.javascript = {
  comment: [/\/\*[\s\S]*?\*\//, /\/\/.*/],
  string: /(["'`])(?:\\[\s\S]|(?!\1)[^\\])*\1/,
  keyword: /\b(?:async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|export|extends|finally|for|from|function|get|if|import|in|instanceof|let|new|of|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/,
  number: /\b(?:0[xX][0-9a-fA-F]+|0[bB][01]+|\d+(?:\.\d+)?)\b/,
  operator: /[-+*\/%=!&|<>^?~:]+/,
  punctuation: /[{}[\];(),.:]/,
  function: /\b[a-zA-Z_$][a-zA-Z0-9_$]*(?=\s*\()/,
};
Prism.languages.js = Prism.languages.javascript;
Prism.languages.typescript = Object.assign({}, Prism.languages.javascript, {
  keyword: /\b(?:type|interface|enum|namespace|declare|as|is|keyof|readonly|implements|async|await|break|case|catch|class|const|continue|default|delete|do|else|export|extends|finally|for|from|function|if|import|in|instanceof|let|new|of|return|switch|this|throw|try|typeof|var|while)\b/,
});
Prism.languages.ts = Prism.languages.typescript;

Prism.languages.python = {
  comment: /#.*/,
  string: /(?:"""[\s\S]*?"""|'''[\s\S]*?'''|(["'])(?:\\[\s\S]|(?!\1)[^\\])*\1)/,
  keyword: /\b(?:and|as|assert|async|await|break|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|raise|return|try|while|with|yield)\b/,
  number: /\b\d+(?:\.\d+)?\b/,
  function: /\b[a-zA-Z_][a-zA-Z0-9_]*(?=\s*\()/,
};
Prism.languages.py = Prism.languages.python;

Prism.languages.sql = {
  comment: [/--.*/, /\/\*[\s\S]*?\*\//],
  string: /'(?:''|[^'\r\n])*'/,
  keyword: /\b(?:SELECT|FROM|WHERE|INSERT|INTO|UPDATE|DELETE|JOIN|LEFT|RIGHT|INNER|OUTER|FULL|CROSS|ON|ORDER|BY|GROUP|HAVING|LIMIT|OFFSET|UNION|ALL|AS|DISTINCT|CREATE|TABLE|INDEX|VIEW|DROP|ALTER|PRIMARY|KEY|FOREIGN|REFERENCES|CHECK|DEFAULT|NULL|NOT|AND|OR|IN|BETWEEN|LIKE|IS|EXISTS|CASE|WHEN|THEN|ELSE|END)\b/i,
  number: /\b\d+(?:\.\d+)?\b/,
  function: /\b(?:COUNT|SUM|AVG|MIN|MAX|COALESCE|NOW|CONCAT|SUBSTRING|TRIM)\b/i,
};

Prism.languages.json = {
  property: /"(?:\\.|[^\\"\r\n])*"(?=\s*:)/,
  string: /"(?:\\.|[^\\"\r\n])*"/,
  number: /-?\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/,
  punctuation: /[{}[\]:,]/,
  boolean: /\b(?:true|false|null)\b/,
};

Prism.languages.bash = {
  comment: /#.*/,
  string: /(["'])(?:\\[\s\S]|(?!\1)[^\\])*\1/,
  keyword: /\b(?:if|then|else|elif|fi|for|while|until|do|done|in|case|esac|function|return|exit|export|local)\b/,
  variable: /\$[a-zA-Z0-9_?*#@!$-]+/,
  function: /\b[a-zA-Z_][a-zA-Z0-9_-]*(?=\s*\()/,
};
Prism.languages.sh = Prism.languages.bash;
Prism.languages.shell = Prism.languages.bash;

// 语言映射表
const LANG_MAP = {
  abap: { id: "abap", label: "ABAP" },
  "sap-abap": { id: "abap", label: "SAP ABAP" },
  javascript: { id: "javascript", label: "JavaScript" },
  js: { id: "javascript", label: "JavaScript" },
  typescript: { id: "typescript", label: "TypeScript" },
  ts: { id: "typescript", label: "TypeScript" },
  python: { id: "python", label: "Python" },
  py: { id: "python", label: "Python" },
  sql: { id: "sql", label: "SQL" },
  json: { id: "json", label: "JSON" },
  bash: { id: "bash", label: "Bash" },
  sh: { id: "bash", label: "Shell" },
  shell: { id: "bash", label: "Shell" },
  html: { id: "javascript", label: "HTML" },
  css: { id: "javascript", label: "CSS" },
  c: { id: "javascript", label: "C" },
  cpp: { id: "javascript", label: "C++" },
  csharp: { id: "javascript", label: "C#" },
  java: { id: "javascript", label: "Java" },
  go: { id: "javascript", label: "Go" },
  rust: { id: "javascript", label: "Rust" },
  yaml: { id: "javascript", label: "YAML" },
  markdown: { id: "javascript", label: "Markdown" },
};

// ==================== 4. Highlight.js ABAP 语法定义 (用于注入 EdgeEver Lowlight) ====================
function getAbapHljsDefinition() {
  return {
    name: "ABAP",
    case_insensitive: true,
    aliases: ["sap-abap", "abap"],
    keywords: {
      keyword:
        "ABBREVIATED ABS ABSTRACT ABSTRACTFINAL ACCEPT ACCEPTING ACCORDING ACOS ACTUAL ADD ADD-CORRESPONDING ADDITIONS ADJACENT AFTER " +
        "ALIASES ALL ALLOCATE ANALYZER AND APPEND APPENDING AS ASCENDING DESCENDING ASIN ASSIGN ASSIGNING ATAN ATTRIBUTE AUTHORITY-CHECK " +
        "AVG BACK BACKGOUND BEFORE BETWEEN BINARY BIT BLANK BLOCK BREAK-POINT BUFFER BY BYPASSING BYTE BYTECHARACTER CALL " +
        "CASTING CEIL CENTERED CHANGE CHANGING CHARACTER CHECK CHECKBOX CLASS-DATA CLASS-EVENTS CLASS-METHODS CLEANUP CLEAR " +
        "CLASS ENDCLASS CLIENT CLOCK CLOSE COL_BACKGROUND COL_HEADING COL_NORMAL COL_TOTAL COLLECT COLOR COLUMN COMMENT COMMIT COMMON COMMUNICATION COMPARING " +
        "COMPONENT COMPONENTS COMPUTE CONCATENATE CONDENSE CONSTANTS CONTEXT CONTEXTS CONTINUE CONTROL CONTROLS CONVERSION CONVERT COS COSH COUNT COUNTRY " +
        "COUNTY CREATE CURRENCY CURRENT CURSOR CUSTOMER-FUNCTION DATA DATABASE DATASET DATE DEALLOCATE DECIMALS DEFAULT DEFERRED " +
        "DEFINE DEFINING DEFINITION DELETE DELETING DEMAND DESCENDING DESCRIBE DESTINATION DIALOG DIRECTORY DISTANCE DISTINCT DIVIDE DIVIDE-CORRESPONDING " +
        "DUPLICATE DUPLICATES DURING DYNAMIC EDIT EDITOR-CALL ELSE ELSEIF ENCODING ENDING ENDON ENTRIES ERRORS EVENT EVENTS EXCEPTION EXCEPTIONS EXCEPTION-TABLE " +
        "EXCLUDE EXCLUDING EXIT EXIT-COMMAND EXPORT EXPORTING EXTENDED EXTENSION EXTRACT FETCH FIELD FIELD-GROUPS FIELDSNO FIELD-SYMBOLS FILTER FINAL FIND " +
        "FIRST FLOOR FOR FORMAT FORWARDBACKWARD FOUND FRAC FRAME FREE FRIENDS FROM FUNCTION-POOL GET GIVING GROUP HANDLER HASHED HAVING HEADER HEADING " +
        "HELP-ID HIDE HIGHLOW HOLD HOTSPOT ICON IGNORING IMMEDIATELY IMPLEMENTATION IMPORT IMPORTING IN INCLUDE INCREMENT INDEX INDEX-LINE INHERITING " +
        "INIT INITIAL INITIALIZATION INNER INNERLEFT INSERT INSTANCES INTENSIFIED INTERFACES INTERVALS INTO INVERTED-DATE IS ITAB JOIN KEEPING " +
        "KEY KEYS KIND LANGUAGE LAST LEADING LEAVE LEFT LEFT-JUSTIFIED LEFTRIGHT LEFTRIGHTCIRCULAR LEGACY LENGTH LIKE LINE LINE-COUNT LINES LINE-SELECTION " +
        "LINE-SIZE LIST LIST-PROCESSING LOAD LOAD-OF-PROGRAM LOCAL LOCALE LOG LOG10 LOWER " +
        "MARGIN MARK MASK MATCH MAX MAXIMUM MEMORY MESSAGE MESSAGE-ID MESSAGES METHODS MIN MOD MODE MODEIN MODIF MODIFIER MODIFY MOVE MOVE-CORRESPONDING " +
        "MULTIPLY MULTIPLY-CORRESPONDING NEW NEW-LINE NEW-PAGE NEXT NODES NODETABLE NO-DISPLAY NO-GAP NO-GAPS NO-HEADINGWITH-HEADING NO-SCROLLING " +
        "NO-SCROLLINGSCROLLING NOT NO-TITLE WITH-TITLE NO-ZERO NP NS NUMBER OBJECT OBLIGATORY OCCURENCE OCCURENCES OCCURS OF OFF OFFSET ON ONLY OPEN " +
        "OPTION OPTIONAL OR ORDER OTHERS OUTER OUTPUT-LENGTH OVERLAY PACK PACKAGE PAGE PAGELAST PAGEOF PAGEPAGE PAGES PARAMETER PARAMETERS PARAMETER-TABLE " +
        "PART PERFORM PERFORMING PFN PF-STATUS PLACES POS_HIGH POS_LOW POSITION POSITIONS PRIMARY PRINT PRINT-CONTROL PRIVATE PROCESS PROGRAM PROPERTY " +
        "PROTECTED PUBLIC PUSHBUTTON PUT QUICKINFO RADIOBUTTON RAISE RAISING RANGE RANGES READ RECEIVE RECEIVING REDEFINITION " +
        "REF REFERENCE REFRESH REJECT RENAMING REPLACE REPLACEMENT REPORT RESERVE RESET RESOLUTION RESULTS RETURN RETURNING RIGHT RIGHT-JUSTIFIED " +
        "ROLLBACK ROWS RUN SCAN SCREEN SCREEN-GROUP1 SCREEN-GROUP2 SCREEN-GROUP3 SCREEN-GROUP4 SCREEN-GROUP5 SCREEN-INPUT SCREEN-INTENSIFIED SCROLL " +
        "SCROLL-BOUNDARY SEARCH SECTION SELECT SELECTION SELECTIONS SELECTION-SCREEN SELECTION-SET SELECTION-TABLE SELECT-OPTIONS SEND SEPARATED SET " +
        "SHARED SHIFT SIGN SIN SINGLE SINGLEDISTINCT SINH SIZE SKIP SORT SORTABLE SPECIFIED SPLIT SQL SQRT STABLE STAMP STANDARD START STARTING " +
        "STATICS STEP-LOOP STOP STRLEN STRUCTURE SUBMIT SUBTRACT SUBTRACT-CORRESPONDING SUFFIX SUM SUPPLY SUPPRESS SYMBOLS SYSTEM-EXCEPTIONS TABLE TABLENAME " +
        "TABLES TABLEVIEW TAN TANH TASK TEXT THEN TIME TIMES TITLE TITLEBAR TO TOPIC TOP-OF-PAGE TRAILING TRANSACTION TRANSFER TRANSLATE TRUNC TYPE " +
        "TYPELIKE TYPE-POOL TYPE-POOLS TYPES ULINE UNION UNIQUE UNIT UNTIL UP UPDATE UPPER UPPERLOWER USER-COMMAND USING VALUE VALUES VARY VARYING " +
        "VERSION VIA WAIT WHEN WHERE WINDOW WITH WORK WRITE XSTRLEN ZONE " +
        "CA CN CO CP CS EQ GE GT LE LT NA NE " +
        "START-OF-SELECTION START-OF-PAGE END-OF-PAGE END-OF-SELECTION AT ENDAT " +
        "EQUIV BOUND ASSIGNED SUPPLIED INSTANCE VALUE COND CONV CAST SWITCH",
      literal: "abap_true abap_false abap_undefined space null",
      built_in:
        "DO FORM IF LOOP MODULE START-OF_FILE DEFINE WHILE BEGIN ENDDO ENDFORM ENDIF ENDLOOP ENDMODULE END-OF_FILE END-OF-DEFINITION ENDWHILE END " +
        "METHOD ENDMETHOD CHAIN ENDCHAIN CASE ENDCASE FUNCTION ENDFUNCTION ELSEIF ELSE TRY ENDTRY CATCH " +
        "sy-subrc sy-tabix sy-index sy-ucomm sy-datum sy-uzeit sy-uname sy-mandt sy-dynnr sy-tcode SY-SUBRC SY-TABIX SY-INDEX SY-UCOMM SY-DATUM SY-UZEIT SY-UNAME SY-MANDT",
    },
    contains: [
      {
        className: "string",
        begin: /'/,
        end: /'/,
        contains: [{ begin: /''/ }],
      },
      {
        className: "string",
        begin: /`/,
        end: /`/,
        contains: [{ begin: /``/ }],
      },
      {
        className: "string",
        begin: /\|/,
        end: /\|/,
        contains: [{ begin: /\\\|/ }],
      },
      {
        className: "number",
        begin: /\b\d+(?:\.\d+)?\b/,
      },
      {
        className: "comment",
        begin: /^[*]/,
        relevance: 0,
        end: /$/,
      },
      {
        className: "comment",
        begin: /"/,
        relevance: 0,
        end: /$/,
      },
    ],
  };
}

// ==================== 5. 插件主生命周期定义 ====================
export default {
  async activate(context) {
    const settings = {
      showMacDots: true,
      showLanguageBadge: true,
      showCopyButton: true,
      showLineNumbers: true,
      autoDetectAbap: true,
      codeTheme: "one-dark",
    };

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

    // 尝试将 ABAP 语法注入 EdgeEver 内置的 Lowlight / TipTap 实例
    let abapInjectedIntoLowlight = false;
    function tryInjectAbapIntoLowlight() {
      if (abapInjectedIntoLowlight) return true;
      const pm = document.querySelector(".ProseMirror");
      if (!pm) return false;

      let editor = pm.pmViewDesc?.view?.editor;
      if (!editor) {
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

      if (editor && editor.extensionManager) {
        const codeBlockExt = editor.extensionManager.extensions.find((e) => e.name === "codeBlock");
        const lowlight = codeBlockExt?.options?.lowlight;
        if (lowlight) {
          const registerFn = lowlight.register || lowlight.registerLanguage;
          if (typeof registerFn === "function") {
            try {
              registerFn.call(lowlight, "abap", getAbapHljsDefinition);
              registerFn.call(lowlight, "sap-abap", getAbapHljsDefinition);
              abapInjectedIntoLowlight = true;
              if (editor.view && editor.state) {
                editor.view.dispatch(editor.state.tr);
              }
              return true;
            } catch (e) {}
          }
        }
      }
      return false;
    }

    /**
     * 判断文本是否包含明显的 ABAP 语法特征
     */
    function detectIsAbap(codeText) {
      return /\b(REPORT\s+[A-Z0-9_]+|DATA:?|TYPES:?|FORM\s+[A-Z0-9_]+|CALL\s+FUNCTION|SELECT\s+SINGLE|TABLES:?|CLASS\s+[A-Z0-9_]+\s+DEFINITION|METHOD\s+[A-Z0-9_]+|ENDMETHOD|ENDFORM|ENDSELECT|SY-SUBRC)\b/i.test(
        codeText
      );
    }

    /**
     * 对单个代码块执行 UI 装饰与语法高亮
     * 兼容 EdgeEver 原生 .edgeever-code-block 容器与标准 pre/code
     */
    function beautifyCodeBlock(block) {
      // 忽略正在渲染 SVG 的 Mermaid 代码块
      if (block.classList.contains("edgeever-mermaid-code-block") && !block.classList.contains("is-source-visible")) {
        return;
      }

      // 获取代码源容器
      const sourceEl = block.querySelector(".edgeever-code-source") || block.querySelector("code") || block;
      if (!sourceEl) return;

      const rawText = sourceEl.textContent || "";
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

      detectedLang = detectedLang || "text";
      const langMeta = LANG_MAP[detectedLang] || { id: detectedLang, label: detectedLang.toUpperCase() };

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

      if (settings.showMacDots) {
        const dots = document.createElement("div");
        dots.className = "edgeever-code-mac-dots";
        dots.innerHTML =
          '<span class="edgeever-code-dot red"></span><span class="edgeever-code-dot yellow"></span><span class="edgeever-code-dot green"></span>';
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
        copyBtn.setAttribute("contenteditable", "false");
        copyBtn.innerHTML = `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          <span>复制</span>
        `;
        copyBtn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          const textToCopy = sourceEl.textContent || "";
          navigator.clipboard.writeText(textToCopy).then(() => {
            copyBtn.classList.add("copied");
            const span = copyBtn.querySelector("span");
            if (span) span.textContent = "已复制 ✓";
            setTimeout(() => {
              copyBtn.classList.remove("copied");
              if (span) span.textContent = "复制";
            }, 2000);
          });
        };
        toolbar.appendChild(copyBtn);
      }

      // 4. 行号槽管理
      const linesCount = rawText.split("\n").length;
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

      // 5. 语法着色补充（当原生 lowlight 未处理且用户非聚焦编辑状态时，由 Prism 执行着色）
      const isEditing = document.activeElement === sourceEl || sourceEl.contains(document.activeElement);
      const hasNativeHighlight = sourceEl.querySelector(".hljs-keyword, .hljs-string, .token");
      if (!hasNativeHighlight && !isEditing) {
        const grammar = Prism.languages[langMeta.id] || (detectedLang === "abap" ? Prism.languages.abap : null);
        if (grammar) {
          sourceEl.innerHTML = Prism.highlight(rawText, grammar);
        }
      }

      block.dataset.codeProProcessed = "true";
    }

    function processAllCodeBlocks() {
      tryInjectAbapIntoLowlight();
      const blocks = document.querySelectorAll(
        ".edgeever-code-block:not([data-code-pro-processed='true']), pre:not([data-code-pro-processed='true'])"
      );
      blocks.forEach(beautifyCodeBlock);
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
    // 延迟 300ms 再次触发一次以保证编辑器水合完成后捕获
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
          "edgeever-theme-one-dark",
          "edgeever-theme-github-dark",
          "edgeever-theme-tokyo-night",
          "edgeever-theme-github-light"
        );
      });
    };
  },
};
