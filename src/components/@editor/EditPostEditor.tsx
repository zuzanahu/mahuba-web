"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { BlockEditor } from "@editor/BlockEditor";
import { PostMetadataForm } from "@editor/PostMetadataForm";
import { PostPreviewsModal } from "@editor/PostPreviewsModal";
import { NavSlot } from "@admin/Nav";
import { Post, PostStatus } from "@/db/schema";
import { updatePost } from "@editor/updatePost";
import { togglePublish } from "@editor/togglePublish";
import { isPostContent } from "@editor/isPostContent";
import { notFound } from "next/navigation";
import type { PostContent } from "@/types/@editor/PostContent";

/**
 * Props for the {@link EditPostEditor} component.
 */
export interface EditPostEditorProps {
  /**
   * The existing {@link Post} record fetched from the database, used to
   * pre-populate all editor fields.
   *
   * @remarks
   * `initialPost.content` is typed as `unknown` by Drizzle. The component
   * validates it with {@link isPostContent} and calls `notFound()` if invalid.
   */
  initialPost: Post;
}

/**
 * A client-side editor for modifying an existing blog post.
 *
 * @remarks
 * Implements the two-column edit layout: a sticky top toolbar (back link,
 * autosave status, preview, publish) with a wide left column for block content
 * and a narrow right sidebar for metadata (title, excerpt, slug, cover image,
 * SEO/social preview placeholders).
 *
 * ### Autosave
 * A 2 s debounced `useEffect` fires whenever any of `title`, `slug`, `excerpt`,
 * `coverImage`, or `content` changes. The first render is skipped via a ref to
 * avoid saving on mount.
 *
 * ### Preview modal
 * "Náhled" opens {@link PostPreviewModal} which renders the current in-memory
 * content using `generateHTML` + StarterKit — unsaved changes are visible.
 *
 * ### Publish toggle
 * "Publikovat" / "Zrušit publikaci" calls {@link togglePublish} directly with
 * a `FormData` object and updates local `status` state on success.
 *
 * @param EditPostEditorProps
 */
export function EditPostEditor({ initialPost }: EditPostEditorProps) {
  const [title, setTitle] = useState(initialPost.title);
  const [slug, setSlug] = useState(initialPost.slug);
  const [excerpt, setExcerpt] = useState(initialPost.excerpt ?? "");
  const [coverImage, setCoverImage] = useState(initialPost.coverImage ?? "");
  // Cast is safe: the page component validates content before rendering this.
  const [content, setContent] = useState<PostContent>(
    initialPost.content as PostContent,
  );
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [status, setStatus] = useState<PostStatus>(initialPost.status);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isPending, startTransition] = useTransition();
  const isFirstRender = useRef(true);

  if (!isPostContent(initialPost.content)) {
    notFound();
  }

  // Debounced autosave — skips the initial mount.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const timer = setTimeout(async () => {
      try {
        await updatePost({
          id: initialPost.id,
          title,
          slug,
          excerpt: excerpt || null,
          coverImage: coverImage || null,
          content,
        });
        setLastSaved(new Date());
        setSaveError(null);
      } catch {
        setSaveError("Nepodařilo se uložit.");
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [initialPost.id, title, slug, excerpt, coverImage, content]);

  const handleTogglePublish = () => {
    const nextStatus: PostStatus =
      status === "published" ? "draft" : "published";
    const fd = new FormData();
    fd.append("id", String(initialPost.id));
    fd.append("status", nextStatus);
    startTransition(async () => {
      await togglePublish(fd);
      setStatus(nextStatus);
    });
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("cs-CZ", { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      <NavSlot
        back={{ href: "/admin/posts", label: "← Zpět na správu článků" }}
        status={lastSaved ? `Automaticky uloženo ve ${formatTime(lastSaved)}` : undefined}
        error={saveError ?? undefined}
        actions={[
          { label: "Náhled", onClick: () => setIsPreviewOpen(true), variant: "outline" },
          {
            label: status === "published" ? "Zrušit publikaci" : "Publikovat",
            onClick: handleTogglePublish,
            variant: "dark",
            disabled: isPending,
          },
          {
            label: isSidebarOpen ? "Skrýt panel" : "Zobrazit panel",
            onClick: () => setIsSidebarOpen((v) => !v),
            icon: (
              <svg width="20" height="16" viewBox="0 0 20 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                <rect x="0.75" y="0.75" width="18.5" height="14.5" rx="2.5" />
                <line x1="13.5" y1="1" x2="13.5" y2="15" />
                <line x1="15" y1="5" x2="18" y2="5" />
                <line x1="15" y1="8" x2="18" y2="8" />
                <line x1="15" y1="11" x2="18" y2="11" />
              </svg>
            ),
          },
        ]}
      />

      {/* Body */}
      <div
        className={`flex-1 grid ${isSidebarOpen ? "grid-cols-[1fr_320px]" : "grid-cols-1"}`}
      >
        {/* Block editor — always centered at blog article width */}
        <div
          className={`p-6 overflow-y-auto ${isSidebarOpen ? "border-r border-gray-200" : ""}`}
        >
          <div className="max-w-prose mx-auto">
            <BlockEditor
              initialPostContent={initialPost.content as PostContent}
              onChange={setContent}
            />
          </div>
        </div>

        {/* Sidebar — always rendered; collapses to thin strip */}
        <aside className="sticky top-nav h-[calc(100vh-var(--spacing-nav))] flex flex-col bg-white">
          {isSidebarOpen && (
            <div className="overflow-y-auto flex-1">
              <PostMetadataForm
                title={title}
                slug={slug}
                excerpt={excerpt}
                coverImage={coverImage}
                onTitleChange={setTitle}
                onSlugChange={setSlug}
                onExcerptChange={setExcerpt}
                onCoverImageChange={setCoverImage}
              />
            </div>
          )}
        </aside>
      </div>

      <PostPreviewsModal
        content={content}
        title={title}
        slug={slug}
        excerpt={excerpt}
        coverImage={coverImage}
        publishedAt={initialPost.publishedAt}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </>
  );
}
