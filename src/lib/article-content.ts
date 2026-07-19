import type { JSONContent } from "@tiptap/core";
import sanitizeHtml from "sanitize-html";

export const EMPTY_DOCUMENT: JSONContent = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

function inlineMarkdown(value: string): string {
  return escapeHtml(value)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\[(.+?)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2">$1</a>');
}

export function legacyMarkdownToHtml(markdown: string): string {
  const output: string[] = [];
  let listOpen = false;

  const closeList = () => {
    if (listOpen) {
      output.push("</ul>");
      listOpen = false;
    }
  };

  for (const rawLine of markdown.split("\n")) {
    const line = rawLine.trim();
    if (!line) {
      closeList();
      continue;
    }
    if (line.startsWith("### ")) {
      closeList();
      output.push(`<h3>${inlineMarkdown(line.slice(4))}</h3>`);
    } else if (line.startsWith("## ")) {
      closeList();
      output.push(`<h2>${inlineMarkdown(line.slice(3))}</h2>`);
    } else if (line === "---") {
      closeList();
      output.push("<hr>");
    } else if (line.startsWith("- ")) {
      if (!listOpen) {
        output.push("<ul>");
        listOpen = true;
      }
      output.push(`<li><p>${inlineMarkdown(line.slice(2))}</p></li>`);
    } else {
      closeList();
      output.push(`<p>${inlineMarkdown(line)}</p>`);
    }
  }
  closeList();
  return output.join("");
}

export function sanitizeArticleHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      "p", "h1", "h2", "h3", "h4", "strong", "em", "u", "s", "mark",
      "span", "ul", "ol", "li", "blockquote", "code", "pre", "hr", "a",
      "table", "thead", "tbody", "tr", "th", "td", "figure", "figcaption",
      "img", "iframe", "br", "div",
    ],
    allowedAttributes: {
      "*": ["class", "data-type", "data-checked", "style"],
      a: ["href", "target", "rel"],
      img: ["src", "alt", "title", "loading", "width", "height"],
      iframe: [
        "src", "width", "height", "allow", "allowfullscreen", "frameborder",
        "title", "loading",
      ],
      td: ["colspan", "rowspan", "colwidth"],
      th: ["colspan", "rowspan", "colwidth"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedIframeHostnames: [
      "www.youtube.com",
      "youtube.com",
      "www.youtube-nocookie.com",
      "player.vimeo.com",
    ],
    allowedStyles: {
      "*": {
        color: [/^#[0-9a-f]{3,8}$/i, /^rgb/],
        "background-color": [/^#[0-9a-f]{3,8}$/i, /^rgb/],
        "text-align": [/^(left|center|right|justify)$/],
        width: [/^\d{1,3}%$/, /^\d{1,4}px$/],
      },
    },
    transformTags: {
      a: (_tagName, attribs) => ({
        tagName: "a",
        attribs: {
          ...attribs,
          target: attribs.target === "_blank" ? "_blank" : "_self",
          rel: "noopener noreferrer",
        },
      }),
      img: (_tagName, attribs) => ({
        tagName: "img",
        attribs: { ...attribs, loading: "lazy", alt: attribs.alt || "" },
      }),
      iframe: (_tagName, attribs) => ({
        tagName: "iframe",
        attribs: { ...attribs, loading: "lazy", title: attribs.title || "Видео" },
      }),
    },
  });
}

export function resolveArticleHtml(contentHtml: string | null, legacy: string): string {
  return sanitizeArticleHtml(contentHtml || legacyMarkdownToHtml(legacy));
}

function collectText(node: JSONContent | undefined): string[] {
  if (!node) return [];
  const own = typeof node.text === "string" ? [node.text] : [];
  return [...own, ...(node.content ?? []).flatMap(collectText)];
}

export function calculateReadTime(content: JSONContent): string {
  const words = collectText(content).join(" ").trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} мин`;
}
