"use client";

import { memo } from "react";
import type { Editor } from "@tiptap/core";
import { useEditorState } from "@tiptap/react";
import {
  BetweenHorizontalStart,
  BetweenVerticalStart,
  Columns3,
  Rows3,
  Trash2,
} from "lucide-react";

export const TableMenu = memo(function TableMenu({ editor }: { editor: Editor }) {
  const isTableActive = useEditorState({
    editor,
    selector: ({ editor: current }) => current.isActive("table"),
  });
  if (!isTableActive) return null;
  const actions = [
    ["Строка сверху", BetweenHorizontalStart, () => editor.chain().focus().addRowBefore().run()],
    ["Строка снизу", Rows3, () => editor.chain().focus().addRowAfter().run()],
    ["Удалить строку", Trash2, () => editor.chain().focus().deleteRow().run()],
    ["Колонка слева", BetweenVerticalStart, () => editor.chain().focus().addColumnBefore().run()],
    ["Колонка справа", Columns3, () => editor.chain().focus().addColumnAfter().run()],
    ["Удалить колонку", Trash2, () => editor.chain().focus().deleteColumn().run()],
    ["Удалить таблицу", Trash2, () => editor.chain().focus().deleteTable().run()],
  ] as const;

  return (
    <div className="editor-table-menu">
      {actions.map(([label, Icon, action]) => (
        <button key={label} type="button" onMouseDown={(e) => e.preventDefault()} onClick={action} title={label}>
          <Icon size={15} />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
});
