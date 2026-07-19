import { mergeAttributes, Node } from "@tiptap/core";

function getVimeoId(value: string): string | null {
  try {
    const url = new URL(value);
    if (!["vimeo.com", "www.vimeo.com", "player.vimeo.com"].includes(url.hostname)) return null;
    return url.pathname.split("/").filter(Boolean).findLast((part) => /^\d+$/.test(part)) ?? null;
  } catch {
    return /^\d+$/.test(value) ? value : null;
  }
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    vimeo: {
      setVimeoVideo: (options: { src: string }) => ReturnType;
    };
  }
}

export const Vimeo = Node.create({
  name: "vimeo",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return { src: { default: null } };
  },

  parseHTML() {
    return [{ tag: 'div[data-vimeo-video] iframe[src*="vimeo.com"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    const id = getVimeoId(String(HTMLAttributes.src ?? ""));
    if (!id) return ["div", { "data-vimeo-video": "" }];
    return [
      "div",
      mergeAttributes({ "data-vimeo-video": "", class: "video-embed" }),
      [
        "iframe",
        {
          src: `https://player.vimeo.com/video/${id}`,
          title: "Vimeo video",
          loading: "lazy",
          allow: "autoplay; fullscreen; picture-in-picture",
          allowfullscreen: "true",
          frameborder: "0",
        },
      ],
    ];
  },

  addCommands() {
    return {
      setVimeoVideo:
        ({ src }) =>
        ({ commands }) => {
          const id = getVimeoId(src);
          return id ? commands.insertContent({ type: this.name, attrs: { src: id } }) : false;
        },
    };
  },
});

export function isVimeoUrl(value: string): boolean {
  return getVimeoId(value) !== null;
}
