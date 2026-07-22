"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function BackButton() {
  const router = useRouter();

  const handleBack = () => {
    const referrer = document.referrer;
    const sameOrigin =
      referrer !== "" && new URL(referrer).origin === window.location.origin;

    if (sameOrigin) {
      router.back();
      return;
    }
    router.push("/blog");
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className="inline-flex items-center gap-2 min-h-11 text-sm font-medium text-text-body hover:text-rose-700 dark:hover:text-rose-300 transition-colors"
    >
      <ArrowLeft className="size-4 shrink-0" aria-hidden />
      Назад
    </button>
  );
}
