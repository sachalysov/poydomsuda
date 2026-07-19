"use client";

import { type ReactNode, useEffect } from "react";
import { X } from "lucide-react";

interface DialogProps {
  title: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Dialog({ title, open, onClose, children }: DialogProps) {
  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="editor-dialog__backdrop" role="presentation" onMouseDown={onClose}>
      <div
        className="editor-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header>
          <h3>{title}</h3>
          <button type="button" onClick={onClose} aria-label="Закрыть">
            <X size={18} />
          </button>
        </header>
        {children}
      </div>
    </div>
  );
}
