import type { JSONContent } from "@tiptap/core";

export interface EditorValue {
  json: JSONContent;
  html: string;
}

export type SaveStatus = "idle" | "saving" | "saved" | "error";

export interface UploadedImage {
  src: string;
  alt: string;
  caption?: string;
}
