"use client";

import { useEffect, useState } from "react";
import type { Editor } from "@tiptap/core";
import { Link2, Unlink } from "lucide-react";
import { Dialog } from "./Dialog";

interface LinkDialogProps {
  editor: Editor;
  open: boolean;
  onClose: () => void;
}

export function LinkDialog({ editor, open, onClose }: LinkDialogProps) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (open) setUrl(String(editor.getAttributes("link").href ?? ""));
  }, [editor, open]);

  return (
    <Dialog title="Ссылка" open={open} onClose={onClose}>
      <div className="editor-dialog__body">
        <label>
          URL
          <input value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://..." autoFocus />
        </label>
        <div className="editor-dialog__actions">
          <button
            type="button"
            className="editor-dialog__primary"
            disabled={!/^(https?:\/\/|mailto:)/i.test(url)}
            onClick={() => {
              editor.chain().focus().extendMarkRange("link").setLink({ href: url, target: "_blank" }).run();
              onClose();
            }}
          >
            <Link2 size={17} /> Применить
          </button>
          {editor.isActive("link") && (
            <button
              type="button"
              className="editor-dialog__secondary"
              onClick={() => {
                editor.chain().focus().unsetLink().run();
                onClose();
              }}
            >
              <Unlink size={17} /> Удалить
            </button>
          )}
        </div>
      </div>
    </Dialog>
  );
}
