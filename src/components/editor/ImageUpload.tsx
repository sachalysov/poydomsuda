"use client";

import { useRef, useState } from "react";
import { ImagePlus, Link as LinkIcon, Upload } from "lucide-react";
import { Dialog } from "./Dialog";

interface ImageUploadProps {
  open: boolean;
  uploading: boolean;
  error: string | null;
  onClose: () => void;
  onFile: (file: File) => Promise<void>;
  onUrl: (url: string, alt: string) => void;
}

export function ImageUpload({
  open,
  uploading,
  error,
  onClose,
  onFile,
  onUrl,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");

  return (
    <Dialog title="Добавить изображение" open={open} onClose={onClose}>
      <div className="editor-dialog__body">
        <button
          type="button"
          className="editor-upload-button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          <Upload size={20} />
          {uploading ? "Загрузка…" : "Загрузить с устройства"}
        </button>
        <input
          ref={inputRef}
          type="file"
          hidden
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (file) await onFile(file);
            event.target.value = "";
          }}
        />
        <div className="editor-dialog__separator"><span>или по ссылке</span></div>
        <label>
          URL
          <div className="editor-input-with-icon">
            <LinkIcon size={16} />
            <input value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://..." />
          </div>
        </label>
        <label>
          Alt-текст
          <input value={alt} onChange={(event) => setAlt(event.target.value)} placeholder="Что изображено" />
        </label>
        {error && <p className="editor-dialog__error">{error}</p>}
        <button
          type="button"
          className="editor-dialog__primary"
          disabled={!/^https?:\/\//i.test(url)}
          onClick={() => {
            onUrl(url, alt);
            setUrl("");
            setAlt("");
          }}
        >
          <ImagePlus size={17} /> Вставить
        </button>
      </div>
    </Dialog>
  );
}
