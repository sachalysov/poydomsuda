"use client";

import { memo, useRef } from "react";
import { ImagePlus, LoaderCircle, Trash2 } from "lucide-react";
import { useImageUpload } from "@/components/editor/hooks/useImageUpload";

export const CoverUploader = memo(function CoverUploader({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { uploadImage, uploading, error } = useImageUpload();

  return (
    <div className="article-cover">
      {value ? (
        <div className="article-cover__preview">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Обложка статьи" />
          <button type="button" onClick={() => onChange("")} aria-label="Удалить обложку">
            <Trash2 size={17} /> Удалить
          </button>
        </div>
      ) : (
        <button type="button" className="article-cover__upload" onClick={() => inputRef.current?.click()} disabled={uploading}>
          {uploading ? <LoaderCircle className="animate-spin" size={22} /> : <ImagePlus size={22} />}
          <span>{uploading ? "Загружаем…" : "Загрузить обложку"}</span>
          <small>JPEG, PNG, WebP или GIF · до 10 МБ</small>
        </button>
      )}
      <input
        ref={inputRef}
        hidden
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={async (event) => {
          const file = event.target.files?.[0];
          if (file) {
            const uploaded = await uploadImage(file);
            if (uploaded) onChange(uploaded.src);
          }
          event.target.value = "";
        }}
      />
      <input
        type="url"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="или вставьте URL обложки"
        aria-label="URL обложки"
      />
      {error && <p className="article-form__error">{error}</p>}
    </div>
  );
});
