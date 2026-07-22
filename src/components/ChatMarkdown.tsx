"use client";

import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

const components: Components = {
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-text-head">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  ul: ({ children }) => <ul className="mb-2 last:mb-0 list-disc space-y-1 pl-5">{children}</ul>,
  ol: ({ children }) => <ol className="mb-2 last:mb-0 list-decimal space-y-1 pl-5">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline underline-offset-2 text-rose-700 dark:text-rose-300 hover:text-rose-500"
    >
      {children}
    </a>
  ),
  h1: ({ children }) => (
    <h3 className="mb-2 text-base font-semibold text-text-head">{children}</h3>
  ),
  h2: ({ children }) => (
    <h3 className="mb-2 text-base font-semibold text-text-head">{children}</h3>
  ),
  h3: ({ children }) => (
    <h4 className="mb-1.5 text-sm font-semibold text-text-head">{children}</h4>
  ),
  h4: ({ children }) => (
    <h4 className="mb-1.5 text-sm font-semibold text-text-head">{children}</h4>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mb-2 last:mb-0 border-l-2 border-rose-500/40 pl-3 text-text-soft italic">
      {children}
    </blockquote>
  ),
  code: ({ className, children }) => {
    const isBlock = Boolean(className);
    if (isBlock) {
      return <code className={className}>{children}</code>;
    }
    return (
      <code className="rounded bg-[var(--code-bg)] px-1.5 py-0.5 text-[0.85em] text-[var(--code-text)]">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="mb-2 last:mb-0 overflow-x-auto rounded-lg bg-[var(--pre-bg)] border border-border p-3 text-xs text-[var(--code-text)]">
      {children}
    </pre>
  ),
  hr: () => <hr className="my-3 border-border" />,
  table: ({ children }) => (
    <div className="mb-2 last:mb-0 overflow-x-auto">
      <table className="w-full min-w-[240px] border-collapse text-left text-xs">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="border-b border-border">{children}</thead>,
  th: ({ children }) => (
    <th className="px-2 py-1.5 font-semibold text-text-head">{children}</th>
  ),
  td: ({ children }) => <td className="border-t border-border/60 px-2 py-1.5">{children}</td>,
};

function normalizeMarkdown(content: string): string {
  return content
    .replace(/\r\n/g, "\n")
    // n8n sometimes returns literal "\n" instead of real newlines
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t");
}

export default function ChatMarkdown({ content }: { content: string }) {
  const markdown = normalizeMarkdown(content);

  return (
    <div className="chat-md break-words">
      <Markdown remarkPlugins={[remarkGfm]} components={components}>
        {markdown}
      </Markdown>
    </div>
  );
}
