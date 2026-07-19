"use client";

import { memo } from "react";
import type { Editor } from "@tiptap/core";
import { useEditorState } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import { Bold, Code, Highlighter, Italic, Link2, Quote, Underline } from "lucide-react";
import { ToolButton } from "./Toolbar";

export const MenuBubble = memo(function MenuBubble({
  editor,
  onLink,
}: {
  editor: Editor;
  onLink: () => void;
}) {
  const state = useEditorState({
    editor,
    selector: ({ editor: current }) => ({
      heading: ([1, 2, 3, 4] as const).find((level) => current.isActive("heading", { level })) ?? 0,
      bold: current.isActive("bold"),
      italic: current.isActive("italic"),
      underline: current.isActive("underline"),
      link: current.isActive("link"),
      highlight: current.isActive("highlight"),
      blockquote: current.isActive("blockquote"),
      code: current.isActive("code"),
    }),
  });
  return (
    <BubbleMenu
      editor={editor}
      options={{ placement: "top", offset: 8 }}
      shouldShow={({ from, to }) => from !== to && !editor.isActive("richImage")}
    >
      <div className="editor-bubble-menu">
        <select
          aria-label="Заголовок"
          value={state.heading}
          onChange={(event) => {
            const level = Number(event.target.value);
            if (!level) editor.chain().focus().setParagraph().run();
            else editor.chain().focus().setHeading({ level: level as 1 | 2 | 3 | 4 }).run();
          }}
        >
          <option value="0">Текст</option>
          <option value="1">H1</option>
          <option value="2">H2</option>
          <option value="3">H3</option>
          <option value="4">H4</option>
        </select>
        <ToolButton label="Жирный" icon={Bold} active={state.bold} onClick={() => editor.chain().focus().toggleBold().run()} />
        <ToolButton label="Курсив" icon={Italic} active={state.italic} onClick={() => editor.chain().focus().toggleItalic().run()} />
        <ToolButton label="Подчёркивание" icon={Underline} active={state.underline} onClick={() => editor.chain().focus().toggleUnderline().run()} />
        <ToolButton label="Ссылка" icon={Link2} active={state.link} onClick={onLink} />
        <ToolButton label="Маркер" icon={Highlighter} active={state.highlight} onClick={() => editor.chain().focus().toggleHighlight({ color: "#713f12" }).run()} />
        <ToolButton label="Цитата" icon={Quote} active={state.blockquote} onClick={() => editor.chain().focus().toggleBlockquote().run()} />
        <ToolButton label="Код" icon={Code} active={state.code} onClick={() => editor.chain().focus().toggleCode().run()} />
        <label className="editor-color" title="Цвет текста">
          A
          <input type="color" defaultValue="#fda4af" onChange={(event) => editor.chain().focus().setColor(event.target.value).run()} />
        </label>
      </div>
    </BubbleMenu>
  );
});
