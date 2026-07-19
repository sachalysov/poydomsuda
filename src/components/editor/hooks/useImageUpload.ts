"use client";

import { useCallback, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_SIZE = 10 * 1024 * 1024;

export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = useCallback(async (file: File) => {
    setError(null);
    if (!ALLOWED_TYPES.has(file.type)) {
      setError("Поддерживаются JPEG, PNG, WebP и GIF.");
      return null;
    }
    if (file.size > MAX_SIZE) {
      setError("Изображение должно быть меньше 10 МБ.");
      return null;
    }

    setUploading(true);
    try {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Сессия истекла. Войдите снова.");

      const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
      const path = `${userData.user.id}/${crypto.randomUUID()}.${extension}`;
      const { error: uploadError } = await supabase.storage
        .from("article-images")
        .upload(path, file, { cacheControl: "31536000", upsert: false, contentType: file.type });

      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from("article-images").getPublicUrl(path);
      return {
        src: data.publicUrl,
        alt: file.name.replace(/\.[^.]+$/, "").replaceAll(/[-_]+/g, " "),
      };
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Не удалось загрузить изображение.");
      return null;
    } finally {
      setUploading(false);
    }
  }, []);

  return { uploadImage, uploading, error, clearError: () => setError(null) };
}
