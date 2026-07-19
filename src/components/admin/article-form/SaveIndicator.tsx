"use client";

import { memo } from "react";
import { AlertCircle, Check, LoaderCircle } from "lucide-react";
import type { SaveStatus } from "@/components/editor/types";

export const SaveIndicator = memo(function SaveIndicator({
  status,
  error,
  savedAt,
}: {
  status: SaveStatus;
  error: string | null;
  savedAt: string | null;
}) {
  if (status === "saving") return <span className="save-status is-saving"><LoaderCircle size={15} className="animate-spin" /> Сохранение…</span>;
  if (status === "error") return <span className="save-status is-error" title={error ?? undefined}><AlertCircle size={15} /> Ошибка</span>;
  if (status === "saved") {
    const time = savedAt ? new Date(savedAt).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }) : "";
    return <span className="save-status is-saved"><Check size={15} /> Сохранено {time}</span>;
  }
  return <span className="save-status">Автосохранение включено</span>;
});
