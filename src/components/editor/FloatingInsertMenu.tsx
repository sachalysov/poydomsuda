"use client";

import { memo, useState } from "react";
import type { Editor } from "@tiptap/core";
import { FloatingMenu } from "@tiptap/react/menus";
import { Code2, ImagePlus, List, Minus, Plus, Quote, Table2, Video } from "lucide-react";

interface FloatingInsertMenuProps {
  editor: Editor;
  onImage: () => void;
  onVideo: () => void;
}

export const FloatingInsertMenu = memo(function FloatingInsertMenu({
  editor,
  onImage,
  onVideo,
}: FloatingInsertMenuProps) {
  const [open, setOpen] = useState(false);
  const items = [
    ["Изображение", ImagePlus, onImage],
    ["Видео", Video, onVideo],
    ["Таблица", Table2, () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()],
    ["Цитата", Quote, () => editor.chain().focus().toggleBlockquote().run()],
    ["Список", List, () => editor.chain().focus().toggleBulletList().run()],
    ["Код", Code2, () => editor.chain().focus().toggleCodeBlock().run()],
    ["Разделитель", Minus, () => editor.chain().focus().setHorizontalRule().run()],
  ] as const;

  return (
    <FloatingMenu
      editor={editor}
      options={{ placement: "left-start", offset: 10 }}
      shouldShow={({ editor: current, state }) => {
        const { $from } = state.selection;
        return current.isEditable && $from.parent.type.name === "paragraph" && $from.parent.content.size === 0;
      }}
    >
      <div className="editor-floating">
        <button
          type="button"
          className={`editor-floating__plus ${open ? "is-open" : ""}`}
          aria-label="Добавить блок"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => setOpen((value) => !value)}
        >
          <Plus size={19} />
        </button>
        {open && (
          <div className="editor-floating__menu">
            {items.map(([label, Icon, action]) => (
              <button
                key={label}
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  action();
                  setOpen(false);
                }}
              >
                <Icon size={17} />
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </FloatingMenu>
  );
});
