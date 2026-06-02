"use client";

import Image from "next/image";
import { useState } from "react";
import { ALLOWED_IMAGE_TYPES } from "@/constants/allowedImageTypes";

/**
 * Props for the {@link PostMetadataForm} component.
 */
export interface PostMetadataFormProps {
  /** Current post title. */
  title: string;
  /**
   * Current post slug (URL identifier).
   *
   * @remarks
   * Displayed as typed (unsanitised). Final sanitisation happens server-side
   * in {@link updatePost} before persisting.
   */
  slug: string;
  /** Current excerpt / description. Only used in the edit sidebar. */
  excerpt?: string;
  /** Current cover image path (e.g. `/uploads/foo.jpg`). Only used in the edit sidebar. */
  coverImage?: string;
  onTitleChange: (title: string) => void;
  onSlugChange: (slug: string) => void;
  /** When provided, renders the Popisek input and the sidebar-only sections. */
  onExcerptChange?: (value: string) => void;
  /** When provided, renders the Obrázek file picker. */
  onCoverImageChange?: (path: string) => void;
}

/**
 * A controlled form for editing blog post metadata.
 *
 * @remarks
 * Renders in two modes depending on which optional props are supplied:
 * - **Compact** (`onExcerptChange` absent) — only Titulek + Odkaz inputs.
 *   Used by {@link NewPostEditor}.
 * - **Extended** (`onExcerptChange` present) — SEO / social placeholder boxes,
 *   Titulek, Popisek, Odkaz, and Obrázek file picker. Used by the
 *   {@link EditPostEditor} sidebar.
 *
 * @param PostMetadataFormProps
 */
export function PostMetadataForm({
  title,
  slug,
  excerpt = "",
  coverImage = "",
  onTitleChange,
  onSlugChange,
  onExcerptChange,
  onCoverImageChange,
}: PostMetadataFormProps) {
  const [isUploading, setIsUploading] = useState(false);

  /** Uploads the selected file to /api/upload and writes the returned path into the form. */
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onCoverImageChange) return;
    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (res.ok) {
        const { path } = (await res.json()) as { path: string };
        onCoverImageChange(path);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const inputClass =
    "w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  if (!onExcerptChange) {
    // Compact mode for the create flow.
    return (
      <div className="flex flex-col gap-4 p-4">
        <div>
          <label className={labelClass}>Titulek</label>
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Odkaz</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => onSlugChange(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>
    );
  }

  // Extended sidebar mode for the edit flow.
  return (
    <div className="flex flex-col gap-5 p-4">
      <div>
        <label className={labelClass}>Titulek</label>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <div className="flex items-baseline justify-between mb-1">
          <label className={labelClass.replace(" mb-1", "")}>Popisek</label>
          <span className={`text-xs ${excerpt.length >= 150 ? "text-red-500 font-medium" : "text-gray-400"}`}>
            {excerpt.length} / 150 znaků
          </span>
        </div>
        <textarea
          value={excerpt}
          maxLength={150}
          rows={5}
          onChange={(e) => onExcerptChange(e.target.value)}
          className={`${inputClass} resize-none ${excerpt.length >= 150 ? "border-red-400 focus:ring-red-400" : ""}`}
        />
        {excerpt.length >= 150 && (
          <p className="text-xs text-red-500 mt-1">Popisek může mít nejvýše 150 znaků.</p>
        )}
      </div>

      <div>
        <label className={labelClass}>Odkaz</label>
        <input
          type="text"
          value={slug}
          onChange={(e) => onSlugChange(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Obrázek</label>
        {coverImage && (
          <div className="relative w-full aspect-video rounded-md overflow-hidden mb-2">
            <Image src={coverImage} alt="" fill className="object-cover" />
          </div>
        )}
        {isUploading ? (
          <p className="text-sm text-gray-400">Nahrávám...</p>
        ) : (
          <input
            type="file"
            accept={ALLOWED_IMAGE_TYPES.join(", ")}
            onChange={handleFileChange}
            className="text-sm text-gray-600 w-full"
          />
        )}
      </div>

    </div>
  );
}
