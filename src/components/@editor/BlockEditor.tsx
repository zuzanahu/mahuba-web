"use client";

import { useState } from "react";
import { RichTextEditor } from "@editor/RichTextEditor";
import type { JSONContent } from "@tiptap/react";
import type { PostContent } from "@/types/@editor/PostContent";
import { BlockId } from "@editor/BlockId";
import { AddBlockButton } from "@editor/AddBlockButton";

/**
 * Props for the {@link BlockEditor} component.
 */
export interface BlockEditorProps {
  /**
   * The initial {@link PostContent} used to seed the editor state on mount.
   *
   * @remarks
   * Pass an empty array (`[]`) when creating a new post (see {@link NewPostEditor}),
   * or the existing block array when editing a saved post (see {@link EditPostEditor}).
   * After mount, all mutations are managed in local React state — changes to this
   * prop after the first render are ignored.
   */
  initialPostContent: PostContent;

  /**
   * Callback invoked when the user clicks the **Save** button.
   *
   * @remarks
   * Receives the current {@link PostContent} snapshot and is expected to persist
   * it — typically by calling a server action such as {@link createPost} or
   * {@link updatePost}. The callback is `async` so that the caller can `await`
   * the server round-trip before e.g. redirecting.
   *
   * @param postContent - The up-to-date array of {@link Block} instances at the
   *   moment the user clicked Save.
   */
  onSave: (postContent: PostContent) => Promise<void>;
}

/**
 * A client-side block editor for composing and saving {@link PostContent}.
 *
 * @remarks
 * `BlockEditor` is the central orchestrator of the editing experience. It owns
 * the authoritative {@link PostContent} state for the current editing session and
 * renders one {@link RichTextEditor} per {@link Block} in that array.
 *
 * ### Block lifecycle
 * - **Initialisation** — `initialPostContent` is used as the initial value of the
 *   internal `postContent` state. Subsequent changes to the prop are ignored.
 * - **Content updates** — Each {@link RichTextEditor} reports changes via
 *   `handleContentChange`, which performs an immutable update of the affected
 *   block using its {@link BlockId}.
 * - **Adding blocks** — {@link AddBlockButton} calls `handleAddBlock`, which
 *   appends a new empty `"richText"` {@link Block} (with a freshly generated
 *   {@link BlockId}) to the array.
 * - **Saving** — The **Save** button calls `onSave` with the current
 *   `postContent` snapshot. The parent is responsible for persisting the data
 *   (e.g. via {@link createPost} or {@link updatePost}).
 *
 * ### Extending with new block types
 * Currently only {@link RichTextBlock} / `"richText"` blocks are supported. To
 * render a different editor for a new block type, add a branch to the `map`
 * callback below (where the `TODO` comment is) that switches on `block.type`.
 *
 * @param BlockEditorProps
 *
 * @example
 * ```tsx
 * <BlockEditor
 *   initialPostContent={existingContent}
 *   onSave={(content) => updatePost({ id, title, slug, content })}
 * />
 * ```
 *
 * @see {@link NewPostEditor} — mounts `BlockEditor` with an empty content array.
 * @see {@link EditPostEditor} — mounts `BlockEditor` pre-populated with a saved post.
 * @see {@link RichTextEditor} — the per-block editor rendered for `"richText"` blocks.
 * @see {@link AddBlockButton} — the button that appends a new empty block.
 */
export function BlockEditor({ initialPostContent, onSave }: BlockEditorProps) {
  const [postContent, setPostContent] =
    useState<PostContent>(initialPostContent);

  /**
   * Updates a single block's content in local state by its {@link BlockId}.
   *
   * @remarks
   * Called by each {@link RichTextEditor} instance via its `onContentChangeAction`
   * prop whenever Tiptap emits an `"update"` event. The update is applied
   * immutably: all blocks whose `id` does not match are kept as-is, and the
   * matching block has its `content` replaced with the new {@link JSONContent}.
   *
   * @param id - The {@link BlockId} of the block to update.
   * @param content - The new Tiptap {@link JSONContent} snapshot for the block.
   */
  const handleContentChange = (id: BlockId, content: JSONContent) => {
    setPostContent((prev) =>
      prev.map((block) => (block.id === id ? { ...block, content } : block)),
    );
  };

  /**
   * Appends a new empty `"richText"` {@link Block} to the {@link PostContent} array.
   *
   * @remarks
   * Called by {@link AddBlockButton} when the user clicks "+ Add paragraph".
   * A cryptographically random {@link BlockId} is generated via
   * `crypto.randomUUID()` to uniquely identify the new block. The block's
   * initial `content` is an empty ProseMirror document (`{ type: "doc", content: [] }`).
   */
  const handleAddBlock = () => {
    const newBlock = {
      id: crypto.randomUUID() as BlockId,
      // Only richtext for now.
      type: "richText" as const,
      content: { type: "doc", content: [] } as JSONContent,
    };
    setPostContent((prev) => [...prev, newBlock]);
  };

  return (
    <div className="flex flex-col gap-4">
      {postContent.map((block) => (
        // Each block is rendered with a RichTextEditor,
        // which reports content changes via handleContentChange.
        // TODO: Add logic to render different editor types based
        // on block.type (e.g., image, code, etc.)
        <RichTextEditor
          key={block.id}
          block={block}
          onContentChangeAction={handleContentChange}
        />
      ))}
      <AddBlockButton onAdd={handleAddBlock} />
      <button onClick={() => onSave(postContent)}>Save</button>
    </div>
  );
}
