"use client";

import { memo, type ComponentType } from "react";
import type { Editor } from "@tiptap/core";
import { useEditorState } from "@tiptap/react";
import {
  AlignCenter, AlignJustify, AlignLeft, AlignRight, Bold, Code, FileCode2,
  Braces, CodeXml, Highlighter, ImagePlus, Italic, Link2, List, ListChecks, ListOrdered,
  Minus, Pilcrow, Quote, Redo2, Strikethrough, Table2, Underline, Undo2,
  Video,
} from "lucide-react";
import { TableMenu } from "./TableMenu";

interface ToolButtonProps {
  label: string;
  icon: ComponentType<{ size?: number }>;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export const ToolButton = memo(function ToolButton({
  label,
  icon: Icon,
  active,
  disabled,
  onClick,
}: ToolButtonProps) {
  return (
    <button
      type="button"
      className={active ? "is-active" : ""}
      disabled={disabled}
      aria-label={label}
      title={label}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
    >
      <Icon size={17} />
    </button>
  );
});

interface ToolbarProps {
  editor: Editor;
  onLink: () => void;
  onImage: () => void;
  onVideo: () => void;
}

export const Toolbar = memo(function Toolbar({ editor, onLink, onImage, onVideo }: ToolbarProps) {
  const state = useEditorState({
    editor,
    selector: ({ editor: current }) => ({
      bold: current.isActive("bold"),
      italic: current.isActive("italic"),
      underline: current.isActive("underline"),
      strike: current.isActive("strike"),
      highlight: current.isActive("highlight"),
      bulletList: current.isActive("bulletList"),
      orderedList: current.isActive("orderedList"),
      taskList: current.isActive("taskList"),
      blockquote: current.isActive("blockquote"),
      code: current.isActive("code"),
      codeBlock: current.isActive("codeBlock"),
      link: current.isActive("link"),
      align: ["center", "right", "justify"].find((align) => current.isActive({ textAlign: align })) ?? "left",
      heading: ([1, 2, 3, 4] as const).find((level) => current.isActive("heading", { level })) ?? 0,
      canUndo: current.can().undo(),
      canRedo: current.can().redo(),
      table: current.isActive("table"),
    }),
  });

  return (
    <div className="editor-toolbar-wrap">
      <div className="editor-toolbar" role="toolbar" aria-label="Форматирование статьи">
        <select
          aria-label="Стиль текста"
          value={state.heading ? `h${state.heading}` : "p"}
          onChange={(event) => {
            const value = event.target.value;
            if (value === "p") editor.chain().focus().setParagraph().run();
            else editor.chain().focus().setHeading({ level: Number(value.slice(1)) as 1 | 2 | 3 | 4 }).run();
          }}
        >
          <option value="p">Текст</option>
          <option value="h1">Заголовок 1</option>
          <option value="h2">Заголовок 2</option>
          <option value="h3">Заголовок 3</option>
          <option value="h4">Заголовок 4</option>
        </select>
        <span className="editor-toolbar__separator" />
        <ToolButton label="Обычный текст" icon={Pilcrow} onClick={() => editor.chain().focus().setParagraph().run()} />
        <ToolButton label="Жирный (Ctrl+B)" icon={Bold} active={state.bold} onClick={() => editor.chain().focus().toggleBold().run()} />
        <ToolButton label="Курсив (Ctrl+I)" icon={Italic} active={state.italic} onClick={() => editor.chain().focus().toggleItalic().run()} />
        <ToolButton label="Подчёркивание" icon={Underline} active={state.underline} onClick={() => editor.chain().focus().toggleUnderline().run()} />
        <ToolButton label="Зачёркивание" icon={Strikethrough} active={state.strike} onClick={() => editor.chain().focus().toggleStrike().run()} />
        <ToolButton label="Маркер" icon={Highlighter} active={state.highlight} onClick={() => editor.chain().focus().toggleHighlight({ color: "#713f12" }).run()} />
        <label className="editor-color" title="Цвет текста">
          A
          <input type="color" defaultValue="#fda4af" onChange={(e) => editor.chain().focus().setColor(e.target.value).run()} />
        </label>
        <label className="editor-color editor-color--background" title="Цвет фона текста">
          A
          <input type="color" defaultValue="#713f12" onChange={(e) => editor.chain().focus().setBackgroundColor(e.target.value).run()} />
        </label>
        <span className="editor-toolbar__separator" />
        <ToolButton label="Маркированный список" icon={List} active={state.bulletList} onClick={() => editor.chain().focus().toggleBulletList().run()} />
        <ToolButton label="Нумерованный список" icon={ListOrdered} active={state.orderedList} onClick={() => editor.chain().focus().toggleOrderedList().run()} />
        <ToolButton label="Список задач" icon={ListChecks} active={state.taskList} onClick={() => editor.chain().focus().toggleTaskList().run()} />
        <ToolButton label="Цитата" icon={Quote} active={state.blockquote} onClick={() => editor.chain().focus().toggleBlockquote().run()} />
        <ToolButton label="Код" icon={Code} active={state.code} onClick={() => editor.chain().focus().toggleCode().run()} />
        <ToolButton label="Блок кода" icon={FileCode2} active={state.codeBlock} onClick={() => editor.chain().focus().toggleCodeBlock().run()} />
        <ToolButton label="Ссылка" icon={Link2} active={state.link} onClick={onLink} />
        <span className="editor-toolbar__separator" />
        <ToolButton label="По левому краю" icon={AlignLeft} active={state.align === "left"} onClick={() => editor.chain().focus().setTextAlign("left").run()} />
        <ToolButton label="По центру" icon={AlignCenter} active={state.align === "center"} onClick={() => editor.chain().focus().setTextAlign("center").run()} />
        <ToolButton label="По правому краю" icon={AlignRight} active={state.align === "right"} onClick={() => editor.chain().focus().setTextAlign("right").run()} />
        <ToolButton label="По ширине" icon={AlignJustify} active={state.align === "justify"} onClick={() => editor.chain().focus().setTextAlign("justify").run()} />
        <span className="editor-toolbar__separator" />
        <ToolButton label="Изображение" icon={ImagePlus} onClick={onImage} />
        <ToolButton label="Видео" icon={Video} onClick={onVideo} />
        <ToolButton
          label="Таблица"
          icon={Table2}
          active={state.table}
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
        />
        <ToolButton label="Разделитель" icon={Minus} onClick={() => editor.chain().focus().setHorizontalRule().run()} />
        <span className="editor-toolbar__separator" />
        <ToolButton label="Отменить (Ctrl+Z)" icon={Undo2} disabled={!state.canUndo} onClick={() => editor.chain().focus().undo().run()} />
        <ToolButton label="Повторить (Ctrl+Shift+Z)" icon={Redo2} disabled={!state.canRedo} onClick={() => editor.chain().focus().redo().run()} />
        <span className="editor-toolbar__separator" />
        <ToolButton
          label="Копировать JSON"
          icon={Braces}
          onClick={() => void navigator.clipboard.writeText(JSON.stringify(editor.getJSON(), null, 2))}
        />
        <ToolButton
          label="Копировать HTML"
          icon={CodeXml}
          onClick={() => void navigator.clipboard.writeText(editor.getHTML())}
        />
      </div>
      <TableMenu editor={editor} />
    </div>
  );
});
