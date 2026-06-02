"use client";

import Image from "next/image";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";
import type { PostContent } from "@/types/@editor/PostContent";

type Tab = "article" | "blog" | "search" | "share";

/**
 * Props for the {@link PostPreviewsModal} component.
 */
export interface PostPreviewsModalProps {
  content: PostContent;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  publishedAt: Date | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * A tabbed modal showing all four preview types at their natural sizes.
 *
 * @remarks
 * Tabs:
 * - **Článek** — full article rendered via `generateHTML` + StarterKit
 * - **Přehled blogu** — blog listing card at `max-w-2xl` (matches `/blog/page.tsx`)
 * - **Vyhledávání** — Google-style search snippet at ~600 px
 * - **Sdílení** — social share card mockup with 1.91:1 cover image
 *
 * All previews reflect the current in-memory state (including unsaved changes).
 * Future block types should be added in the "article" tab branch.
 */
export function PostPreviewsModal({
  content,
  title,
  slug,
  excerpt,
  coverImage,
  publishedAt,
  isOpen,
  onClose,
}: PostPreviewsModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>("article");

  if (!isOpen) return null;

  const tabs: { key: Tab; label: string }[] = [
    { key: "article", label: "Článek" },
    { key: "blog", label: "Přehled blogu" },
    { key: "search", label: "Vyhledávání" },
    { key: "share", label: "Sdílení" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center overflow-y-auto py-10 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg w-full max-w-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tab bar + close */}
        <div className="flex items-center justify-between border-b border-gray-200 px-4">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
                  activeTab === tab.key
                    ? "border-gray-900 text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-xl leading-none ml-4"
            aria-label="Zavřít náhled"
          >
            ✕
          </button>
        </div>

        {/* Tab content */}
        <div className="p-8 overflow-y-auto max-h-[75vh]">
          {activeTab === "article" && (
            <article className="prose prose-lg prose-slate mx-auto">
              <h1>
                {title || (
                  <span className="text-gray-400 italic">Titulek článku</span>
                )}
              </h1>
              {content.map((block) => {
                if (block.type === "richText") {
                  const html = generateHTML(block.content, [StarterKit]);
                  return (
                    <div
                      key={block.id}
                      dangerouslySetInnerHTML={{ __html: html }}
                    />
                  );
                }
                // Future block types handled here.
                return null;
              })}
            </article>
          )}

          {activeTab === "blog" && (
            <div className="max-w-2xl mx-auto">
              <div className="flex items-baseline justify-between mb-3">
                <h2 className="text-xl font-semibold">
                  {title || (
                    <span className="text-gray-400 italic">Titulek článku</span>
                  )}
                </h2>
                {publishedAt && (
                  <p className="text-sm text-gray-400 shrink-0 ml-4">
                    {publishedAt.toLocaleDateString("cs-CZ", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                )}
              </div>
              <div className="flex gap-5">
                {coverImage ? (
                  <div className="relative shrink-0 w-48 aspect-video rounded-lg overflow-hidden">
                    <Image
                      src={coverImage}
                      alt={title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="shrink-0 w-48 aspect-video rounded-lg bg-gray-100" />
                )}
                {excerpt && <p className="text-gray-600">{excerpt}</p>}
              </div>
            </div>
          )}

          {activeTab === "search" && (
            <div
              className="max-w-150 mx-auto"
              style={{ fontFamily: "arial, sans-serif" }}
            >
              <p className="text-sm text-gray-500 mb-0.5">
                mahuba.cz › blog › {slug || "odkaz-clanku"}
              </p>
              <p className="text-xl text-blue-700 leading-snug cursor-default">
                {title || (
                  <span className="italic text-gray-400">Titulek článku</span>
                )}
              </p>
              <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                {excerpt || (
                  <span className="italic text-gray-400">
                    Popisek článku se zobrazí zde…
                  </span>
                )}
              </p>
            </div>
          )}

          {activeTab === "share" && (
            <div className="max-w-150 mx-auto border border-gray-200 rounded-xl overflow-hidden">
              {coverImage ? (
                <div className="relative w-full aspect-[1.91/1]">
                  <Image
                    src={coverImage}
                    alt={title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-full aspect-[1.91/1] bg-gray-100" />
              )}
              <div className="p-4 border-t border-gray-200">
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                  mahuba.cz
                </p>
                <p className="font-semibold text-gray-900 leading-snug">
                  {title || (
                    <span className="italic text-gray-400">Titulek článku</span>
                  )}
                </p>
                {excerpt && (
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {excerpt}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
