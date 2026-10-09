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

  java: [
    { type: "comment", pattern: /\/\*[\s\S]*?\*\/|\/\/[^\r\n]*/g },
    { type: "string", pattern: /(["'])(?:\\[\s\S]|(?!\1)[^\\])*\1/g },
    { type: "function", pattern: /@[a-zA-Z_]\w*/g },
    {
      type: "keyword",
      pattern:
        /\b(?:abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|native|new|package|private|protected|public|return|short|static|strictfp|super|switch|synchronized|this|throw|throws|transient|try|void|volatile|while|true|false|null|var|record|yield|sealed|permits)\b/g,
    },
    { type: "number", pattern: /\b(?:0[xX][0-9a-fA-F_]+|\d+(?:\.\d+)?(?:[eE][+-]?\d+)?[fFdDlL]?)\b/g },
    { type: "function", pattern: /\b[a-zA-Z_$][a-zA-Z0-9_$]*(?=\s*\()/g },
    { type: "operator", pattern: /[-+*\/%=!&|<>^?~:]+/g },
  ],

  c: [
    { type: "comment", pattern: /\/\*[\s\S]*?\*\/|\/\/[^\r\n]*/g },
    { type: "keyword", pattern: /^\s*#[a-zA-Z_]\w*/gm },
    { type: "string", pattern: /(["'])(?:\\[\s\S]|(?!\1)[^\\])*\1/g },
    {
      type: "keyword",
      pattern:
        /\b(?:auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|inline|int|long|register|restrict|return|short|signed|sizeof|static|struct|switch|typedef|union|unsigned|void|volatile|while|_Bool|_Complex|_Imaginary)\b/g,
    },
    { type: "number", pattern: /\b(?:0[xX][0-9a-fA-F]+|\d+(?:\.\d+)?(?:[eE][+-]?\d+)?[fFlLuU]*)\b/g },
    { type: "function", pattern: /\b[a-zA-Z_]\w*(?=\s*\()/g },
    { type: "operator", pattern: /[-+*\/%=!&|<>^?~:]+/g },
  ],

  cpp: [
    { type: "comment", pattern: /\/\*[\s\S]*?\*\/|\/\/[^\r\n]*/g },
    { type: "keyword", pattern: /^\s*#[a-zA-Z_]\w*/gm },
    { type: "string", pattern: /(["'])(?:\\[\s\S]|(?!\1)[^\\])*\1/g },
    {
      type: "keyword",
      pattern:
        /\b(?:alignas|alignof|and|and_eq|asm|atomic_cancel|atomic_commit|atomic_noexcept|auto|bitand|bitor|bool|break|case|catch|char|char8_t|char16_t|char32_t|class|compl|concept|const|consteval|constexpr|constinit|const_cast|continue|co_await|co_return|co_yield|decltype|default|delete|do|double|dynamic_cast|else|enum|explicit|export|extern|false|float|for|friend|goto|if|inline|int|long|mutable|namespace|new|noexcept|not|not_eq|nullptr|operator|or|or_eq|private|protected|public|reflexpr|register|reinterpret_cast|requires|return|short|signed|sizeof|static|static_assert|static_cast|struct|switch|template|this|thread_local|throw|true|try|typedef|typeid|typename|union|unsigned|using|virtual|void|volatile|wchar_t|while|xor|xor_eq)\b/g,
    },
    { type: "number", pattern: /\b(?:0[xX][0-9a-fA-F]+|\d+(?:\.\d+)?(?:[eE][+-]?\d+)?[fFlLuU]*)\b/g },
    { type: "function", pattern: /\b[a-zA-Z_]\w*(?=\s*\()/g },
    { type: "operator", pattern: /[-+*\/%=!&|<>^?~:]+/g },
  ],

  csharp: [
    { type: "comment", pattern: /\/\*[\s\S]*?\*\/|\/\/[^\r\n]*/g },
    { type: "string", pattern: /(?:@"(?:""|[^"])*"|\$?"(?:\\.|[^\\"\r\n])*")/g },
    {
      type: "keyword",
      pattern:
        /\b(?:abstract|as|base|bool|break|byte|case|catch|char|checked|class|const|continue|decimal|default|delegate|do|double|else|enum|event|explicit|extern|false|finally|fixed|float|for|foreach|goto|if|implicit|in|int|interface|internal|is|lock|long|namespace|new|null|object|operator|out|override|params|private|protected|public|readonly|ref|return|sbyte|sealed|short|sizeof|stackalloc|static|string|struct|switch|this|throw|true|try|typeof|uint|ulong|unchecked|unsafe|ushort|using|virtual|void|volatile|while|add|alias|ascending|async|await|by|descending|dynamic|equals|from|get|global|group|into|join|let|nameof|not|on|or|orderby|partial|record|remove|select|set|value|var|when|where|yield)\b/g,
    },
    { type: "number", pattern: /\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?[fFdDmMlL]?\b/g },
    { type: "function", pattern: /\b[a-zA-Z_]\w*(?=\s*\()/g },
    { type: "operator", pattern: /[-+*\/%=!&|<>^?~:]+/g },
  ],

  go: [
    { type: "comment", pattern: /\/\*[\s\S]*?\*\/|\/\/[^\r\n]*/g },
    { type: "string", pattern: /(?:`[^`]*`|"(?:\\.|[^\\"\r\n])*")/g },
    {
      type: "keyword",
      pattern:
        /\b(?:break|case|chan|const|continue|default|defer|else|fallthrough|for|func|go|goto|if|import|interface|map|package|range|return|select|struct|switch|type|var|true|false|iota|nil)\b/g,
    },
    {
      type: "type",
      pattern:
        /\b(?:bool|string|int|int8|int16|int32|int64|uint|uint8|uint16|uint32|uint64|uintptr|byte|rune|float32|float64|complex64|complex128|error)\b/g,
    },
    { type: "number", pattern: /\b(?:0[xX][0-9a-fA-F]+|\d+(?:\.\d+)?)\b/g },
    { type: "function", pattern: /\b[a-zA-Z_]\w*(?=\s*\()/g },
    { type: "operator", pattern: /[-+*\/%=!&|<>^~:]+|:=/g },
  ],

  rust: [
    { type: "comment", pattern: /\/\*[\s\S]*?\*\/|\/\/[^\r\n]*/g },
    { type: "string", pattern: /(?:r#*".*?"#*|"(?:\\.|[^\\"\r\n])*")/g },
    { type: "function", pattern: /\b[a-zA-Z_]\w*!/g },
    {
      type: "keyword",
      pattern:
        /\b(?:as|async|await|break|const|continue|crate|dyn|else|enum|extern|false|fn|for|if|impl|in|let|loop|match|mod|move|mut|pub|ref|return|self|Self|static|struct|super|trait|true|type|union|unsafe|use|where|while)\b/g,
    },
    {
      type: "type",
      pattern:
        /\b(?:i8|i16|i32|i64|i128|isize|u8|u16|u32|u64|u128|usize|f32|f64|bool|char|str|String|Option|Result|Vec|Box)\b/g,
    },
    { type: "number", pattern: /\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?[a-zA-Z0-9_]*\b/g },
    { type: "function", pattern: /\b[a-zA-Z_]\w*(?=\s*\()/g },
    { type: "operator", pattern: /[-+*\/%=!&|<>^~:]+|->|=>/g },
  ],

  php: [
    { type: "comment", pattern: /\/\*[\s\S]*?\*\/|\/\/[^\r\n]*|#[^\r\n]*/g },
    { type: "string", pattern: /(["'])(?:\\[\s\S]|(?!\1)[^\\])*\1/g },
    { type: "abap-system-var", pattern: /\$[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/g },
    {
      type: "keyword",
      pattern:
        /\b(?:__halt_compiler|abstract|and|array|as|break|callable|case|catch|class|clone|const|continue|declare|default|die|do|echo|else|elseif|empty|enddeclare|endfor|endforeach|endif|endswitch|endwhile|eval|exit|extends|final|finally|fn|for|foreach|function|global|goto|if|implements|include|include_once|instanceof|insteadof|interface|isset|list|match|namespace|new|or|print|private|protected|public|readonly|require|require_once|return|static|switch|throw|trait|try|unset|use|var|while|xor|yield|true|false|null)\b/gi,
    },
    { type: "number", pattern: /\b\d+(?:\.\d+)?\b/g },
    { type: "function", pattern: /\b[a-zA-Z_]\w*(?=\s*\()/g },
    { type: "operator", pattern: /[-+*\/%=!&|<>^~:]+|=>|->/g },
  ],

  ruby: [
    { type: "comment", pattern: /#[^\r\n]*/g },
    { type: "string", pattern: /(?:%[qQ]?\{[^}]*\}|(["'])(?:\\[\s\S]|(?!\1)[^\\])*\1)/g },
    { type: "type", pattern: /:[a-zA-Z_]\w*/g },
    { type: "abap-system-var", pattern: /(?:@@?|\$)[a-zA-Z_]\w*/g },
    {
      type: "keyword",
      pattern:
        /\b(?:alias|and|BEGIN|begin|break|case|class|def|defined\?|do|else|elsif|END|end|ensure|false|for|if|in|module|next|nil|not|or|redo|rescue|retry|return|self|super|then|true|undef|unless|until|when|while|yield)\b/g,
    },
    { type: "number", pattern: /\b\d+(?:\.\d+)?\b/g },
    { type: "function", pattern: /\b[a-zA-Z_]\w*(?=\s*\()/g },
  ],

  swift: [
    { type: "comment", pattern: /\/\*[\s\S]*?\*\/|\/\/[^\r\n]*/g },
    { type: "string", pattern: /(?:"""[\s\S]*?"""|(["'])(?:\\[\s\S]|(?!\1)[^\\])*\1)/g },
    {
      type: "keyword",
      pattern:
        /\b(?:associatedtype|class|deinit|enum|extension|fileprivate|func|import|init|inout|internal|let|open|operator|private|precedencegroup|protocol|public|rethrows|static|struct|subscript|typealias|var|break|case|catch|continue|default|defer|do|else|fallthrough|for|guard|if|in|repeat|return|throw|switch|where|while|as|Any|false|is|nil|super|self|Self|throws|true|try|async|await)\b/g,
    },
    { type: "number", pattern: /\b\d+(?:\.\d+)?\b/g },
    { type: "function", pattern: /\b[a-zA-Z_]\w*(?=\s*\()/g },
  ],

  kotlin: [
    { type: "comment", pattern: /\/\*[\s\S]*?\*\/|\/\/[^\r\n]*/g },
    { type: "string", pattern: /(?:"""[\s\S]*?"""|(["'])(?:\\[\s\S]|(?!\1)[^\\])*\1)/g },
    { type: "function", pattern: /@[a-zA-Z_]\w*/g },
    {
      type: "keyword",
      pattern:
        /\b(?:as|break|class|continue|do|else|false|for|fun|if|in|interface|is|null|object|package|return|super|this|throw|true|try|typealias|val|var|when|while|by|catch|constructor|delegate|dynamic|field|file|finally|get|import|init|param|property|receiver|set|setparam|where|actual|abstract|annotation|companion|const|crossinline|data|enum|expect|external|final|infix|inline|inner|internal|lateinit|noinline|open|operator|out|override|private|protected|public|reified|sealed|suspend|tailrec|vararg)\b/g,
    },
    { type: "number", pattern: /\b\d+(?:\.\d+)?\b/g },
    { type: "function", pattern: /\b[a-zA-Z_]\w*(?=\s*\()/g },
  ],

  dart: [
    { type: "comment", pattern: /\/\*[\s\S]*?\*\/|\/\/[^\r\n]*/g },
    { type: "string", pattern: /(?:r?'''[\s\S]*?'''|r?"""[\s\S]*?"""|r?(["'])(?:\\[\s\S]|(?!\1)[^\\])*\1)/g },
    {
      type: "keyword",
      pattern:
        /\b(?:abstract|as|assert|async|await|base|break|case|catch|class|const|continue|covariant|default|deferred|do|dynamic|else|enum|export|extends|extension|external|factory|false|final|finally|for|Function|get|hide|if|implements|import|in|interface|is|late|library|mixin|new|null|of|on|operator|part|required|rethrow|return|sealed|set|show|static|super|switch|sync|this|throw|true|try|typedef|var|void|when|while|with|yield)\b/g,
    },
    { type: "number", pattern: /\b\d+(?:\.\d+)?\b/g },
    { type: "function", pattern: /\b[a-zA-Z_]\w*(?=\s*\()/g },
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

  html: [
    { type: "comment", pattern: /<!--[\s\S]*?-->/g },
    { type: "comment", pattern: /<!(?:DOCTYPE|\[CDATA\[)[\s\S]*?>/gi },
    { type: "keyword", pattern: /<\/?\s*[a-zA-Z0-9_\-:]+/g },
    { type: "keyword", pattern: /\/?>/g },
    { type: "type", pattern: /\b[a-zA-Z0-9_-]+(?=\s*=)/g },
    { type: "string", pattern: /(["'])(?:\\[\s\S]|(?!\1)[^\\])*\1/g },
    { type: "abap-system-var", pattern: /&[a-zA-Z0-9#]+;/g },
  ],

  css: [
    { type: "comment", pattern: /\/\*[\s\S]*?\*\/|\/\/[^\r\n]*/g },
    { type: "string", pattern: /(["'])(?:\\[\s\S]|(?!\1)[^\\])*\1/g },
    { type: "keyword", pattern: /@[a-zA-Z-]+/g },
    { type: "type", pattern: /(?:[.#][a-zA-Z0-9_-]+|:[a-zA-Z-]+)/g },
    { type: "keyword", pattern: /\b[a-zA-Z-]+(?=\s*:)/g },
    { type: "number", pattern: /\b\d+(?:\.\d+)?(?:px|em|rem|%|vh|vw|s|ms|deg)?\b/gi },
    { type: "abap-system-var", pattern: /!important|var\(--[a-zA-Z0-9_-]+\)/g },
  ],

  json: [
    { type: "keyword", pattern: /"(?:\\.|[^\\"\r\n])*"(?=\s*:)/g },
    { type: "string", pattern: /"(?:\\.|[^\\"\r\n])*"/g },
    { type: "number", pattern: /-?\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/g },
    { type: "keyword", pattern: /\b(?:true|false|null)\b/g },
    { type: "operator", pattern: /[{}[\]:,]/g },
  ],

  yaml: [
    { type: "comment", pattern: /#[^\r\n]*/g },
    { type: "keyword", pattern: /^[\s-]*[a-zA-Z0-9_-]+(?=\s*:)/gm },
    { type: "string", pattern: /(["'])(?:\\[\s\S]|(?!\1)[^\\])*\1/g },
    { type: "keyword", pattern: /\b(?:true|false|yes|no|null|~)\b/gi },
    { type: "number", pattern: /\b\d+(?:\.\d+)?\b/g },
  ],

  toml: [
    { type: "comment", pattern: /#[^\r\n]*|;[^\r\n]*/g },
    { type: "type", pattern: /^\s*\[[^\]]+\]/gm },
    { type: "keyword", pattern: /^\s*[a-zA-Z0-9_.-]+(?=\s*=)/gm },
    { type: "string", pattern: /(["'])(?:\\[\s\S]|(?!\1)[^\\])*\1/g },
    { type: "keyword", pattern: /\b(?:true|false)\b/gi },
    { type: "number", pattern: /\b\d+(?:\.\d+)?\b/g },
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

  dockerfile: [
    { type: "comment", pattern: /#[^\r\n]*/g },
    {
      type: "keyword",
      pattern: /^\s*(?:FROM|MAINTAINER|RUN|CMD|LABEL|EXPOSE|ENV|ADD|COPY|ENTRYPOINT|VOLUME|USER|WORKDIR|ARG|ONBUILD|STOPSIGNAL|HEALTHCHECK|SHELL)\b/gmi,
    },
    { type: "string", pattern: /(["'])(?:\\[\s\S]|(?!\1)[^\\])*\1/g },
    { type: "abap-system-var", pattern: /\$[a-zA-Z0-9_]+|\$\{[^}]+\}/g },
  ],

  nginx: [
    { type: "comment", pattern: /#[^\r\n]*/g },
    {
      type: "keyword",
      pattern: /\b(?:server|location|listen|server_name|root|index|proxy_pass|proxy_set_header|try_files|rewrite|return|alias|access_log|error_log|include|upstream|events|http)\b/g,
    },
    { type: "abap-system-var", pattern: /\$[a-zA-Z0-9_]+/g },
    { type: "string", pattern: /(["'])(?:\\[\s\S]|(?!\1)[^\\])*\1/g },
    { type: "number", pattern: /\b\d+(?:\.\d+)?\b/g },
  ],

  graphql: [
    { type: "comment", pattern: /#[^\r\n]*/g },
    {
      type: "keyword",
      pattern: /\b(?:query|mutation|subscription|fragment|schema|type|interface|union|scalar|enum|input|implements|directive|on)\b/g,
    },
    { type: "abap-system-var", pattern: /\$[a-zA-Z0-9_]+/g },
    { type: "string", pattern: /(?:"""[\s\S]*?"""|"(?:\\.|[^\\"\r\n])*")/g },
    { type: "number", pattern: /\b\d+(?:\.\d+)?\b/g },
    { type: "keyword", pattern: /\b(?:true|false|null)\b/g },
  ],

  markdown: [
    { type: "keyword", pattern: /^#{1,6}\s+[^\r\n]*/gm },
    { type: "string", pattern: /`[^`\r\n]+`|```[\s\S]*?```/g },
    { type: "function", pattern: /!?\[[^\]]*\]\([^)]*\)/g },
    { type: "type", pattern: /(\*\*|__)[^\r\n*]+(\*\*|__)|(\*|_)[^\r\n*_]+(\*|_)/g },
    { type: "comment", pattern: /^(?:>\s*|[-*+]\s+|\d+\.\s+)/gm },
  ],

  diff: [
    { type: "string", pattern: /^\+[^\r\n]*/gm },
    { type: "comment", pattern: /^-[^\r\n]*/gm },
    { type: "type", pattern: /^@@[^@]+@@/gm },
    { type: "keyword", pattern: /^(?:diff|index|---|\+\+\+)[^\r\n]*/gm },
  ],

  lua: [
    { type: "comment", pattern: /--\[\[[\s\S]*?\]\]|--[^\r\n]*/g },
    { type: "string", pattern: /(["'])(?:\\[\s\S]|(?!\1)[^\\])*\1/g },
    {
      type: "keyword",
      pattern: /\b(?:and|break|do|else|elseif|end|false|for|function|goto|if|in|local|nil|not|or|repeat|return|then|true|until|while)\b/g,
    },
    { type: "number", pattern: /\b\d+(?:\.\d+)?\b/g },
    { type: "function", pattern: /\b[a-zA-Z_]\w*(?=\s*\()/g },
  ],

  powershell: [
    { type: "comment", pattern: /<#[\s\S]*?#>|#[^\r\n]*/g },
    { type: "string", pattern: /(["'])(?:\\[\s\S]|(?!\1)[^\\])*\1/g },
    { type: "abap-system-var", pattern: /\$[a-zA-Z0-9_:]+/g },
    {
      type: "keyword",
      pattern: /\b(?:if|else|elseif|switch|foreach|for|while|do|until|break|continue|return|try|catch|finally|throw|function|param|process|begin|end)\b/gi,
    },
    { type: "function", pattern: /\b[a-zA-Z]+-[a-zA-Z]+\b/g },
    { type: "number", pattern: /\b\d+(?:\.\d+)?\b/g },
  ],

  r: [
    { type: "comment", pattern: /#[^\r\n]*/g },
    { type: "string", pattern: /(["'])(?:\\[\s\S]|(?!\1)[^\\])*\1/g },
    { type: "keyword", pattern: /\b(?:if|else|repeat|while|function|for|in|next|break|TRUE|FALSE|NULL|Inf|NaN|NA)\b/g },
    { type: "number", pattern: /\b\d+(?:\.\d+)?\b/g },
    { type: "function", pattern: /\b[a-zA-Z._][a-zA-Z0-9._]*(?=\s*\()/g },
  ],

  scala: [
    { type: "comment", pattern: /\/\*[\s\S]*?\*\/|\/\/[^\r\n]*/g },
    { type: "string", pattern: /(?:"""[\s\S]*?"""|(["'])(?:\\[\s\S]|(?!\1)[^\\])*\1)/g },
    {
      type: "keyword",
      pattern:
        /\b(?:abstract|case|catch|class|def|do|else|extends|false|final|finally|for|forSome|if|implicit|import|lazy|match|new|null|object|override|package|private|protected|return|sealed|super|this|throw|trait|try|true|type|val|var|while|with|yield)\b/g,
    },
    { type: "number", pattern: /\b\d+(?:\.\d+)?\b/g },
    { type: "function", pattern: /\b[a-zA-Z_]\w*(?=\s*\()/g },
  ],

  makefile: [
    { type: "comment", pattern: /#[^\r\n]*/g },
    { type: "type", pattern: /^[a-zA-Z0-9_.-]+(?=\s*:)/gm },
    { type: "abap-system-var", pattern: /\$\([a-zA-Z0-9_]+\)|\$\{[a-zA-Z0-9_]+\}/g },
    {
      type: "keyword",
      pattern: /\b(?:ifeq|ifneq|ifdef|ifndef|else|endif|include|-include|sinclude|override|export|unexport|define|endef)\b/g,
    },
  ],

  protobuf: [
    { type: "comment", pattern: /\/\*[\s\S]*?\*\/|\/\/[^\r\n]*/g },
    { type: "string", pattern: /(["'])(?:\\[\s\S]|(?!\1)[^\\])*\1/g },
    {
      type: "keyword",
      pattern: /\b(?:syntax|package|import|option|message|enum|service|rpc|returns|oneof|repeated|optional|required|reserved|to)\b/g,
    },
    {
      type: "type",
      pattern: /\b(?:double|float|int32|int64|uint32|uint64|sint32|sint64|fixed32|fixed64|sfixed32|sfixed64|bool|string|bytes)\b/g,
    },
    { type: "number", pattern: /\b\d+\b/g },
  ],

  latex: [
    { type: "comment", pattern: /%[^\r\n]*/g },
    { type: "keyword", pattern: /\\(?:begin|end|documentclass|usepackage|newcommand|section|subsection|subsubsection|caption|label|ref|cite)\b/g },
    { type: "function", pattern: /\\[a-zA-Z]+/g },
    { type: "string", pattern: /\$[^$]+\$|\$\$[\s\S]+?\$\$/g },
    { type: "operator", pattern: /[{}\[\]]/g },
  ],

  plaintext: [],
};

// 语法引擎别名扩展映射
GRAMMARS.typescript = GRAMMARS.javascript;
GRAMMARS.ts = GRAMMARS.javascript;
GRAMMARS.js = GRAMMARS.javascript;
GRAMMARS.py = GRAMMARS.python;
GRAMMARS.sh = GRAMMARS.bash;
GRAMMARS.shell = GRAMMARS.bash;
GRAMMARS.zsh = GRAMMARS.bash;
GRAMMARS.batch = GRAMMARS.bash;
GRAMMARS.bat = GRAMMARS.bash;
GRAMMARS.cmd = GRAMMARS.bash;
GRAMMARS["c++"] = GRAMMARS.cpp;
GRAMMARS["c#"] = GRAMMARS.csharp;
GRAMMARS.cs = GRAMMARS.csharp;
GRAMMARS.golang = GRAMMARS.go;
GRAMMARS.rs = GRAMMARS.rust;
GRAMMARS.rb = GRAMMARS.ruby;
GRAMMARS.kt = GRAMMARS.kotlin;
GRAMMARS.kts = GRAMMARS.kotlin;
GRAMMARS.flutter = GRAMMARS.dart;
GRAMMARS.xml = GRAMMARS.html;
GRAMMARS.svg = GRAMMARS.html;
GRAMMARS.htm = GRAMMARS.html;
GRAMMARS.vue = GRAMMARS.html;
GRAMMARS.svelte = GRAMMARS.html;
GRAMMARS.scss = GRAMMARS.css;
GRAMMARS.sass = GRAMMARS.css;
GRAMMARS.less = GRAMMARS.css;
GRAMMARS.yml = GRAMMARS.yaml;
GRAMMARS.ini = GRAMMARS.toml;
GRAMMARS.properties = GRAMMARS.toml;
GRAMMARS.docker = GRAMMARS.dockerfile;
GRAMMARS.gql = GRAMMARS.graphql;
GRAMMARS.md = GRAMMARS.markdown;
GRAMMARS.patch = GRAMMARS.diff;
GRAMMARS.tex = GRAMMARS.latex;
GRAMMARS.proto = GRAMMARS.protobuf;
GRAMMARS.ps1 = GRAMMARS.powershell;
GRAMMARS.ps = GRAMMARS.powershell;
GRAMMARS.pl = GRAMMARS.python;
GRAMMARS.perl = GRAMMARS.python;
GRAMMARS.groovy = GRAMMARS.java;
GRAMMARS.elixir = GRAMMARS.ruby;
GRAMMARS.ex = GRAMMARS.ruby;
GRAMMARS.haskell = GRAMMARS.scala;
GRAMMARS.hs = GRAMMARS.scala;
GRAMMARS.julia = GRAMMARS.python;
GRAMMARS.jl = GRAMMARS.python;
GRAMMARS.objectivec = GRAMMARS.cpp;
GRAMMARS.objc = GRAMMARS.cpp;
GRAMMARS.assembly = GRAMMARS.c;
GRAMMARS.asm = GRAMMARS.c;
GRAMMARS.plsql = GRAMMARS.sql;
GRAMMARS.cmake = GRAMMARS.makefile;
GRAMMARS.make = GRAMMARS.makefile;
GRAMMARS.text = GRAMMARS.plaintext;
GRAMMARS.txt = GRAMMARS.plaintext;

// 全量受支持的高频及主流语言列表（共 50+ 种）
const SUPPORTED_LANGUAGES = [
  // 核心高频与常用语言
  { id: "abap", label: "ABAP", aliases: ["sap"] },
  { id: "javascript", label: "JavaScript", aliases: ["js"] },
  { id: "typescript", label: "TypeScript", aliases: ["ts"] },
  { id: "python", label: "Python", aliases: ["py"] },
  { id: "java", label: "Java" },
  { id: "c", label: "C" },
  { id: "cpp", label: "C++", aliases: ["c++"] },
  { id: "csharp", label: "C#", aliases: ["c#", "cs"] },
  { id: "go", label: "Go", aliases: ["golang"] },
  { id: "rust", label: "Rust", aliases: ["rs"] },
  { id: "sql", label: "SQL" },
  { id: "html", label: "HTML", aliases: ["htm"] },
  { id: "css", label: "CSS" },
  { id: "json", label: "JSON" },
  { id: "yaml", label: "YAML", aliases: ["yml"] },
  { id: "bash", label: "Bash", aliases: ["sh", "shell", "zsh"] },
  { id: "markdown", label: "Markdown", aliases: ["md"] },

  // 后端、系统与通用编程语言
  { id: "php", label: "PHP" },
  { id: "ruby", label: "Ruby", aliases: ["rb"] },
  { id: "swift", label: "Swift" },
  { id: "kotlin", label: "Kotlin", aliases: ["kt", "kts"] },
  { id: "dart", label: "Dart", aliases: ["flutter"] },
  { id: "scala", label: "Scala" },
  { id: "lua", label: "Lua" },
  { id: "perl", label: "Perl", aliases: ["pl"] },
  { id: "r", label: "R" },
  { id: "groovy", label: "Groovy" },
  { id: "elixir", label: "Elixir", aliases: ["ex"] },
  { id: "haskell", label: "Haskell", aliases: ["hs"] },
  { id: "julia", label: "Julia", aliases: ["jl"] },
  { id: "objectivec", label: "Objective-C", aliases: ["objc"] },
  { id: "assembly", label: "Assembly", aliases: ["asm"] },

  // 前端与扩展样式
  { id: "scss", label: "SCSS", aliases: ["sass"] },
  { id: "less", label: "Less" },
  { id: "vue", label: "Vue" },
  { id: "svelte", label: "Svelte" },
  { id: "xml", label: "XML", aliases: ["svg"] },
  { id: "graphql", label: "GraphQL", aliases: ["gql"] },

  // 脚本、终端与运维/配置
  { id: "powershell", label: "PowerShell", aliases: ["ps1", "ps"] },
  { id: "batch", label: "Batch (CMD)", aliases: ["bat", "cmd"] },
  { id: "dockerfile", label: "Dockerfile", aliases: ["docker"] },
  { id: "nginx", label: "Nginx" },
  { id: "makefile", label: "Makefile", aliases: ["make"] },
  { id: "cmake", label: "CMake" },
  { id: "toml", label: "TOML" },
  { id: "ini", label: "INI", aliases: ["properties", "cfg"] },
  { id: "protobuf", label: "Protocol Buffers", aliases: ["proto"] },

  // 数据库与查询扩展
  { id: "plsql", label: "PL/SQL" },

  // 文档标记与版本对比
  { id: "diff", label: "Diff / Patch", aliases: ["patch"] },
  { id: "latex", label: "LaTeX / TeX", aliases: ["tex"] },
  { id: "plaintext", label: "Plain Text", aliases: ["text", "txt"] },
];

function resolveLanguageId(id) {
  if (!id) return "plaintext";
  const normalized = id.trim().toLowerCase();
  for (const item of SUPPORTED_LANGUAGES) {
    if (item.id === normalized) return item.id;
    if (item.aliases && item.aliases.includes(normalized)) return item.id;
  }
  if (GRAMMARS[normalized]) return normalized;
  return normalized;
}

function escapeHtml(s) {
  return (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightCode(code, lang) {
  const resolvedLang = resolveLanguageId(lang);
  const rules = GRAMMARS[resolvedLang] || GRAMMARS[lang];
  if (!rules || rules.length === 0) {
    return escapeHtml(code);
  }
  const matches = [];

  for (const rule of rules) {
    let match;
    const re = new RegExp(rule.pattern.source, rule.pattern.flags);
    while ((match = re.exec(code)) !== null) {
      if (match[0].length === 0) {
        re.lastIndex++;
        continue;
      }
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

// ==================== 3. Ray.so 风格代码卡片纯 Canvas 2D 高保真渲染引擎 ====================
function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function extractTokensFromLine(lineEl) {
  const tokens = [];
  function walk(node) {
    if (node.nodeType === 3) {
      if (node.nodeValue) {
        tokens.push({ text: node.nodeValue, color: "#abb2bf" });
      }
    } else if (node.nodeType === 1) {
      const cls = node.className || "";
      let color = "#abb2bf";
      if (cls.includes("keyword")) color = "#c678dd";
      else if (cls.includes("function") || cls.includes("built_in")) color = "#61afef";
      else if (cls.includes("string")) color = "#98c379";
      else if (cls.includes("comment")) color = "#5c6370";
      else if (cls.includes("number")) color = "#d19a66";
      else if (cls.includes("system-var") || cls.includes("variable")) color = "#e06c75";
      else if (cls.includes("operator")) color = "#56b6c2";
      else if (cls.includes("type")) color = "#e5c07b";

      for (let i = 0; i < node.childNodes.length; i++) {
        const child = node.childNodes[i];
        if (child.nodeType === 3) {
          tokens.push({ text: child.nodeValue, color });
        } else {
          walk(child);
        }
      }
    }
  }
  walk(lineEl);
  return tokens;
}

function renderRayCardToCanvas(cardNode, options = {}) {
  const gradientName = cardNode.getAttribute("data-gradient") || "aurora";
  const showLineNumbers = options.showLineNumbers !== false;
  const langLabel = options.langLabel || "CODE";
  const highlightedSet = options.highlightedSet || new Set();

  const fontSize = Number(options.fontSize) || 13.5;
  const padding = Number(options.padding) || 36;
  const scale = Number(options.scale) || 2;
  const hasShadow = options.hasShadow !== false;
  const showWatermark = options.showWatermark !== false;

  const lineEls = Array.from(cardNode.querySelectorAll(".edgeever-code-line"));
  const linesCount = lineEls.length;

  // 基础参数配置（随 fontSize 与 padding 弹性计算）
  const cardPadX = padding;
  const cardPadY = Math.round(padding * 0.88);
  const headerHeight = Math.max(34, Math.round(fontSize * 2.6));
  const lineHeight = Math.round(fontSize * 1.62);
  const winPadTop = Math.round(fontSize * 1.1);
  const winPadBottom = Math.round(fontSize * 1.1);
  const winPadX = Math.round(fontSize * 1.35);
  const gutterWidth = showLineNumbers ? Math.round(fontSize * 2.8) : 0;
  const font = `${fontSize}px ui-monospace, "JetBrains Mono", Menlo, Monaco, Consolas, monospace`;

  // 测量最长的一行代码宽度
  const measureCanvas = document.createElement("canvas");
  const mCtx = measureCanvas.getContext("2d");
  mCtx.font = font;

  let maxTextWidth = 320;
  lineEls.forEach((lineEl) => {
    const text = lineEl.innerText || lineEl.textContent || "";
    const w = mCtx.measureText(text).width;
    if (w > maxTextWidth) maxTextWidth = w;
  });

  const windowWidth = Math.max(460, Math.ceil(maxTextWidth + gutterWidth + winPadX * 2));
  const windowHeight = headerHeight + winPadTop + linesCount * lineHeight + winPadBottom;

  const totalWidth = windowWidth + cardPadX * 2;
  const totalHeight = windowHeight + cardPadY * 2 + (showWatermark ? 20 : 0);

  // 创建 Canvas
  const canvas = document.createElement("canvas");
  canvas.width = totalWidth * scale;
  canvas.height = totalHeight * scale;
  const ctx = canvas.getContext("2d");
  ctx.scale(scale, scale);

  // 1. 绘制渐变背景
  const GRADIENTS = {
    aurora: ["#4f46e5", "#7c3aed", "#ec4899"],
    cyber: ["#0ea5e9", "#3b82f6", "#6366f1"],
    sunset: ["#f59e0b", "#ef4444", "#ec4899"],
    emerald: ["#059669", "#10b981", "#06b6d4"],
    dark: ["#18181b", "#27272a", "#3f3f46"],
  };
  const colors = GRADIENTS[gradientName] || GRADIENTS.aurora;
  const grad = ctx.createLinearGradient(0, 0, totalWidth, totalHeight);
  grad.addColorStop(0, colors[0]);
  grad.addColorStop(0.5, colors[1]);
  grad.addColorStop(1, colors[2]);

  drawRoundedRect(ctx, 0, 0, totalWidth, totalHeight, Math.max(12, Math.round(padding * 0.4)));
  ctx.fillStyle = grad;
  ctx.fill();

  // 2. 绘制窗口外阴影与主体容器
  const winX = cardPadX;
  const winY = cardPadY;

  ctx.save();
  if (hasShadow) {
    ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
    ctx.shadowBlur = Math.round(padding * 0.85);
    ctx.shadowOffsetY = Math.round(padding * 0.4);
  } else {
    ctx.shadowColor = "transparent";
  }
  drawRoundedRect(ctx, winX, winY, windowWidth, windowHeight, 10);
  ctx.fillStyle = "#21252b";
  ctx.fill();
  ctx.restore();

  // 绘制窗口边框
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.lineWidth = 1;
  drawRoundedRect(ctx, winX, winY, windowWidth, windowHeight, 10);
  ctx.stroke();

  // 3. 绘制 Header
  ctx.save();
  drawRoundedRect(ctx, winX, winY, windowWidth, windowHeight, 10);
  ctx.clip();

  ctx.fillStyle = "#1b1d23";
  ctx.fillRect(winX, winY, windowWidth, headerHeight);

  ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
  ctx.beginPath();
  ctx.moveTo(winX, winY + headerHeight);
  ctx.lineTo(winX + windowWidth, winY + headerHeight);
  ctx.stroke();

  // Mac 三色小圆点
  const dotY = winY + headerHeight / 2;
  ctx.fillStyle = "#ff5f56";
  ctx.beginPath();
  ctx.arc(winX + 16, dotY, 5.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ffbd2e";
  ctx.beginPath();
  ctx.arc(winX + 32, dotY, 5.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#27c93f";
  ctx.beginPath();
  ctx.arc(winX + 48, dotY, 5.5, 0, Math.PI * 2);
  ctx.fill();

  // 语言 Badge
  ctx.font = "bold 11px -apple-system, BlinkMacSystemFont, sans-serif";
  const badgeText = langLabel.toUpperCase();
  const badgeWidth = ctx.measureText(badgeText).width + 14;
  const badgeX = winX + windowWidth - badgeWidth - 14;
  const badgeY = winY + (headerHeight - 20) / 2;

  drawRoundedRect(ctx, badgeX, badgeY, badgeWidth, 20, 4);
  ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
  ctx.fill();

  ctx.fillStyle = "#94a3b8";
  ctx.textAlign = "center";
  ctx.fillText(badgeText, badgeX + badgeWidth / 2, badgeY + 14);
  ctx.restore();

  // 4. 绘制代码行与行号
  const contentStartY = winY + headerHeight + winPadTop;
  const codeStartX = winX + winPadX + (showLineNumbers ? gutterWidth : 0);
  const gutterX = winX + winPadX;
  const baselineOffset = Math.round(fontSize * 1.05);

  lineEls.forEach((lineEl, idx) => {
    const lineNum = idx + 1;
    const y = contentStartY + idx * lineHeight;
    const isHighlighted = highlightedSet.has(lineNum);
    const isFocusMuted = highlightedSet.size > 0 && !isHighlighted;

    // 重点高亮行底色
    if (isHighlighted) {
      ctx.fillStyle = "rgba(97, 175, 239, 0.22)";
      ctx.fillRect(winX + 1, y - 2, windowWidth - 2, lineHeight);
      ctx.fillStyle = "#61afef";
      ctx.fillRect(winX + 1, y - 2, 3, lineHeight);
    }

    // 绘制行号
    if (showLineNumbers) {
      ctx.font = `${Math.max(11, fontSize - 1.5)}px ui-monospace, "JetBrains Mono", Menlo, Consolas, monospace`;
      ctx.fillStyle = isHighlighted ? "#61afef" : "#5c6370";
      ctx.textAlign = "right";
      ctx.fillText(String(lineNum), gutterX + gutterWidth - 14, y + baselineOffset);
    }

    // 绘制代码文本 Tokens
    ctx.save();
    if (isFocusMuted) {
      ctx.globalAlpha = 0.38;
    }
    ctx.font = font;
    ctx.textAlign = "left";

    let currentX = codeStartX;
    const tokens = extractTokensFromLine(lineEl);
    for (const tok of tokens) {
      ctx.fillStyle = tok.color;
      ctx.fillText(tok.text, currentX, y + baselineOffset);
      currentX += ctx.measureText(tok.text).width;
    }
    ctx.restore();
  });

  // 绘制行号分割线
  if (showLineNumbers) {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.beginPath();
    const divX = gutterX + gutterWidth - 6;
    ctx.moveTo(divX, contentStartY - 4);
    ctx.lineTo(divX, contentStartY + linesCount * lineHeight);
    ctx.stroke();
  }

  // 5. 绘制右下角水印
  if (showWatermark) {
    ctx.font = "600 11px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
    ctx.textAlign = "right";
    ctx.fillText("EdgeEver Code Pro", totalWidth - cardPadX, totalHeight - 12);
  }

  return canvas;
}

function downloadCanvasImage(canvas, filename) {
  try {
    const dataUrl = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => a.remove(), 100);
    return true;
  } catch (err) {
    console.error("Canvas toDataURL download failed:", err);
    return false;
  }
}

async function copyCanvasImageToClipboard(canvas) {
  if (navigator.clipboard?.write && typeof ClipboardItem !== "undefined") {
    try {
      const blob = await new Promise((res) => canvas.toBlob(res, "image/png"));
      if (blob) {
        const item = new ClipboardItem({ "image/png": blob });
        await navigator.clipboard.write([item]);
        return true;
      }
    } catch (err) {
      console.warn("navigator.clipboard.write failed:", err);
    }
  }
  return false;
}

function openRayCodeCardModal(block, detectedLang, langLabel, context, settings = {}) {
  const existing = document.querySelector(".edgeever-code-card-modal-backdrop");
  if (existing) existing.remove();

  const sourceEl = block.querySelector(".edgeever-code-source") || block.querySelector("code") || block;
  const rawCode = block.dataset.originalRawCode || sourceEl.innerText || sourceEl.textContent || "";
  const lines = rawCode.split(/\r?\n/);
  const linesCount = lines.length;
  const highlightedSet = block._highlightedLines || new Set();

  // 当前属性配置状态
  let currentPadding = settings.cardDefaultPadding || "36";
  let currentFontSize = settings.cardDefaultFontSize || "13.5";
  let currentScale = settings.cardDefaultScale || "2";
  let currentHasShadow = true;
  let currentShowWatermark = true;

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
      <!-- 顶层：标题栏与关闭按钮 -->
      <div class="edgeever-code-card-modal-topbar">
        <div class="edgeever-code-card-title">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
          <span>代码卡片导出 (Ray.so 风格)</span>
        </div>
        <button type="button" class="edgeever-code-card-modal-close" title="关闭 (Esc)">✕</button>
      </div>

      <!-- 独立参数工具栏：横向一行展开，各组清晰分割，不挤压 -->
      <div class="edgeever-code-card-toolbar">
        <!-- 1. 背景色 -->
        <div class="edgeever-code-card-control-item">
          <span class="edgeever-code-card-label">背景</span>
          <div class="edgeever-code-gradient-picker">
            <span class="gradient-dot active" data-gradient="aurora" title="极光紫" style="background: linear-gradient(135deg, #4f46e5, #7c3aed, #ec4899);"></span>
            <span class="gradient-dot" data-gradient="cyber" title="科技蓝" style="background: linear-gradient(135deg, #0ea5e9, #3b82f6, #6366f1);"></span>
            <span class="gradient-dot" data-gradient="sunset" title="落日暖橙" style="background: linear-gradient(135deg, #f59e0b, #ef4444, #ec4899);"></span>
            <span class="gradient-dot" data-gradient="emerald" title="翡翠绿" style="background: linear-gradient(135deg, #059669, #10b981, #06b6d4);"></span>
            <span class="gradient-dot" data-gradient="dark" title="黑曜石" style="background: linear-gradient(135deg, #18181b, #27272a, #3f3f46);"></span>
          </div>
        </div>

        <div class="edgeever-code-card-divider"></div>

        <!-- 2. 间距 Padding -->
        <div class="edgeever-code-card-control-item">
          <span class="edgeever-code-card-label">边距</span>
          <div class="edgeever-code-card-segment" id="cardPaddingSegment">
            <button type="button" class="edgeever-code-card-segment-btn${currentPadding === "16" ? " active" : ""}" data-val="16">16px</button>
            <button type="button" class="edgeever-code-card-segment-btn${currentPadding === "36" ? " active" : ""}" data-val="36">36px</button>
            <button type="button" class="edgeever-code-card-segment-btn${currentPadding === "56" ? " active" : ""}" data-val="56">56px</button>
          </div>
        </div>

        <div class="edgeever-code-card-divider"></div>

        <!-- 3. 字号 Font Size -->
        <div class="edgeever-code-card-control-item">
          <span class="edgeever-code-card-label">字号</span>
          <div class="edgeever-code-card-segment" id="cardFontSizeSegment">
            <button type="button" class="edgeever-code-card-segment-btn${currentFontSize === "12" ? " active" : ""}" data-val="12">12px</button>
            <button type="button" class="edgeever-code-card-segment-btn${currentFontSize === "13.5" ? " active" : ""}" data-val="13.5">13.5px</button>
            <button type="button" class="edgeever-code-card-segment-btn${currentFontSize === "15" ? " active" : ""}" data-val="15">15px</button>
          </div>
        </div>

        <div class="edgeever-code-card-divider"></div>

        <!-- 4. 清晰度 Scale -->
        <div class="edgeever-code-card-control-item">
          <span class="edgeever-code-card-label">倍率</span>
          <div class="edgeever-code-card-segment" id="cardScaleSegment">
            <button type="button" class="edgeever-code-card-segment-btn${currentScale === "1" ? " active" : ""}" data-val="1">1x</button>
            <button type="button" class="edgeever-code-card-segment-btn${currentScale === "2" ? " active" : ""}" data-val="2">2x</button>
            <button type="button" class="edgeever-code-card-segment-btn${currentScale === "3" ? " active" : ""}" data-val="3">3x</button>
          </div>
        </div>

        <div class="edgeever-code-card-divider"></div>

        <!-- 5. 开关项 -->
        <div class="edgeever-code-card-control-item">
          <label class="edgeever-code-card-checkbox" title="是否在卡片中显示代码行号">
            <input type="checkbox" id="rayCardShowLines" checked>
            <span>行号</span>
          </label>
          <label class="edgeever-code-card-checkbox" title="是否显示外围立体投影">
            <input type="checkbox" id="rayCardShowShadow" checked>
            <span>阴影</span>
          </label>
        </div>
      </div>

      <div class="edgeever-code-card-preview-viewport">
        <div class="edgeever-ray-card${highlightedSet.size > 0 ? " has-line-focus" : ""}" id="rayCardNode" data-gradient="aurora" data-padding="${currentPadding}" data-font-size="${currentFontSize}">
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
        <span class="edgeever-code-card-tip">所见即所得：支持调节背景间距、字号大小与视网膜超清倍率</span>
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
  const showShadowCheck = backdrop.querySelector("#rayCardShowShadow");
  const copyBtn = backdrop.querySelector(".copy-card-btn");
  const downloadBtn = backdrop.querySelector(".download-card-btn");
  const closeBtn = backdrop.querySelector(".edgeever-code-card-modal-close");

  // 1. 渐变背景切换
  backdrop.querySelectorAll(".gradient-dot").forEach((dot) => {
    dot.onclick = () => {
      backdrop.querySelectorAll(".gradient-dot").forEach((d) => d.classList.remove("active"));
      dot.classList.add("active");
      cardNode.setAttribute("data-gradient", dot.dataset.gradient);
    };
  });

  // 2. 边距切换
  backdrop.querySelectorAll("#cardPaddingSegment .edgeever-code-card-segment-btn").forEach((btn) => {
    btn.onclick = () => {
      backdrop.querySelectorAll("#cardPaddingSegment .edgeever-code-card-segment-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentPadding = btn.dataset.val;
      cardNode.setAttribute("data-padding", currentPadding);
    };
  });

  // 3. 字号切换
  backdrop.querySelectorAll("#cardFontSizeSegment .edgeever-code-card-segment-btn").forEach((btn) => {
    btn.onclick = () => {
      backdrop.querySelectorAll("#cardFontSizeSegment .edgeever-code-card-segment-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentFontSize = btn.dataset.val;
      cardNode.setAttribute("data-font-size", currentFontSize);
    };
  });

  // 4. 倍率切换
  backdrop.querySelectorAll("#cardScaleSegment .edgeever-code-card-segment-btn").forEach((btn) => {
    btn.onclick = () => {
      backdrop.querySelectorAll("#cardScaleSegment .edgeever-code-card-segment-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentScale = btn.dataset.val;
    };
  });

  // 5. 行号显隐切换
  showLinesCheck.onchange = () => {
    gutterNode.style.display = showLinesCheck.checked ? "block" : "none";
  };

  // 6. 阴影显隐切换
  showShadowCheck.onchange = () => {
    currentHasShadow = showShadowCheck.checked;
    cardNode.classList.toggle("no-shadow", !currentHasShadow);
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

  // 获取当前导出配置
  function getCurrentRenderOptions() {
    return {
      showLineNumbers: showLinesCheck.checked,
      langLabel: langLabel,
      highlightedSet: highlightedSet,
      fontSize: currentFontSize,
      padding: currentPadding,
      scale: currentScale,
      hasShadow: currentHasShadow,
      showWatermark: currentShowWatermark,
    };
  }

  // 复制图片到剪贴板
  copyBtn.onclick = async () => {
    try {
      copyBtn.querySelector("span").textContent = "正在生成...";
      const canvas = renderRayCardToCanvas(cardNode, getCurrentRenderOptions());

      const copied = await copyCanvasImageToClipboard(canvas);
      if (copied) {
        copyBtn.classList.add("copied");
        copyBtn.querySelector("span").textContent = "已复制图片 ✓";
        context.ui?.showNotice?.("Ray.so 风格代码卡片已成功复制到剪贴板！");
        setTimeout(() => {
          copyBtn.classList.remove("copied");
          copyBtn.querySelector("span").textContent = "复制图片到剪贴板";
        }, 2000);
      } else {
        // 若系统禁止直接写剪贴板，自动兜底下载并给用户明确提示
        downloadCanvasImage(canvas, `code-card-${Date.now()}.png`);
        context.ui?.showNotice?.("剪贴板权限受限，已为您自动下载 PNG 卡片！");
        copyBtn.querySelector("span").textContent = "已自动下载图片 ✓";
        setTimeout(() => {
          copyBtn.querySelector("span").textContent = "复制图片到剪贴板";
        }, 2000);
      }
    } catch (err) {
      console.error("Card copy error:", err);
      context.ui?.showNotice?.("导出图片时发生异常，请重试！");
      copyBtn.querySelector("span").textContent = "复制图片到剪贴板";
    }
  };

  // 下载 PNG 图片
  downloadBtn.onclick = () => {
    try {
      downloadBtn.querySelector("span").textContent = "正在生成...";
      const canvas = renderRayCardToCanvas(cardNode, getCurrentRenderOptions());

      const ok = downloadCanvasImage(canvas, `code-card-${Date.now()}.png`);
      if (ok) {
        context.ui?.showNotice?.("代码卡片 PNG 下载成功！");
      } else {
        context.ui?.showNotice?.("下载图片失败，请检查浏览器权限！");
      }
      downloadBtn.querySelector("span").textContent = "下载 PNG 图片";
    } catch (err) {
      console.error("Card download error:", err);
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
      cardDefaultPadding: "36",
      cardDefaultFontSize: "13.5",
      cardDefaultScale: "2",
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
        const cardPad = await context.settings.get("card_default_padding");
        const cardFont = await context.settings.get("card_default_font_size");
        const cardScale = await context.settings.get("card_default_scale");
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
        if (cardPad) settings.cardDefaultPadding = String(cardPad);
        if (cardFont) settings.cardDefaultFontSize = String(cardFont);
        if (cardScale) settings.cardDefaultScale = String(cardScale);
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

      detectedLang = resolveLanguageId(detectedLang) || "plaintext";
      const matchedLang =
        SUPPORTED_LANGUAGES.find((l) => l.id === detectedLang || (l.aliases && l.aliases.includes(detectedLang))) || {
          id: detectedLang,
          label: detectedLang ? detectedLang.toUpperCase() : "PLAIN TEXT",
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

        // 搜索输入过滤栏
        const searchWrap = document.createElement("div");
        searchWrap.className = "edgeever-code-lang-search-wrap";
        searchWrap.innerHTML = `
          <svg class="edgeever-code-lang-search-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" class="edgeever-code-lang-search-input" placeholder="搜索语言 (如 java, rust)..." />
        `;
        menu.appendChild(searchWrap);

        const listWrap = document.createElement("div");
        listWrap.className = "edgeever-code-lang-list";

        const emptyTip = document.createElement("div");
        emptyTip.className = "edgeever-code-lang-empty";
        emptyTip.textContent = "未找到匹配语言";
        emptyTip.style.display = "none";

        const searchInput = searchWrap.querySelector(".edgeever-code-lang-search-input");

        // 渲染语言项
        function renderItems(filterQuery = "") {
          listWrap.innerHTML = "";
          const q = (filterQuery || "").trim().toLowerCase();
          const filtered = SUPPORTED_LANGUAGES.filter((l) => {
            if (!q) return true;
            if (l.id.toLowerCase().includes(q)) return true;
            if (l.label.toLowerCase().includes(q)) return true;
            if (l.aliases && l.aliases.some((a) => a.toLowerCase().includes(q))) return true;
            return false;
          });

          if (filtered.length === 0) {
            emptyTip.style.display = "block";
          } else {
            emptyTip.style.display = "none";
            filtered.forEach((l) => {
              const item = document.createElement("button");
              item.type = "button";
              item.className = `edgeever-code-lang-item${l.id === detectedLang ? " active" : ""}`;
              item.textContent = l.label;
              item.onclick = (e) => {
                e.stopPropagation();
                langSelector.classList.remove("open");
                changeCodeBlockLanguage(block, sourceEl, l.id);
              };
              listWrap.appendChild(item);
            });
          }
        }

        renderItems();
        menu.appendChild(listWrap);
        menu.appendChild(emptyTip);

        // 搜索交互
        searchInput.oninput = (e) => {
          e.stopPropagation();
          renderItems(searchInput.value);
        };

        searchInput.onclick = (e) => {
          e.stopPropagation();
        };

        searchInput.onkeydown = (e) => {
          e.stopPropagation();
          if (e.key === "Enter") {
            e.preventDefault();
            const firstBtn = listWrap.querySelector(".edgeever-code-lang-item");
            if (firstBtn) firstBtn.click();
          } else if (e.key === "Escape") {
            e.preventDefault();
            langSelector.classList.remove("open");
          }
        };

        badgeBtn.onclick = (e) => {
          e.stopPropagation();
          const isOpen = langSelector.classList.contains("open");
          document.querySelectorAll(".edgeever-code-lang-selector.open").forEach((el) => {
            el.classList.remove("open");
          });
          if (!isOpen) {
            langSelector.classList.add("open");
            searchInput.value = "";
            renderItems();
            setTimeout(() => {
              searchInput.focus();
            }, 60);
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
          openRayCodeCardModal(block, detectedLang, matchedLang.label, context, settings);
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
        const langKey = resolveLanguageId(detectedLang);
        if (langKey && GRAMMARS[langKey] && GRAMMARS[langKey].length > 0) {
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
