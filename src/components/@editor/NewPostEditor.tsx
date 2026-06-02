"use client";

import { useState } from "react";
import { BlockEditor } from "@editor/BlockEditor";
import { PostMetadataForm } from "@editor/PostMetadataForm";
import { NavSlot } from "@admin/Nav";
import { createPost } from "@editor/createPost";
import type { PostContent } from "@/types/@editor/PostContent";

/**
 * A client-side composer for creating a brand-new blog post.
 *
 * @remarks
 * Owns `title`, `slug`, and `content` state locally. On save, calls
 * {@link createPost} which inserts the row and redirects to `/admin/posts`.
 */
export function NewPostEditor() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState<PostContent>([]);

  const handleSave = () => createPost({ title, slug, content });

  return (
    <>
      <NavSlot
        back={{ href: "/admin/posts", label: "← Zpět na správu článků" }}
        actions={[{ label: "Uložit jako koncept", onClick: handleSave, variant: "dark" }]}
      />
      <div className="max-w-prose mx-auto p-6">
        <PostMetadataForm
          title={title}
          slug={slug}
          onTitleChange={setTitle}
          onSlugChange={setSlug}
        />
        <BlockEditor
          initialPostContent={[]}
          onChange={setContent}
        />
      </div>
    </>
  );
}
