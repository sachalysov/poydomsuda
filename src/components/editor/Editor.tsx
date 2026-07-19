"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";
import type { JSONContent } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";
import { createEditorExtensions } from "./extensions";
import { isVimeoUrl } from "./extensions/Vimeo";
import { FloatingInsertMenu } from "./FloatingInsertMenu";
import { ImageUpload } from "./ImageUpload";
import { LinkDialog } from "./LinkDialog";
import { MenuBubble } from "./MenuBubble";
import { Toolbar } from "./Toolbar";
import { VideoDialog } from "./VideoDialog";
import { useImageUpload } from "./hooks/useImageUpload";
import type { EditorValue } from "./types";
import "./editor.css";

interface ArticleEditorProps {
  initialContent: JSONContent | string;
  onChange: (value: EditorValue) => void;
}

function isYouTubeUrl(value: string) {
  try {
    const hostname = new URL(value).hostname.replace(/^www\./, "");
    return ["youtube.com", "youtu.be", "youtube-nocookie.com"].includes(hostname);
  } catch {
    return false;
  }
}

export default memo(function ArticleEditor({ initialContent, onChange }: ArticleEditorProps) {
  const onChangeRef = useRef(onChange);
  const [dialog, setDialog] = useState<"image" | "video" | "link" | null>(null);
  const { uploadImage, uploading, error, clearError } = useImageUpload();
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const extensions = useMemo(() => createEditorExtensions(uploadImage), [uploadImage]);
  const editor = useEditor(
    {
      extensions,
      content: initialContent,
      immediatelyRender: false,
      shouldRerenderOnTransaction: false,
      editorProps: {
        attributes: {
          class: "article-editor__content",
          spellcheck: "true",
          autocomplete: "off",
          "aria-label": "Текст статьи",
        },
      },
      onUpdate: ({ editor: current }) => {
        onChangeRef.current({ json: current.getJSON(), html: current.getHTML() });
      },
      onCreate: ({ editor: current }) => {
        if (typeof initialContent === "string" && initialContent !== "<p></p>") {
          onChangeRef.current({ json: current.getJSON(), html: current.getHTML() });
        }
      },
    },
    [extensions]
  );

  if (!editor) {
    return <div className="article-editor article-editor--loading">Загрузка редактора…</div>;
  }

  const insertImage = (src: string, alt: string) => {
    editor.chain().focus().insertContent({
      type: "richImage",
      attrs: { src, alt, caption: "", align: "center", width: 100 },
    }).run();
    setDialog(null);
  };

  return (
    <div className="article-editor">
      <Toolbar
        editor={editor}
        onLink={() => setDialog("link")}
        onImage={() => {
          clearError();
          setDialog("image");
        }}
        onVideo={() => setDialog("video")}
      />
      <div className="article-editor__paper">
        <EditorContent editor={editor} />
        <MenuBubble editor={editor} onLink={() => setDialog("link")} />
        <FloatingInsertMenu
          editor={editor}
          onImage={() => setDialog("image")}
          onVideo={() => setDialog("video")}
        />
      </div>
      <ImageUpload
        open={dialog === "image"}
        uploading={uploading}
        error={error}
        onClose={() => setDialog(null)}
        onFile={async (file) => {
          const uploaded = await uploadImage(file);
          if (uploaded) insertImage(uploaded.src, uploaded.alt);
        }}
        onUrl={insertImage}
      />
      <VideoDialog
        open={dialog === "video"}
        onClose={() => setDialog(null)}
        onInsert={(url) => {
          if (isVimeoUrl(url)) return editor.chain().focus().setVimeoVideo({ src: url }).run();
          if (isYouTubeUrl(url)) return editor.commands.setYoutubeVideo({ src: url });
          return false;
        }}
      />
      <LinkDialog editor={editor} open={dialog === "link"} onClose={() => setDialog(null)} />
    </div>
  );
});
