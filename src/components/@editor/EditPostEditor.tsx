"use client";

import { BlockEditor } from "@editor/BlockEditor";
import { PostMetadataForm } from "@editor/PostMetadataForm";
import { Post } from "@/db/schema";
import { updatePost } from "@editor/updatePost";
import { isPostContent } from "@editor/isPostContent";
import { notFound } from "next/navigation";
import { useState } from "react";

/**
 * Props for the {@link EditPostEditor} component.
 */
export interface EditPostEditorProps {
  /**
   * The existing {@link Post} record fetched from the database, used to
   * pre-populate all editor fields.
   *
   * @remarks
   * `initialPost.content` is typed as `unknown` by Drizzle (because the column
   * uses `{ mode: "json" }`). Before the component renders the {@link BlockEditor},
   * it validates the value with {@link isPostContent} and calls `notFound()` if
   * the content does not conform to the expected {@link PostContent} shape.
   */
  initialPost: Post;
}

/**
 * A client-side editor for modifying an existing blog post.
 *
 * @remarks
 * `EditPostEditor` combines {@link PostMetadataForm} and {@link BlockEditor}
 * into a single self-contained authoring surface for editing saved posts. It
 * owns the `title` and `slug` state locally (seeded from `initialPost`), while
 * {@link BlockEditor} owns the block content state internally (seeded from the
 * validated {@link PostContent}).
 *
 * ### Content validation
 * Because the `content` column is stored as raw JSON and typed as `unknown` by
 * Drizzle, the component validates it with {@link isPostContent} before
 * rendering. If validation fails (e.g. the data is corrupted or in a legacy
 * format), `notFound()` is called, rendering the Next.js 404 page rather than
 * crashing with a runtime error.
 *
 * ### Save flow
 * When the user clicks **Save** inside {@link BlockEditor}, the `onSave`
 * callback fires with the current {@link PostContent}. `EditPostEditor` then
 * calls the {@link updatePost} server action with the post `id`, the current
 * `title`, `slug`, and `content`.
 *
 * ### Relationship to the create flow
 * This component is the edit-mode counterpart of {@link NewPostEditor}.
 * Both share the same {@link PostMetadataForm} and {@link BlockEditor}
 * sub-components; the difference is that `EditPostEditor` is seeded with an
 * existing {@link Post} and delegates persistence to {@link updatePost},
 * whereas {@link NewPostEditor} starts with empty state and delegates to
 * {@link createPost}.
 *
 * @param EditPostEditorProps
 *
 * @example
 * ```tsx
 * // Rendered by the Next.js page at /admin/posts/[id]:
 * export default async function EditPostPage({ params }) {
 *   const post = await fetchPost(params.id);
 *   return <EditPostEditor initialPost={post} />;
 * }
 * ```
 *
 * @see {@link NewPostEditor} — the create-mode counterpart of this component.
 * @see {@link updatePost} — the server action called on save.
 * @see {@link PostMetadataForm} — the title / slug input form.
 * @see {@link BlockEditor} — the block content editor.
 * @see {@link isPostContent} — the type guard used to validate `initialPost.content`.
 */
export function EditPostEditor({ initialPost }: EditPostEditorProps) {
  const [title, setTitle] = useState(initialPost.title);
  const [slug, setSlug] = useState(initialPost.slug);

  // Type guard to ensure post.content is a PostContent (array of blocks)
  if (!isPostContent(initialPost.content)) {
    notFound();
  }

  return (
    <div>
      <PostMetadataForm
        title={title}
        slug={slug}
        onTitleChange={setTitle}
        onSlugChange={setSlug}
      />
      <BlockEditor
        initialPostContent={initialPost.content}
        onSave={(content) =>
          updatePost({ id: initialPost.id, title, slug, content })
        }
      />
    </div>
  );
}
