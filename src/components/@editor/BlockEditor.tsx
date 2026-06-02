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
   * Called on every content change (add block, edit block).
   */
  onChange?: (postContent: PostContent) => void;
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
 * - **Initialisation** — `initialPostContent` seeds the internal state on mount.
 * - **Content updates** — Each {@link RichTextEditor} reports changes via
 *   `handleContentChange`. The new snapshot is forwarded to `onChange`.
 * - **Adding blocks** — {@link AddBlockButton} calls `handleAddBlock`, which
 *   appends a new empty `"richText"` block. The updated array is forwarded to `onChange`.
 *
 * ### Extending with new block types
 * Add a branch to the `map` callback below (where the `TODO` comment is) that
 * switches on `block.type` to render different editors per type (e.g. E9–E13 ImageBlock).
 *
 * @param BlockEditorProps
 */
export function BlockEditor({ initialPostContent, onChange }: BlockEditorProps) {
  const [postContent, setPostContent] =
    useState<PostContent>(initialPostContent);

  /**
   * Updates a single block's content in local state by its {@link BlockId}
   * and forwards the updated array to the `onChange` prop.
   */
  const handleContentChange = (id: BlockId, content: JSONContent) => {
    const next = postContent.map((block) =>
      block.id === id ? { ...block, content } : block,
    );
    setPostContent(next);
    onChange?.(next);
  };

  /**
   * Appends a new empty `"richText"` block and forwards the updated array
   * to the `onChange` prop.
   */
  const handleAddBlock = () => {
    const next = [
      ...postContent,
      {
        id: crypto.randomUUID() as BlockId,
        type: "richText" as const,
        content: { type: "doc", content: [] } as JSONContent,
      },
    ];
    setPostContent(next);
    onChange?.(next);
  };

  return (
    <div className="flex flex-col gap-4">
      {postContent.map((block) => (
        // TODO: Add branches for new block types (e.g. ImageBlock for E9–E13).
        <RichTextEditor
          key={block.id}
          block={block}
          onContentChangeAction={handleContentChange}
        />
      ))}
      <AddBlockButton onAdd={handleAddBlock} />
    </div>
  );
}
