"use client";

import { useMemo } from "react";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

marked.setOptions({
  gfm: true,
  breaks: true,
});

function normalizeMarkdown(content: string): string {
  let text = content.trim();

  // Unwrap accidental JSON string payloads from n8n
  if (
    (text.startsWith('"') && text.endsWith('"')) ||
    (text.startsWith("'") && text.endsWith("'"))
  ) {
    try {
      const unwrapped = JSON.parse(text.startsWith("'") ? `"${text.slice(1, -1)}"` : text);
      if (typeof unwrapped === "string") text = unwrapped;
    } catch {
      /* keep original */
    }
  }

  return text
    .replace(/\r\n/g, "\n")
    // n8n / LLM sometimes returns literal escape sequences
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t")
    .replace(/\\"/g, '"')
    // Unicode lookalike asterisks/underscores some models emit
    .replace(/[＊✱∗]/g, "*")
    .replace(/[＿]/g, "_");
}

function markdownToSafeHtml(markdown: string): string {
  const html = marked.parse(normalizeMarkdown(markdown), { async: false }) as string;

  return sanitizeHtml(html, {
    allowedTags: [
      "p",
      "br",
      "h1",
      "h2",
      "h3",
      "h4",
      "strong",
      "em",
      "del",
      "ul",
      "ol",
      "li",
      "blockquote",
      "code",
      "pre",
      "hr",
      "a",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
    ],
    allowedAttributes: {
      a: ["href", "name", "target", "rel"],
      code: ["class"],
      th: ["align"],
      td: ["align"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        target: "_blank",
        rel: "noopener noreferrer",
      }),
      h1: "h3",
      h2: "h3",
    },
  });
}

export default function ChatMarkdown({ content }: { content: string }) {
  const html = useMemo(() => markdownToSafeHtml(content), [content]);

  return (
    <div
      className="chat-md break-words
        [&_p]:mb-2 [&_p:last-child]:mb-0
        [&_strong]:font-semibold [&_strong]:text-text-head
        [&_em]:italic
        [&_ul]:mb-2 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_ul:last-child]:mb-0
        [&_ol]:mb-2 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5 [&_ol:last-child]:mb-0
        [&_li]:leading-relaxed
        [&_a]:underline [&_a]:underline-offset-2 [&_a]:text-rose-700 dark:[&_a]:text-rose-300 hover:[&_a]:text-rose-500
        [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-text-head
        [&_h4]:mb-1.5 [&_h4]:text-sm [&_h4]:font-semibold [&_h4]:text-text-head
        [&_blockquote]:mb-2 [&_blockquote]:border-l-2 [&_blockquote]:border-rose-500/40 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-text-soft [&_blockquote:last-child]:mb-0
        [&_code]:rounded [&_code]:bg-[var(--code-bg)] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[0.85em] [&_code]:text-[var(--code-text)]
        [&_pre]:mb-2 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-border [&_pre]:bg-[var(--pre-bg)] [&_pre]:p-3 [&_pre]:text-xs [&_pre]:text-[var(--code-text)] [&_pre:last-child]:mb-0
        [&_pre_code]:bg-transparent [&_pre_code]:p-0
        [&_hr]:my-3 [&_hr]:border-border
        [&_table]:mb-2 [&_table]:w-full [&_table]:min-w-[240px] [&_table]:border-collapse [&_table]:text-left [&_table]:text-xs
        [&_th]:px-2 [&_th]:py-1.5 [&_th]:font-semibold [&_th]:text-text-head
        [&_td]:border-t [&_td]:border-border/60 [&_td]:px-2 [&_td]:py-1.5"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
