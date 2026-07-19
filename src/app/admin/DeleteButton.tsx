"use client";

import { useTransition } from "react";

interface DeleteButtonProps {
  postTitle: string;
  action: () => Promise<void>;
}

export default function DeleteButton({ postTitle, action }: DeleteButtonProps) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (window.confirm(`Удалить статью «${postTitle}»? Это действие нельзя отменить.`)) {
          startTransition(() => {
            void action();
          });
        }
      }}
      className="text-sm bg-[#160A0D] border border-[#3D1820] hover:border-red-500/40 text-[#C8828A] hover:text-red-400 rounded-full px-4 py-2 transition-colors disabled:opacity-60"
    >
      {pending ? "Удаление…" : "Удалить"}
    </button>
  );
}
