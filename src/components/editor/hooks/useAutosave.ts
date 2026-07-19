"use client";

import { useEffect, useRef, useState } from "react";
import { saveArticle } from "@/app/admin/actions";
import type { ArticleEditorData } from "@/lib/article-types";
import type { SaveStatus } from "../types";

interface UseAutosaveOptions {
  article: ArticleEditorData;
  revision: number;
  onCreated: (id: string, slug: string) => void;
}

export function useAutosave({ article, revision, onCreated }: UseAutosaveOptions) {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const requestRef = useRef(0);
  const articleRef = useRef(article);
  const onCreatedRef = useRef(onCreated);

  articleRef.current = article;
  onCreatedRef.current = onCreated;

  useEffect(() => {
    if (revision === 0) return;
    const revisionAtSchedule = revision;
    const timeout = window.setTimeout(async () => {
      const request = ++requestRef.current;
      setStatus("saving");
      setError(null);
      const result = await saveArticle(articleRef.current);
      if (request !== requestRef.current) return;
      if (!result.ok) {
        setStatus("error");
        setError(result.error ?? "Не удалось сохранить статью.");
        return;
      }
      if (!articleRef.current.id && result.id && result.slug) {
        onCreatedRef.current(result.id, result.slug);
      }
      if (revisionAtSchedule === revision) {
        setStatus("saved");
        setSavedAt(result.savedAt ?? new Date().toISOString());
      }
    }, 2000);

    return () => window.clearTimeout(timeout);
  }, [revision]);

  const saveNow = async () => {
    const request = ++requestRef.current;
    setStatus("saving");
    setError(null);
    const result = await saveArticle(articleRef.current);
    if (request !== requestRef.current) return result;
    if (!result.ok) {
      setStatus("error");
      setError(result.error ?? "Не удалось сохранить статью.");
    } else {
      if (!articleRef.current.id && result.id && result.slug) onCreatedRef.current(result.id, result.slug);
      setStatus("saved");
      setSavedAt(result.savedAt ?? new Date().toISOString());
    }
    return result;
  };

  return { status, error, savedAt, saveNow };
}
