"use client";

import { useState } from "react";
import { Video } from "lucide-react";
import { Dialog } from "./Dialog";

interface VideoDialogProps {
  open: boolean;
  onClose: () => void;
  onInsert: (url: string) => boolean;
}

export function VideoDialog({ open, onClose, onInsert }: VideoDialogProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  return (
    <Dialog title="Вставить видео" open={open} onClose={onClose}>
      <div className="editor-dialog__body">
        <label>
          Ссылка YouTube или Vimeo
          <input
            value={url}
            onChange={(event) => {
              setUrl(event.target.value);
              setError("");
            }}
            placeholder="https://youtube.com/watch?v=…"
            autoFocus
          />
        </label>
        {error && <p className="editor-dialog__error">{error}</p>}
        <button
          type="button"
          className="editor-dialog__primary"
          disabled={!url.trim()}
          onClick={() => {
            if (!onInsert(url.trim())) {
              setError("Укажите корректную ссылку YouTube или Vimeo.");
              return;
            }
            setUrl("");
            onClose();
          }}
        >
          <Video size={17} /> Вставить видео
        </button>
      </div>
    </Dialog>
  );
}
