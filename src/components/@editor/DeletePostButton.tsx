"use client";

import { useState, useTransition } from "react";
import { deletePost } from "@editor/deletePost";

export function DeletePostButton({ postId }: { postId: number }) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    const fd = new FormData();
    fd.append("id", String(postId));
    startTransition(async () => {
      await deletePost(fd);
    });
  };

  if (confirming) {
    return (
      <span className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          className="px-3 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
        >
          {isPending ? "Mazání…" : "Ano, smazat"}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          disabled={isPending}
          className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          Zrušit
        </button>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="text-sm text-red-400 hover:text-red-600 transition-colors"
    >
      Smazat
    </button>
  );
}
