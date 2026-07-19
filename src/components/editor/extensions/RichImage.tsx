"use client";

import { memo, useCallback, useRef } from "react";
import Image from "@tiptap/extension-image";
import { mergeAttributes } from "@tiptap/core";
import {
  NodeViewWrapper,
  ReactNodeViewRenderer,
  type NodeViewProps,
} from "@tiptap/react";
import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";

export interface RichImageAttributes {
  src: string;
  alt: string;
  caption: string;
  align: "left" | "center" | "right";
  width: number;
}

const RichImageView = memo(function RichImageView({
  node,
  selected,
  updateAttributes,
}: NodeViewProps) {
  const figureRef = useRef<HTMLElement>(null);
  const attrs = node.attrs as RichImageAttributes;

  const startResize = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      const parentWidth = figureRef.current?.parentElement?.clientWidth ?? 1;
      const startX = event.clientX;
      const startWidth = attrs.width;

      const onMove = (moveEvent: PointerEvent) => {
        const deltaPercent = ((moveEvent.clientX - startX) / parentWidth) * 100;
        updateAttributes({ width: Math.max(20, Math.min(100, Math.round(startWidth + deltaPercent))) });
      };
      const onUp = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [attrs.width, updateAttributes]
  );

  return (
    <NodeViewWrapper
      as="figure"
      ref={figureRef}
      className={`rich-image rich-image--${attrs.align} ${selected ? "is-selected" : ""}`}
      style={{ width: `${attrs.width}%` }}
      data-type="rich-image"
      data-align={attrs.align}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={attrs.src} alt={attrs.alt} title={attrs.caption || undefined} loading="lazy" draggable={false} />
      {attrs.caption && <figcaption>{attrs.caption}</figcaption>}
      {selected && (
        <div className="rich-image__controls" contentEditable={false}>
          <div className="rich-image__align">
            {([
              ["left", AlignLeft],
              ["center", AlignCenter],
              ["right", AlignRight],
            ] as const).map(([align, Icon]) => (
              <button
                key={align}
                type="button"
                className={attrs.align === align ? "is-active" : ""}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => updateAttributes({ align })}
                aria-label={`Выровнять ${align}`}
              >
                <Icon size={15} />
              </button>
            ))}
          </div>
          <label>
            Alt
            <input
              value={attrs.alt}
              onChange={(event) => updateAttributes({ alt: event.target.value })}
              placeholder="Описание изображения"
            />
          </label>
          <label>
            Подпись
            <input
              value={attrs.caption}
              onChange={(event) => updateAttributes({ caption: event.target.value })}
              placeholder="Подпись"
            />
          </label>
        </div>
      )}
      {selected && (
        <button
          type="button"
          className="rich-image__resize"
          contentEditable={false}
          onPointerDown={startResize}
          aria-label="Изменить размер изображения"
        />
      )}
    </NodeViewWrapper>
  );
});

export const RichImage = Image.extend({
  name: "richImage",

  addAttributes() {
    return {
      ...this.parent?.(),
      alt: { default: "" },
      caption: {
        default: "",
        parseHTML: (element) => element.closest("figure")?.querySelector("figcaption")?.textContent ?? "",
      },
      align: {
        default: "center",
        parseHTML: (element) => element.closest("figure")?.getAttribute("data-align") ?? "center",
      },
      width: {
        default: 100,
        parseHTML: (element) => {
          const value = element.closest("figure")?.getAttribute("data-width");
          return value ? Number(value) : 100;
        },
      },
    };
  },

  parseHTML() {
    return [
      { tag: 'figure[data-type="rich-image"] img' },
      { tag: "img[src]" },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { caption, align, width, ...imageAttributes } = HTMLAttributes;
    const figureAttributes = {
      "data-type": "rich-image",
      "data-align": align,
      "data-width": String(width),
      class: `rich-image rich-image--${align}`,
      style: `width: ${width}%`,
    };
    const image = [
      "img",
      mergeAttributes(this.options.HTMLAttributes, imageAttributes, {
        loading: "lazy",
        alt: imageAttributes.alt || "",
      }),
    ];
    return caption
      ? ["figure", figureAttributes, image, ["figcaption", {}, caption]]
      : ["figure", figureAttributes, image];
  },

  addNodeView() {
    return ReactNodeViewRenderer(RichImageView);
  },
});
