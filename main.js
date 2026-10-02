/**
 * EdgeEver Code Pro Plugin
 * 专业级语法高亮引擎与代码块美化器
 * 原生深度适配 EdgeEver 编辑器与全语法高亮
 * v1.0.6 - 支持 Ray.so 风格代码卡片一键导出复制、点击行号重点行高亮与暗淡聚焦模式
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
        /\b(?:REPORT|PROGRAM|DATA|TYPES|CONSTANTS|STATICS|PARAMETERS|SELECT-OPTIONS|FIELD-SYMBOLS|CLASS|ENDCLASS|INTERFACE|ENDINTERFACE|METHOD|ENDMETHOD|MODULE|ENDMODULE|FORM|ENDFORM|FUNCTION|ENDFUNCTION|DO|ENDDO|WHILE|ENDWHILE|LOOP|ENDLOOP|AT|ENDAT|IF|ELSEIF|ELSE|ENDIF|CASE|WHEN|ENDCASE|TRY|CATCH|CLEANUP|ENDTRY|CHECK|EXIT|CONTINUE|RETURN|REJECT|STOP|CALL|METHOD|RECEIVING|IMPORTING|EXPORTING|CHANGING|TABLES|EXCEPTIONS|PERFORM|SUBMIT|LEAVE|RAISE|MESSAGE|SELECT|SINGLE|FROM|INTO|CORRESPONDING|FIELDS|WHERE|GROUP|BY|HAVING|ORDER|APPENDING|INSERT|UPDATE|MODIFY|DELETE|COMMIT|WORK|ROLLBACK|OPEN|FETCH|CLOSE|READ|TABLE|APPEND|SORT|ASSIGN|UNASSIGN|CLEAR|FREE|MOVE|MOVE-CORRESPONDING|CONCATENATE|SPLIT|CONDENSE|TRANSLATE|REPLACE|SEARCH|SHIFT|DESCRIBE|COMPUTE|ADD|SUBTRACT|MULTIPLY|DIVIDE|TYPE|LIKE|REF|TO|VALUE|INITIAL|OPTIONAL|DEFAULT|STANDARD|SORTED|HASHED|INDEX|KEY|WITH|TRANSPORTING|NO|UP|ROWS|EQ|NE|LT|LE|GT|GE|AND|OR|NOT|BETWEEN|IN|IS|ASSIGNED|BOUND|DEFINITION|IMPLEMENTATION|PUBLIC|PROTECTED|PRIVATE|ABSTRACT|FINAL|FOR|TESTING|INHERITING|INTERFACES|EVENTS|ALIASES|CREATE|OBJECT|SET|GET|HANDLER|ACTIVATION|STATUS|TITLEBAR)\b/gi,
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
  return (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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

/**
 * 将高亮后的 HTML 代码按行包裹为支持独立重点高亮与对齐的 DOM 结构
 */
function wrapCodeInLines(highlightedHtml, highlightedLinesSet = new Set()) {
  const lines = highlightedHtml.split(/\r?\n/);
  return lines
    .map((lineContent, index) => {
      const lineNum = index + 1;
      const isHighlighted = highlightedLinesSet.has(lineNum);
      const content = lineContent || " ";
      return `<div class="edgeever-code-line${
        isHighlighted ? " is-highlighted" : ""
      }" data-line="${lineNum}">${content}</div>`;
    })
    .join("");
}

// ==================== 2. Pretty Printer 格式化引擎 ====================
function formatAbapCode(code) {
  const literals = [];
  let placeholderIndex = 0;

  // 1. 占位保护字符串与注释
  let masked = code.replace(
    /('(?:''|[^'\r\n])*'|`(?:``|[^`\r\n])*`|\|(?:\\\||[^|\r\n])*\||(?:^\*|\n\*)[^\r\n]*|"[^\r\n]*)/g,
    (match) => {
      const key = `___ABAP_LIT_${placeholderIndex++}___`;
      literals.push({ key, value: match });
      return key;
    }
  );

  // 2. 核心关键字全量大写化
  const keywords = [
    "REPORT", "PROGRAM", "DATA", "TYPES", "CONSTANTS", "STATICS", "PARAMETERS", "SELECT-OPTIONS",
    "FIELD-SYMBOLS", "CLASS", "ENDCLASS", "INTERFACE", "ENDINTERFACE", "METHOD", "ENDMETHOD",
    "MODULE", "ENDMODULE", "FORM", "ENDFORM", "FUNCTION", "ENDFUNCTION", "DO", "ENDDO",
    "WHILE", "ENDWHILE", "LOOP", "ENDLOOP", "AT", "ENDAT", "IF", "ELSEIF", "ELSE", "ENDIF",
    "CASE", "WHEN", "ENDCASE", "TRY", "CATCH", "CLEANUP", "ENDTRY", "CHECK", "EXIT", "CONTINUE",
    "RETURN", "REJECT", "STOP", "CALL", "METHOD", "RECEIVING", "IMPORTING", "EXPORTING", "CHANGING",
    "TABLES", "EXCEPTIONS", "PERFORM", "SUBMIT", "LEAVE", "RAISE", "MESSAGE", "SELECT", "SINGLE",
    "FROM", "INTO", "CORRESPONDING", "FIELDS", "WHERE", "GROUP", "BY", "HAVING", "ORDER",
    "APPENDING", "INSERT", "UPDATE", "MODIFY", "DELETE", "COMMIT", "WORK", "ROLLBACK", "OPEN",
    "FETCH", "CLOSE", "READ", "TABLE", "APPEND", "SORT", "ASSIGN", "UNASSIGN", "CLEAR", "FREE",
    "MOVE", "MOVE-CORRESPONDING", "CONCATENATE", "SPLIT", "CONDENSE", "TRANSLATE", "REPLACE",
    "SEARCH", "SHIFT", "DESCRIBE", "COMPUTE", "ADD", "SUBTRACT", "MULTIPLY", "DIVIDE", "TYPE",
    "LIKE", "REF", "TO", "VALUE", "INITIAL", "OPTIONAL", "DEFAULT", "STANDARD", "SORTED", "HASHED",
    "INDEX", "KEY", "WITH", "TRANSPORTING", "NO", "UP", "ROWS", "EQ", "NE", "LT", "LE", "GT", "GE",
    "AND", "OR", "NOT", "BETWEEN", "IN", "IS", "ASSIGNED", "BOUND", "DEFINITION", "IMPLEMENTATION",
    "PUBLIC", "PROTECTED", "PRIVATE", "ABSTRACT", "FINAL", "FOR", "TESTING", "INHERITING",
    "INTERFACES", "EVENTS", "ALIASES", "CREATE", "OBJECT", "SET", "GET", "HANDLER", "ACTIVATION",
    "STATUS", "TITLEBAR", "SY-SUBRC", "SY-TABIX", "SY-INDEX", "SY-UCOMM", "SY-DATUM", "SY-UZEIT",
    "SY-UNAME", "SY-MANDT", "SY-DYNNR", "SY-TCODE"
  ];
  const kwRegex = new RegExp(`\\b(?:${keywords.join("|")})\\b`, "gi");
  masked = masked.replace(kwRegex, (m) => m.toUpperCase());

  // 3. 冒号格式规范化 (如 DATA:a -> DATA: a)
  masked = masked.replace(/([A-Z0-9_]+):([^\s])/gi, "$1: $2");

  // 4. 恢复占位字面量
  for (const item of literals) {
    masked = masked.replace(item.key, item.value);
  }

  // 5. 逐行智能块级缩进对齐
  const lines = masked.split(/\r?\n/);
  let indentLevel = 0;
  const formattedLines = [];

  const increaseIndentBefore = /^\s*(?:IF|LOOP|DO|WHILE|CASE|TRY|FORM|METHOD|CLASS\s+[A-Z0-9_]+\s+(?:DEFINITION|IMPLEMENTATION))\b/i;
  const decreaseIndentSelf = /^\s*(?:ENDIF|ENDLOOP|ENDDO|ENDWHILE|ENDCASE|ENDTRY|ENDFORM|ENDMETHOD|ENDCLASS|ELSE|ELSEIF|CATCH|CLEANUP|WHEN)\b/i;
  const increaseIndentAfterSelf = /^\s*(?:ELSE|ELSEIF|CATCH|CLEANUP|WHEN)\b/i;

  for (let line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      formattedLines.push("");
      continue;
    }
    if (trimmed.startsWith("*")) {
      formattedLines.push(trimmed);
      continue;
    }
    if (decreaseIndentSelf.test(trimmed)) {
      indentLevel = Math.max(0, indentLevel - 1);
    }
    const currentIndent = "  ".repeat(indentLevel);
    formattedLines.push(currentIndent + trimmed);
    if (increaseIndentBefore.test(trimmed) || increaseIndentAfterSelf.test(trimmed)) {
      indentLevel++;
    }
  }
  return formattedLines.join("\n");
}

function formatJsonCode(code) {
  try {
    const obj = JSON.parse(code);
    return JSON.stringify(obj, null, 2);
  } catch (_) {
    return code;
  }
}

function formatSqlCode(code) {
  const literals = [];
  let placeholderIndex = 0;
  let masked = code.replace(/('(?:''|[^'\r\n])*'|--[^\r\n]*|\/\*[\s\S]*?\*\/)/g, (match) => {
    const key = `___SQL_LIT_${placeholderIndex++}___`;
    literals.push({ key, value: match });
    return key;
  });

  const keywords = [
    "SELECT", "FROM", "WHERE", "GROUP BY", "ORDER BY", "HAVING", "LIMIT", "OFFSET",
    "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE", "LEFT JOIN", "RIGHT JOIN",
    "INNER JOIN", "OUTER JOIN", "CROSS JOIN", "JOIN", "ON", "AND", "OR", "UNION ALL",
    "UNION", "AS", "DISTINCT", "CASE", "WHEN", "THEN", "ELSE", "END", "NOT", "IN",
    "IS NULL", "IS NOT NULL", "LIKE", "BETWEEN", "CREATE TABLE", "ALTER TABLE", "DROP TABLE"
  ];
  const kwRegex = new RegExp(`\\b(?:${keywords.join("|")})\\b`, "gi");
  masked = masked.replace(kwRegex, (m) => m.toUpperCase());

  for (const item of literals) {
    masked = masked.replace(item.key, item.value);
  }

  const lines = masked.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  return lines.join("\n");
}

function formatCode(code, lang) {
  const l = (lang || "").toLowerCase();
  if (l === "abap") {
    return formatAbapCode(code);
  } else if (l === "json") {
    return formatJsonCode(code);
  } else if (l === "sql") {
    return formatSqlCode(code);
  } else {
    return code
      .split(/\r?\n/)
      .map((line) => line.trimEnd())
      .join("\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }
}

// 跨平台健壮复制代码到剪贴板
async function copyCodeToClipboard(text, block) {
  if (typeof window !== "undefined" && window.edgeeverDesktop?.copyText) {
    try {
      const ok = await window.edgeeverDesktop.copyText(text);
      if (ok) return true;
    } catch (_) {}
  }

  const nativeBtn = block?.querySelector(".edgeever-code-copy-button");
  if (nativeBtn) {
    try {
      nativeBtn.click();
      return true;
    } catch (_) {}
  }

  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (_) {}
  }

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

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ==================== 3. Ray.so 风格代码卡片渲染与导出 ====================
async function renderCardToCanvas(cardEl) {
  const width = cardEl.offsetWidth || 680;
  const height = cardEl.offsetHeight || 380;
  const scale = 2; // 2x Retina 高清

  const clone = cardEl.cloneNode(true);

  // 内联导出核心样式确保跨上下文还原
  const cssStyles = `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    .edgeever-ray-card { padding: 36px 40px; border-radius: 16px; width: ${width}px; font-family: ui-monospace, "JetBrains Mono", Menlo, Consolas, monospace; font-size: 13.5px; line-height: 1.62; position: relative; }
    .edgeever-ray-card[data-gradient="aurora"] { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%); }
    .edgeever-ray-card[data-gradient="cyber"] { background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 50%, #6366f1 100%); }
    .edgeever-ray-card[data-gradient="sunset"] { background: linear-gradient(135deg, #f59e0b 0%, #ef4444 50%, #ec4899 100%); }
    .edgeever-ray-card[data-gradient="emerald"] { background: linear-gradient(135deg, #059669 0%, #10b981 50%, #06b6d4 100%); }
    .edgeever-ray-card[data-gradient="dark"] { background: linear-gradient(135deg, #18181b 0%, #27272a 50%, #3f3f46 100%); }
    .edgeever-ray-window { background: #21252b; border-radius: 10px; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45); border: 1px solid rgba(255, 255, 255, 0.1); overflow: hidden; }
    .edgeever-ray-header { height: 38px; display: flex; align-items: center; justify-content: space-between; padding: 0 14px; background: #1b1d23; border-bottom: 1px solid rgba(255, 255, 255, 0.06); }
    .edgeever-code-mac-dots { display: inline-flex; align-items: center; gap: 6px; }
    .edgeever-code-dot { width: 11px; height: 11px; border-radius: 50%; display: inline-block; }
    .edgeever-code-dot.red { background: #ff5f56; }
    .edgeever-code-dot.yellow { background: #ffbd2e; }
    .edgeever-code-dot.green { background: #27c93f; }
    .edgeever-ray-lang-badge { font-size: 11px; font-weight: 700; color: #94a3b8; background: rgba(255, 255, 255, 0.08); padding: 2px 7px; border-radius: 4px; text-transform: uppercase; }
    .edgeever-ray-body { display: flex; padding: 14px 16px; color: #abb2bf; position: relative; }
    .edgeever-ray-gutter { text-align: right; padding-right: 14px; color: #5c6370; user-select: none; border-right: 1px solid rgba(255, 255, 255, 0.08); margin-right: 14px; font-size: 13.5px; }
    .edgeever-ray-gutter-num { height: 1.62em; line-height: 1.62em; }
    .edgeever-ray-code { flex: 1; margin: 0; white-space: pre; font-size: 13.5px; font-family: inherit; }
    .edgeever-code-line { height: 1.62em; line-height: 1.62em; border-radius: 2px; }
    .edgeever-code-line.is-highlighted { background: rgba(97, 175, 239, 0.22); border-left: 3px solid #61afef; padding-left: 4px; }
    .has-line-focus .edgeever-code-line:not(.is-highlighted) { opacity: 0.38; }
    .edgeever-ray-watermark { text-align: right; font-size: 11px; font-weight: 600; color: rgba(255, 255, 255, 0.45); margin-top: 12px; letter-spacing: 0.5px; }
    .token.keyword, .hljs-keyword { color: #c678dd; font-weight: 600; }
    .token.function, .hljs-built_in { color: #61afef; }
    .token.string, .hljs-string { color: #98c379; }
    .token.comment, .hljs-comment { color: #5c6370; font-style: italic; }
    .token.number, .hljs-number { color: #d19a66; }
    .token.abap-system-var, .hljs-variable { color: #e06c75; font-weight: 600; }
    .token.operator, .hljs-operator { color: #56b6c2; }
  `;

  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml">
          <style>${cssStyles}</style>
          ${clone.outerHTML}
        </div>
      </foreignObject>
    </svg>
  `;

  const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext("2d");
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      resolve(canvas);
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };
    img.src = url;
  });
}

function openRayCodeCardModal(block, detectedLang, langLabel, context) {
  const existing = document.querySelector(".edgeever-code-card-modal-backdrop");
  if (existing) existing.remove();

  const sourceEl = block.querySelector(".edgeever-code-source") || block.querySelector("code") || block;
  const rawCode = block.dataset.originalRawCode || sourceEl.innerText || sourceEl.textContent || "";
  const lines = rawCode.split(/\r?\n/);
  const linesCount = lines.length;
  const highlightedSet = block._highlightedLines || new Set();

  // 高亮代码并按行构建
  const rawHighlighted = highlightCode(rawCode, detectedLang);
  const codeLinesHtml = wrapCodeInLines(rawHighlighted, highlightedSet);

  let gutterHtml = "";
  for (let i = 1; i <= linesCount; i++) {
    gutterHtml += `<div class="edgeever-ray-gutter-num">${i}</div>`;
  }

  const backdrop = document.createElement("div");
  backdrop.className = "edgeever-code-card-modal-backdrop";

  backdrop.innerHTML = `
    <div class="edgeever-code-card-modal">
      <div class="edgeever-code-card-modal-header">
        <div class="edgeever-code-card-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
          <span>代码卡片导出 (Ray.so 风格)</span>
        </div>
        <div class="edgeever-code-card-controls">
          <span class="edgeever-code-card-label">背景渐变：</span>
          <div class="edgeever-code-gradient-picker">
            <span class="gradient-dot active" data-gradient="aurora" title="极光紫" style="background: linear-gradient(135deg, #4f46e5, #7c3aed, #ec4899);"></span>
            <span class="gradient-dot" data-gradient="cyber" title="科技蓝" style="background: linear-gradient(135deg, #0ea5e9, #3b82f6, #6366f1);"></span>
            <span class="gradient-dot" data-gradient="sunset" title="落日暖橙" style="background: linear-gradient(135deg, #f59e0b, #ef4444, #ec4899);"></span>
            <span class="gradient-dot" data-gradient="emerald" title="翡翠绿" style="background: linear-gradient(135deg, #059669, #10b981, #06b6d4);"></span>
            <span class="gradient-dot" data-gradient="dark" title="黑曜石" style="background: linear-gradient(135deg, #18181b, #27272a, #3f3f46);"></span>
          </div>
          <label class="edgeever-code-card-checkbox">
            <input type="checkbox" id="rayCardShowLines" checked>
            <span>显示行号</span>
          </label>
        </div>
        <button type="button" class="edgeever-code-card-modal-close" title="关闭 (Esc)">✕</button>
      </div>

      <div class="edgeever-code-card-preview-viewport">
        <div class="edgeever-ray-card${highlightedSet.size > 0 ? " has-line-focus" : ""}" id="rayCardNode" data-gradient="aurora">
          <div class="edgeever-ray-window">
            <div class="edgeever-ray-header">
              <div class="edgeever-code-mac-dots">
                <span class="edgeever-code-dot red"></span>
                <span class="edgeever-code-dot yellow"></span>
                <span class="edgeever-code-dot green"></span>
              </div>
              <div class="edgeever-ray-lang-badge">${langLabel}</div>
            </div>
            <div class="edgeever-ray-body">
              <div class="edgeever-ray-gutter" id="rayCardGutter">${gutterHtml}</div>
              <div class="edgeever-ray-code">${codeLinesHtml}</div>
            </div>
          </div>
          <div class="edgeever-ray-watermark">EdgeEver Code Pro</div>
        </div>
      </div>

      <div class="edgeever-code-card-modal-footer">
        <span class="edgeever-code-card-tip">支持导出视网膜 2x 高清图，一键粘贴到微信、飞书或文档中</span>
        <div class="edgeever-code-card-footer-btns">
          <button type="button" class="edgeever-code-card-btn copy-card-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1"></path></svg>
            <span>复制图片到剪贴板</span>
          </button>
          <button type="button" class="edgeever-code-card-btn download-card-btn primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            <span>下载 PNG 图片</span>
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(backdrop);

  const cardNode = backdrop.querySelector("#rayCardNode");
  const gutterNode = backdrop.querySelector("#rayCardGutter");
  const showLinesCheck = backdrop.querySelector("#rayCardShowLines");
  const copyBtn = backdrop.querySelector(".copy-card-btn");
  const downloadBtn = backdrop.querySelector(".download-card-btn");
  const closeBtn = backdrop.querySelector(".edgeever-code-card-modal-close");

  // 渐变背景切换
  backdrop.querySelectorAll(".gradient-dot").forEach((dot) => {
    dot.onclick = () => {
      backdrop.querySelectorAll(".gradient-dot").forEach((d) => d.classList.remove("active"));
      dot.classList.add("active");
      cardNode.setAttribute("data-gradient", dot.dataset.gradient);
    };
  });

  // 行号显隐切换
  showLinesCheck.onchange = () => {
    gutterNode.style.display = showLinesCheck.checked ? "block" : "none";
  };

  // 关闭弹窗
  function closeModal() {
    backdrop.remove();
    document.removeEventListener("keydown", handleKeydown);
  }

  function handleKeydown(e) {
    if (e.key === "Escape") closeModal();
  }

  closeBtn.onclick = closeModal;
  backdrop.onclick = (e) => {
    if (e.target === backdrop) closeModal();
  };
  document.addEventListener("keydown", handleKeydown);

  // 复制图片到剪贴板
  copyBtn.onclick = async () => {
    try {
      copyBtn.querySelector("span").textContent = "正在生成...";
      const canvas = await renderCardToCanvas(cardNode);
      canvas.toBlob(async (blob) => {
        if (!blob) {
          context.ui?.showNotice?.("生成图片失败，请重试！");
          copyBtn.querySelector("span").textContent = "复制图片到剪贴板";
          return;
        }
        let copied = false;
        try {
          if (navigator.clipboard?.write) {
            const item = new ClipboardItem({ "image/png": blob });
            await navigator.clipboard.write([item]);
            copied = true;
          }
        } catch (_) {}

        if (copied) {
          copyBtn.classList.add("copied");
          copyBtn.querySelector("span").textContent = "已复制图片 ✓";
          context.ui?.showNotice?.("Ray.so 风格代码卡片已复制到剪贴板！");
          setTimeout(() => {
            copyBtn.classList.remove("copied");
            copyBtn.querySelector("span").textContent = "复制图片到剪贴板";
          }, 2000);
        } else {
          // 兜底直接触发下载
          downloadBlob(blob, `code-card-${Date.now()}.png`);
          context.ui?.showNotice?.("已为您生成并自动下载卡片图片！");
          copyBtn.querySelector("span").textContent = "复制图片到剪贴板";
        }
      }, "image/png");
    } catch (err) {
      console.error("Card render error:", err);
      context.ui?.showNotice?.("生成图片失败，请重试！");
      copyBtn.querySelector("span").textContent = "复制图片到剪贴板";
    }
  };

  // 下载 PNG 图片
  downloadBtn.onclick = async () => {
    try {
      downloadBtn.querySelector("span").textContent = "正在生成...";
      const canvas = await renderCardToCanvas(cardNode);
      canvas.toBlob((blob) => {
        if (blob) {
          downloadBlob(blob, `code-card-${Date.now()}.png`);
          context.ui?.showNotice?.("代码卡片下载成功！");
        }
        downloadBtn.querySelector("span").textContent = "下载 PNG 图片";
      }, "image/png");
    } catch (err) {
      console.error("Card render error:", err);
      context.ui?.showNotice?.("生成图片失败，请重试！");
      downloadBtn.querySelector("span").textContent = "下载 PNG 图片";
    }
  };
}

// ==================== 4. 插件主生命周期定义 ====================
export default {
  async activate(context) {
    const settings = {
      showMacDots: true,
      showLanguageBadge: true,
      showCardButton: true,
      enableLineHighlight: true,
      showFormatButton: true,
      showSearchButton: true,
      showCollapseButton: true,
      autoFoldTallCode: true,
      maxCodeHeight: 340,
      showCopyButton: true,
      showLineNumbers: true,
      autoDetectAbap: true,
      codeTheme: "one-dark",
    };

    const loadSettings = async () => {
      try {
        const dots = await context.settings.get("show_mac_dots");
        const lang = await context.settings.get("show_language_badge");
        const card = await context.settings.get("show_card_button");
        const lineHl = await context.settings.get("enable_line_highlight");
        const format = await context.settings.get("show_format_button");
        const search = await context.settings.get("show_search_button");
        const collapse = await context.settings.get("show_collapse_button");
        const autoFold = await context.settings.get("auto_fold_tall_code");
        const maxHeight = await context.settings.get("max_code_height");
        const copy = await context.settings.get("show_copy_button");
        const lines = await context.settings.get("show_line_numbers");
        const abap = await context.settings.get("auto_detect_abap");
        const theme = await context.settings.get("code_theme");

        if (dots !== null) settings.showMacDots = dots;
        if (lang !== null) settings.showLanguageBadge = lang;
        if (card !== null) settings.showCardButton = card;
        if (lineHl !== null) settings.enableLineHighlight = lineHl;
        if (format !== null) settings.showFormatButton = format;
        if (search !== null) settings.showSearchButton = search;
        if (collapse !== null) settings.showCollapseButton = collapse;
        if (autoFold !== null) settings.autoFoldTallCode = autoFold;
        if (maxHeight !== null && Number(maxHeight) > 100) settings.maxCodeHeight = Number(maxHeight);
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

      delete block.dataset.codeProProcessed;
      beautifyCodeBlock(block, true);
    }

    /**
     * 更新代码块源码内容（优雅分发 TipTap 事务或 DOM 兜底）
     */
    function updateCodeBlockText(block, sourceEl, newText) {
      let updatedViaEditor = false;
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
        if (editor && editor.view) {
          const pos = editor.view.posAtDOM(sourceEl, 0);
          if (typeof pos === "number" && pos >= 0) {
            const resolved = editor.view.state.doc.resolve(pos);
            let depth = resolved.depth;
            while (depth > 0 && resolved.node(depth).type.name !== "codeBlock") {
              depth--;
            }
            if (depth > 0) {
              const from = resolved.start(depth);
              const to = resolved.end(depth);
              const tr = editor.view.state.tr.replaceWith(
                from,
                to,
                editor.view.state.schema.text(newText)
              );
              editor.view.dispatch(tr);
              updatedViaEditor = true;
            }
          }
        }
      } catch (_) {}

      if (!updatedViaEditor) {
        sourceEl.textContent = newText;
        sourceEl.dispatchEvent(new Event("input", { bubbles: true }));
      }

      delete block.dataset.codeProProcessed;
      delete block.dataset.originalRawCode;
      beautifyCodeBlock(block, true);
    }

    /**
     * 切换某一行的高亮与暗淡聚焦模式
     */
    function toggleLineHighlight(block, lineNum) {
      if (!block._highlightedLines) {
        block._highlightedLines = new Set();
      }
      const set = block._highlightedLines;
      if (set.has(lineNum)) {
        set.delete(lineNum);
      } else {
        set.add(lineNum);
      }

      const hasFocus = set.size > 0;
      block.classList.toggle("has-line-focus", hasFocus);

      block.querySelectorAll(".edgeever-code-line").forEach((el) => {
        const n = Number(el.dataset.line);
        el.classList.toggle("is-highlighted", set.has(n));
      });

      block.querySelectorAll(".edgeever-code-line-number").forEach((el) => {
        const n = Number(el.dataset.line);
        el.classList.toggle("is-active-line-num", set.has(n));
      });
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

      block.dataset.originalRawCode = rawText;

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
      block.style.setProperty("--code-max-height", `${settings.maxCodeHeight}px`);

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

      // 1) Ray.so 风格代码卡片导出按钮
      if (settings.showCardButton) {
        const cardBtn = document.createElement("button");
        cardBtn.className = "edgeever-code-tool-btn edgeever-code-snap-btn";
        cardBtn.type = "button";
        cardBtn.setAttribute("contenteditable", "false");
        cardBtn.title = "生成 Ray.so 风格代码分享卡片";
        cardBtn.innerHTML = `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
            <circle cx="12" cy="13" r="4"></circle>
          </svg>
          <span>卡片</span>
        `;
        cardBtn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          openRayCodeCardModal(block, detectedLang, matchedLang.label, context);
        };
        right.appendChild(cardBtn);
      }

      // 2) 一键格式化 Pretty Printer 按钮
      if (settings.showFormatButton) {
        const formatBtn = document.createElement("button");
        formatBtn.className = "edgeever-code-tool-btn edgeever-code-format-btn";
        formatBtn.type = "button";
        formatBtn.setAttribute("contenteditable", "false");
        formatBtn.title = "一键格式化 (Pretty Printer)";
        formatBtn.innerHTML = `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"></path>
          </svg>
          <span>排版</span>
        `;
        formatBtn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          const currentCode = sourceEl.innerText || sourceEl.textContent || "";
          const formatted = formatCode(currentCode, detectedLang);
          if (formatted.trim() === currentCode.trim()) {
            context.ui?.showNotice?.("代码排版已是最优格式，无需调整！");
            return;
          }
          updateCodeBlockText(block, sourceEl, formatted);
          const span = formatBtn.querySelector("span");
          if (span) span.textContent = "已排版 ✓";
          setTimeout(() => {
            if (span) span.textContent = "排版";
          }, 2000);
          context.ui?.showNotice?.("代码排版美化完成！");
        };
        right.appendChild(formatBtn);
      }

      // 3) 代码块内独立搜索按钮与搜索面板
      let searchBar = block.querySelector(".edgeever-code-search-bar");
      if (!searchBar) {
        searchBar = document.createElement("div");
        searchBar.className = "edgeever-code-search-bar";
        searchBar.setAttribute("contenteditable", "false");
        searchBar.innerHTML = `
          <div class="edgeever-code-search-input-wrap">
            <svg class="edgeever-code-search-icon-inside" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" class="edgeever-code-search-input" placeholder="在代码块中查找...">
          </div>
          <span class="edgeever-code-search-count">0/0</span>
          <button type="button" class="edgeever-code-search-nav-btn edgeever-code-search-prev" title="上一个 (Shift+Enter)">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"></polyline></svg>
          </button>
          <button type="button" class="edgeever-code-search-nav-btn edgeever-code-search-next" title="下一个 (Enter)">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
          <button type="button" class="edgeever-code-search-close-btn" title="关闭 (Esc)">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        `;
        block.insertBefore(searchBar, toolbar.nextSibling);
      }

      // 绑定搜索逻辑
      let searchCurrentIdx = 0;
      let searchMatchesCount = 0;
      const searchInput = searchBar.querySelector(".edgeever-code-search-input");
      const searchCount = searchBar.querySelector(".edgeever-code-search-count");
      const prevBtn = searchBar.querySelector(".edgeever-code-search-prev");
      const nextBtn = searchBar.querySelector(".edgeever-code-search-next");
      const closeBtn = searchBar.querySelector(".edgeever-code-search-close-btn");

      function updateSearchHighlights() {
        const query = searchInput.value;
        const text = block.dataset.originalRawCode || sourceEl.innerText || sourceEl.textContent || "";
        if (!query) {
          searchMatchesCount = 0;
          searchCurrentIdx = 0;
          searchCount.textContent = "0/0";
          const hl = highlightCode(text, detectedLang);
          sourceEl.innerHTML = wrapCodeInLines(hl, block._highlightedLines || new Set());
          return;
        }

        const safeQuery = escapeRegex(query);
        const re = new RegExp(safeQuery, "gi");
        let cursor = 0;
        let match;
        const hitIndexes = [];

        while ((match = re.exec(text)) !== null) {
          hitIndexes.push({ start: match.index, end: match.index + match[0].length, text: match[0] });
        }

        searchMatchesCount = hitIndexes.length;
        if (searchMatchesCount === 0) {
          searchCurrentIdx = 0;
          searchCount.textContent = "0/0";
          const hl = highlightCode(text, detectedLang);
          sourceEl.innerHTML = wrapCodeInLines(hl, block._highlightedLines || new Set());
          return;
        }

        if (searchCurrentIdx >= searchMatchesCount) searchCurrentIdx = 0;
        if (searchCurrentIdx < 0) searchCurrentIdx = searchMatchesCount - 1;

        searchCount.textContent = `${searchCurrentIdx + 1}/${searchMatchesCount}`;

        let highlightedHtml = "";
        cursor = 0;
        hitIndexes.forEach((hit, idx) => {
          if (hit.start > cursor) {
            highlightedHtml += escapeHtml(text.slice(cursor, hit.start));
          }
          const isCurrent = idx === searchCurrentIdx;
          highlightedHtml += `<mark class="edgeever-code-search-hit${
            isCurrent ? " edgeever-code-search-current" : ""
          }" data-search-idx="${idx}">${escapeHtml(hit.text)}</mark>`;
          cursor = hit.end;
        });
        if (cursor < text.length) {
          highlightedHtml += escapeHtml(text.slice(cursor));
        }
        sourceEl.innerHTML = wrapCodeInLines(highlightedHtml, block._highlightedLines || new Set());

        const currentMark = sourceEl.querySelector(".edgeever-code-search-current");
        if (currentMark) {
          currentMark.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
        }
      }

      function stepSearch(delta) {
        if (searchMatchesCount <= 0) return;
        searchCurrentIdx = (searchCurrentIdx + delta + searchMatchesCount) % searchMatchesCount;
        updateSearchHighlights();
      }

      function closeSearch() {
        block.classList.remove("has-search-open");
        searchInput.value = "";
        const text = block.dataset.originalRawCode || sourceEl.innerText || sourceEl.textContent || "";
        const hl = highlightCode(text, detectedLang);
        sourceEl.innerHTML = wrapCodeInLines(hl, block._highlightedLines || new Set());
      }

      searchInput.oninput = () => {
        searchCurrentIdx = 0;
        updateSearchHighlights();
      };

      searchInput.onkeydown = (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          stepSearch(e.shiftKey ? -1 : 1);
        } else if (e.key === "Escape") {
          e.preventDefault();
          closeSearch();
        }
      };

      prevBtn.onclick = (e) => {
        e.stopPropagation();
        stepSearch(-1);
      };

      nextBtn.onclick = (e) => {
        e.stopPropagation();
        stepSearch(1);
      };

      closeBtn.onclick = (e) => {
        e.stopPropagation();
        closeSearch();
      };

      if (settings.showSearchButton) {
        const searchBtn = document.createElement("button");
        searchBtn.className = "edgeever-code-tool-btn edgeever-code-search-btn";
        searchBtn.type = "button";
        searchBtn.setAttribute("contenteditable", "false");
        searchBtn.title = "在代码块中搜索";
        searchBtn.innerHTML = `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <span>搜索</span>
        `;
        searchBtn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          const isOpen = block.classList.toggle("has-search-open");
          if (isOpen) {
            if (block.classList.contains("is-collapsed")) {
              toggleCollapse();
            }
            if (block.classList.contains("is-overflow-collapsed")) {
              block.classList.remove("is-overflow-collapsed");
              block.dataset.userExpanded = "true";
              const mask = block.querySelector(".edgeever-code-fold-mask");
              if (mask) mask.style.display = "none";
            }
            setTimeout(() => {
              searchInput.focus();
              searchInput.select();
            }, 60);
          } else {
            closeSearch();
          }
        };
        right.appendChild(searchBtn);
      }

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
        if (isCollapsed) {
          block.classList.remove("is-overflow-collapsed");
          const mask = block.querySelector(".edgeever-code-fold-mask");
          if (mask) mask.style.display = "none";
        }
      }

      // 4) 折叠/展开按钮
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

      // 5) 复制按钮（全面对接桌面端与网页端剪贴板）
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
          const textToCopy = block.dataset.originalRawCode || sourceEl.innerText || sourceEl.textContent || "";
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

      // 4. 行号槽管理与重点行高亮点击
      let existingGutter = block.querySelector(".edgeever-code-line-numbers");
      if (existingGutter) existingGutter.remove();

      const highlightedSet = block._highlightedLines || new Set();

      if (settings.showLineNumbers && linesCount > 1) {
        block.classList.add("has-line-numbers");
        const lineNumbers = document.createElement("div");
        lineNumbers.className = "edgeever-code-line-numbers";
        lineNumbers.setAttribute("contenteditable", "false");
        lineNumbers.setAttribute("aria-hidden", "true");

        for (let num = 1; num <= linesCount; num++) {
          const numSpan = document.createElement("span");
          numSpan.className = `edgeever-code-line-number${highlightedSet.has(num) ? " is-active-line-num" : ""}`;
          numSpan.textContent = num;
          numSpan.dataset.line = String(num);
          if (settings.enableLineHighlight) {
            numSpan.title = "点击切换此行高亮聚焦";
            numSpan.onclick = (e) => {
              e.stopPropagation();
              toggleLineHighlight(block, num);
            };
          }
          lineNumbers.appendChild(numSpan);
        }
        block.insertBefore(lineNumbers, sourceEl);
      } else {
        block.classList.remove("has-line-numbers");
      }

      // 5. 语法着色（核心逻辑）：
      const isEditing = document.activeElement === sourceEl || sourceEl.contains(document.activeElement);
      if (!isEditing && !block.classList.contains("has-search-open")) {
        const langKey = GRAMMARS[detectedLang] ? detectedLang : detectedLang === "abap" ? "abap" : null;
        if (langKey) {
          const rawHl = highlightCode(rawText, langKey);
          sourceEl.innerHTML = wrapCodeInLines(rawHl, highlightedSet);
        } else {
          sourceEl.innerHTML = wrapCodeInLines(escapeHtml(rawText), highlightedSet);
        }
      }

      // 6. 超长代码块平滑渐变遮罩与自动折叠
      let foldMask = block.querySelector(".edgeever-code-fold-mask");
      if (!foldMask) {
        foldMask = document.createElement("div");
        foldMask.className = "edgeever-code-fold-mask";
        foldMask.setAttribute("contenteditable", "false");
        foldMask.innerHTML = `
          <button type="button" class="edgeever-code-fold-expand-btn">
            展开余下代码 (共 ${linesCount} 行) ▼
          </button>
        `;
        block.appendChild(foldMask);

        foldMask.querySelector(".edgeever-code-fold-expand-btn").onclick = (e) => {
          e.stopPropagation();
          block.classList.remove("is-overflow-collapsed");
          block.dataset.userExpanded = "true";
          foldMask.style.display = "none";
        };
      }

      if (
        settings.autoFoldTallCode &&
        !block.classList.contains("is-collapsed") &&
        block.dataset.userExpanded !== "true"
      ) {
        const isTall = linesCount >= 22 || sourceEl.scrollHeight > settings.maxCodeHeight + 30;
        if (isTall) {
          block.classList.add("is-overflow-collapsed");
          foldMask.style.display = "flex";
          const expandBtn = foldMask.querySelector(".edgeever-code-fold-expand-btn");
          if (expandBtn) expandBtn.textContent = `展开余下代码 (共 ${linesCount} 行) ▼`;
        } else {
          block.classList.remove("is-overflow-collapsed");
          foldMask.style.display = "none";
        }
      } else {
        block.classList.remove("is-overflow-collapsed");
        foldMask.style.display = "none";
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
        el.querySelector(".edgeever-code-search-bar")?.remove();
        el.querySelector(".edgeever-code-line-numbers")?.remove();
        el.querySelector(".edgeever-code-fold-mask")?.remove();
        el.classList.remove("has-line-numbers", "is-overflow-collapsed", "has-search-open", "has-line-focus");
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
      document.querySelectorAll(".edgeever-code-card-modal-backdrop").forEach((m) => m.remove());
      document.querySelectorAll(".edgeever-code-pro-toolbar").forEach((b) => b.remove());
      document.querySelectorAll(".edgeever-code-search-bar").forEach((b) => b.remove());
      document.querySelectorAll(".edgeever-code-line-numbers").forEach((g) => g.remove());
      document.querySelectorAll(".edgeever-code-fold-mask").forEach((m) => m.remove());
      document.querySelectorAll(".edgeever-code-pro-block").forEach((p) => {
        delete p.dataset.codeProProcessed;
        delete p.dataset.userExpanded;
        delete p.dataset.originalRawCode;
        delete p._highlightedLines;
        p.classList.remove(
          "edgeever-code-pro-block",
          "has-line-numbers",
          "is-collapsed",
          "is-overflow-collapsed",
          "has-search-open",
          "has-line-focus",
          "edgeever-theme-one-dark",
          "edgeever-theme-github-dark",
          "edgeever-theme-tokyo-night",
          "edgeever-theme-github-light"
        );
      });
    };
  },
};
