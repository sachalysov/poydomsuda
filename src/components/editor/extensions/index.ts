import type { Editor, Extensions } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import { TextStyleKit } from "@tiptap/extension-text-style";
import TextAlign from "@tiptap/extension-text-align";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { TableKit } from "@tiptap/extension-table";
import FileHandler from "@tiptap/extension-file-handler";
import Youtube from "@tiptap/extension-youtube";
import { RichImage } from "./RichImage";
import { Vimeo } from "./Vimeo";

const IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export function createEditorExtensions(
  uploadImage: (file: File) => Promise<{ src: string; alt: string } | null>
): Extensions {
  const insertUploadedFiles = async (
    editor: Editor,
    files: File[],
    pos?: number
  ) => {
    for (const file of files) {
      const uploaded = await uploadImage(file);
      if (!uploaded) continue;
      const node = {
        type: "richImage",
        attrs: { ...uploaded, caption: "", align: "center", width: 100 },
      };
      if (typeof pos === "number") editor.chain().focus().insertContentAt(pos, node).run();
      else editor.chain().focus().insertContent(node).run();
    }
  };

  return [
    StarterKit.configure({
      heading: { levels: [1, 2, 3, 4] },
      link: {
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      },
    }),
    Highlight.configure({ multicolor: true }),
    TextStyleKit,
    TextAlign.configure({ types: ["heading", "paragraph"], alignments: ["left", "center", "right", "justify"] }),
    TaskList,
    TaskItem.configure({ nested: true }),
    TableKit.configure({
      table: { resizable: true, lastColumnResizable: true, allowTableNodeSelection: true },
    }),
    RichImage.configure({ allowBase64: false }),
    Youtube.configure({
      controls: true,
      nocookie: true,
      modestBranding: true,
      HTMLAttributes: { class: "video-embed__iframe", loading: "lazy" },
    }),
    Vimeo,
    FileHandler.configure({
      allowedMimeTypes: IMAGE_MIME_TYPES,
      consumePasteEvent: false,
      onPaste: (editor, files) => void insertUploadedFiles(editor, files),
      onDrop: (editor, files, pos) => void insertUploadedFiles(editor, files, pos),
    }),
  ];
}
