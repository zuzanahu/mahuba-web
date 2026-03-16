"use client";

import { BlockEditor } from "@editor/BlockEditor";
import { PostMetadataForm } from "@editor/PostMetadataForm";
import { createPost } from "@editor/createPost";
import { useState } from "react";

/**
 * A client-side composer for creating a brand-new blog post.
 *
 * @remarks
 * `NewPostEditor` combines {@link PostMetadataForm} and {@link BlockEditor}
 * into a single self-contained authoring surface for new posts. It owns the
 * `title` and `slug` state locally, while {@link BlockEditor} owns the block
 * content state internally.
 *
 * ### Save flow
 * When the user clicks **Save** inside {@link BlockEditor}, the `onSave`
 * callback fires with the current {@link PostContent}. `NewPostEditor` then
 * calls the {@link createPost} server action with the title, slug, and content,
 * forcing `published` to `false`. After a successful insert, {@link createPost}
 * redirects the user to `/admin/posts` automatically.
 *
 * ### Relationship to the edit flow
 * This component is the create-only counterpart of {@link EditPostEditor}.
 * Both share the same {@link PostMetadataForm} and {@link BlockEditor}
 * sub-components; the difference is that `NewPostEditor` starts with empty
 * state and delegates persistence to {@link createPost}, whereas
 * {@link EditPostEditor} is seeded with an existing {@link Post} and delegates
 * to {@link updatePost}.
 *
 * @example
 * ```tsx
 * // Rendered by the Next.js page at /admin/posts/new:
 * export default function NewPostPage() {
 *   return <NewPostEditor />;
 * }
 * ```
 *
 * @see {@link EditPostEditor} — the edit-mode counterpart of this component.
 * @see {@link createPost} — the server action called on save.
 * @see {@link PostMetadataForm} — the title / slug input form.
 * @see {@link BlockEditor} — the block content editor.
 */
export function NewPostEditor() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");

  return (
    <div>
      <PostMetadataForm
        title={title}
        slug={slug}
        onTitleChange={setTitle}
        onSlugChange={setSlug}
      />
      <BlockEditor
        initialPostContent={[]}
        onSave={(content) =>
          createPost({ title, slug, content, published: false })
        }
      />
    </div>
  );
}
