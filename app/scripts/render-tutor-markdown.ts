export interface TutorMarkdownAnchor {
  id: string;
  heading: string;
}

export const TUTOR_MARKDOWN_RENDERER_VERSION = 3;

export function renderTutorMarkdownPage(
  title: string,
  locator: string,
  body: string,
  anchors: readonly TutorMarkdownAnchor[],
): string {
  const byHeading = new Map(anchors.map((anchor) => [normalizarHeading(anchor.heading), anchor.id]));
  const { frontmatter, markdown } = extraerFrontmatter(body);
  const content = Bun.markdown.render(markdown, {
    heading: (children, meta) => {
      const id = byHeading.get(normalizarHeading(children)) ?? meta.id;
      const idAttr = id ? ` id="${escapeAttr(id)}"` : "";
      return `<h${meta.level}${idAttr}>${children}</h${meta.level}>`;
    },
    paragraph: (children) => `<p>${children}</p>`,
    blockquote: (children) => `<blockquote>${children}</blockquote>`,
    code: (children, meta) => {
      const language = meta?.language ? ` data-language="${escapeAttr(meta.language)}"` : "";
      return `<pre${language}><code>${children}</code></pre>`;
    },
    list: (children, meta) => meta.ordered
      ? `<ol${meta.start && meta.start !== 1 ? ` start="${meta.start}"` : ""}>${children}</ol>`
      : `<ul>${children}</ul>`,
    listItem: (children, meta) => {
      const task = typeof meta?.checked === "boolean"
        ? `<input type="checkbox" disabled${meta.checked ? " checked" : ""} aria-hidden="true">`
        : "";
      return `<li>${task}${children}</li>`;
    },
    hr: () => "<hr>",
    table: (children) => `<div class="table-scroll" role="region" aria-label="Tabla desplazable" tabindex="0"><table>${children}</table></div>`,
    thead: (children) => `<thead>${children}</thead>`,
    tbody: (children) => `<tbody>${children}</tbody>`,
    tr: (children) => `<tr>${children}</tr>`,
    th: (children, meta) => `<th${alignmentAttr(meta?.align)}>${children}</th>`,
    td: (children, meta) => `<td${alignmentAttr(meta?.align)}>${children}</td>`,
    html: (children) => children,
    strong: (children) => `<strong>${children}</strong>`,
    emphasis: (children) => `<em>${children}</em>`,
    link: (children, meta) => {
      const href = safeUrl(meta.href, false);
      if (!href) return children;
      const external = /^https?:\/\//i.test(href);
      const titleAttr = meta.title ? ` title="${escapeAttr(meta.title)}"` : "";
      const externalAttrs = external ? ' target="_blank" rel="noreferrer noopener"' : "";
      return `<a href="${escapeAttr(href)}"${titleAttr}${externalAttrs}>${children}</a>`;
    },
    image: (children, meta) => {
      const src = safeUrl(meta.src, true);
      if (!src) return children;
      const titleAttr = meta.title ? ` title="${escapeAttr(meta.title)}"` : "";
      return `<img src="${escapeAttr(src)}" alt="${escapeAttr(textoHtml(children))}"${titleAttr} loading="lazy">`;
    },
    codespan: (children) => `<code>${children}</code>`,
    strikethrough: (children) => `<del>${children}</del>`,
    text: escapeHtml,
  }, {
    headings: { ids: true },
    tables: true,
    strikethrough: true,
    tasklists: true,
    tagFilter: true,
  });

  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="light">
  <title>${escapeHtml(title)} · Fuentes de OpForja</title>
  <style>
    :root{
      --paper:#fafaf8;
      --paper-warm:#eeece2;
      --ink:#171511;
      --ink-mid:#5a564c;
      --ink-soft:#807b6e;
      --rule:#d3cec1;
      --rule-strong:#aea899;
      --crimson:#8e2a2e;
      color-scheme:light;
      font-family:"Inria Serif",Georgia,serif;
      font-variant-numeric:tabular-nums
    }
    *,*::before,*::after{box-sizing:border-box}
    html{background:var(--paper);color:var(--ink)}
    body{margin:0;min-width:0;background:var(--paper);color:var(--ink);font:18px/1.68 "Inria Serif",Georgia,serif}
    a{color:var(--crimson);text-decoration-thickness:1px;text-underline-offset:.16em}
    a:hover{text-decoration-thickness:2px}
    :focus-visible{outline:2px solid var(--crimson);outline-offset:3px}
    .skip-link{position:fixed;z-index:2;top:8px;left:8px;transform:translateY(-180%);padding:8px 12px;background:var(--ink);color:var(--paper);font:700 13px/1.2 "Inria Sans",Arial,sans}
    .skip-link:focus{transform:translateY(0)}
    .source-header{border-bottom:1px solid var(--rule);background:var(--paper-warm)}
    .source-header-inner{width:min(100% - 40px,900px);margin:0 auto;padding:26px 0 22px}
    .source-kicker{margin:0 0 6px;color:var(--crimson);font:700 12px/1.2 "Inria Sans",Arial,sans;letter-spacing:.09em;text-transform:uppercase}
    .source-title{margin:0;font-size:clamp(24px,4vw,36px);font-weight:700;line-height:1.08;letter-spacing:-.018em}
    .source-locator{display:block;margin-top:10px;color:var(--ink-mid);font:12px/1.5 "JetBrains Mono Variable","JetBrains Mono",ui-monospace,monospace;overflow-wrap:anywhere}
    .reader{width:min(100% - 40px,900px);margin:0 auto;padding:44px 0 80px}
    .reader>*:first-child{margin-top:0}
    .reader h1,.reader h2,.reader h3,.reader h4,.reader h5,.reader h6{max-width:30ch;margin:2.2em 0 .62em;font-weight:700;line-height:1.16;letter-spacing:-.012em;scroll-margin-top:24px}
    .reader h1{font-size:clamp(30px,5vw,48px)}
    .reader h2{padding-bottom:.25em;border-bottom:1px solid var(--rule);font-size:clamp(25px,4vw,34px)}
    .reader h3{font-size:clamp(21px,3vw,27px)}
    .reader h4{font-size:20px}
    .reader h5,.reader h6{font-size:18px}
    .reader p,.reader ul,.reader ol,.reader blockquote{max-width:72ch;margin:0 0 1.15em}
    .reader ul,.reader ol{padding-left:1.35em}
    .reader li{margin:.34em 0;padding-left:.18em}
    .reader li>p{display:inline}
    .reader li>ul,.reader li>ol{margin-top:.34em}
    .reader input[type="checkbox"]{margin:0 .55em 0 0;accent-color:var(--crimson)}
    .reader blockquote{margin-left:0;padding:.2em 0 .2em 1.25em;border-left:3px solid var(--crimson);color:var(--ink-mid)}
    .reader code{padding:.1em .32em;background:var(--paper-warm);font:13px/1.55 "JetBrains Mono Variable","JetBrains Mono",ui-monospace,monospace;overflow-wrap:anywhere}
    .reader pre{max-width:100%;margin:1.5em 0;padding:16px 18px;overflow:auto;border:1px solid var(--rule);background:var(--paper-warm);font-size:13px;line-height:1.55}
    .reader pre code{padding:0;background:transparent;white-space:pre;overflow-wrap:normal}
    .reader hr{margin:2.5em 0;border:0;border-top:1px solid var(--rule-strong)}
    .reader img{display:block;max-width:100%;height:auto;margin:1.5em 0}
    .table-scroll{max-width:100%;margin:1.5em 0;overflow-x:auto;border-top:1px solid var(--rule-strong);border-bottom:1px solid var(--rule-strong)}
    .reader table{width:100%;border-collapse:collapse;font-size:16px}
    .reader th,.reader td{min-width:8rem;padding:10px 12px;border-bottom:1px solid var(--rule);text-align:left;vertical-align:top}
    .reader th{font-family:"Inria Sans",Arial,sans;font-weight:700}
    .source-metadata{max-width:72ch;margin:0 0 2.5em;border-top:1px solid var(--rule);border-bottom:1px solid var(--rule)}
    .source-metadata summary{padding:10px 0;cursor:pointer;color:var(--ink-mid);font:700 13px/1.4 "Inria Sans",Arial,sans;letter-spacing:.02em}
    .source-metadata pre{margin:0 0 14px}
    .reader :target{outline:3px solid var(--crimson);outline-offset:6px;background:var(--paper-warm)}
    @media (max-width:600px){
      body{font-size:17px;line-height:1.62}
      .source-header-inner,.reader{width:min(100% - 28px,900px)}
      .source-header-inner{padding:20px 0 18px}
      .reader{padding:32px 0 60px}
      .reader h1,.reader h2,.reader h3,.reader h4,.reader h5,.reader h6{scroll-margin-top:16px}
    }
    @media print{
      .skip-link{display:none}
      body{font-size:11pt}
      .source-header{background:transparent}
      .reader{width:100%;padding:24px 0}
      a{color:inherit}
    }
  </style>
</head>
<body>
  <a class="skip-link" href="#source-content">Saltar al contenido</a>
  <header class="source-header">
    <div class="source-header-inner">
      <p class="source-kicker">Fuente de OpForja</p>
      <p class="source-title">${escapeHtml(title)}</p>
      <code class="source-locator">${escapeHtml(locator)}</code>
    </div>
  </header>
  <main id="source-content" class="reader" tabindex="-1">${frontmatter ? `<details class="source-metadata"><summary>Metadatos de la fuente</summary><pre><code>${escapeHtml(frontmatter)}</code></pre></details>` : ""}${content}</main>
</body>
</html>`;
}

function extraerFrontmatter(body: string): { frontmatter: string | null; markdown: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(body);
  if (!match) return { frontmatter: null, markdown: body };
  return {
    frontmatter: match[1] ?? "",
    markdown: body.slice(match[0].length),
  };
}

function alignmentAttr(align: "left" | "center" | "right" | undefined): string {
  return align ? ` style="text-align:${align}"` : "";
}

function safeUrl(value: string, image: boolean): string | null {
  const url = value.trim();
  if (!url || /[\u0000-\u001f\u007f]/.test(url)) return null;
  if (url.startsWith("#") || url.startsWith("/") || url.startsWith("./") || url.startsWith("../")) return url;
  if (/^https?:\/\//i.test(url)) return url;
  if (!image && /^mailto:/i.test(url)) return url;
  return /^[^:/?#]+(?:[/?#]|$)/.test(url) ? url : null;
}

function normalizarHeading(value: string): string {
  return textoHtml(value)
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[`*_~]/g, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9§]+/g, " ")
    .trim()
    .toLocaleLowerCase("es");
}

function textoHtml(value: string): string {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(value: string): string {
  return escapeHtml(value).replace(/'/g, "&#39;");
}
