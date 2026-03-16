"use client";

import { BlockId } from "@editor/BlockId";
import type { RichTextBlock } from "@editor/RichTextBlock";
import { EditorContent, JSONContent, useEditor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

/**
 * Props for the {@link RichTextEditor} component.
 */
export interface RichTextEditorProps {
  /**
   * The {@link RichTextBlock} this editor instance is bound to.
   *
   * @remarks
   * Used for two purposes:
   * 1. `block.content` seeds the initial Tiptap editor state on mount.
   * 2. `block.id` is forwarded to {@link RichTextEditorProps.onContentChangeAction}
   *    so that the parent ({@link BlockEditor}) can identify which block was
   *    updated without having to maintain a separate reference.
   */
  block: RichTextBlock;

  /**
   * Callback invoked whenever the Tiptap editor emits an `"update"` event.
   *
   * @remarks
   * The parent component ({@link BlockEditor}) uses this to keep its
   * {@link PostContent} state in sync with what the user is typing.
   * The handler is re-registered via a `useEffect` whenever `editor`,
   * `block.id`, or this callback reference changes, so the parent should
   * stabilise the reference with `useCallback` if re-render performance is
   * a concern.
   *
   * @param id - The {@link BlockId} of the block whose content changed.
   * @param json - The current Tiptap document snapshot as
   *   {@link https://tiptap.dev/docs/editor/api/editor#getjson | JSONContent}.
   */
  onContentChangeAction: (id: BlockId, json: JSONContent) => void;
}

/**
 * A single-block rich text editor powered by
 * {@link https://tiptap.dev | Tiptap}.
 *
 * @remarks
 * Each `RichTextEditor` instance manages exactly one {@link RichTextBlock}.
 * {@link BlockEditor} renders one `RichTextEditor` per block in the
 * {@link PostContent} array and wires up `onContentChangeAction` to keep the
 * shared post content state up to date.
 *
 * ### Tiptap integration
 * - The editor is initialised with `block.content` as its starting document.
 * - {@link https://tiptap.dev/docs/editor/extensions/functionality/starterkit | StarterKit}
 *   provides the standard set of ProseMirror extensions (paragraphs, headings,
 *   bold, italic, lists, etc.).
 * - `immediatelyRender: false` is set to suppress the SSR hydration mismatch
 *   warning that Tiptap emits in Next.js server-component environments.
 * - A {@link https://tiptap.dev/docs/editor/extensions/functionality/bubble-menu | BubbleMenu}
 *   appears on text selection and exposes **Bold** and *Italic* toggle buttons.
 *
 * ### Content-change listener
 * The `"update"` handler is attached and detached inside a `useEffect` so that
 * stale closures over `block.id` or `onContentChangeAction` are never kept alive.
 * The cleanup function returned by the effect calls `editor.off("update", handler)`
 * before the effect re-runs or the component unmounts.
 *
 * @param RichTextEditorProps
 * @returns `null` while the Tiptap editor is initialising (i.e. before the
 *   first render in which `useEditor` returns a non-null editor instance).
 *
 * @example
 * ```tsx
 * <RichTextEditor
 *   block={block}
 *   onContentChangeAction={(id, json) => updateBlock(id, json)}
 * />
 * ```
 *
 * @see {@link BlockEditor} for the parent component that manages multiple
 *   `RichTextEditor` instances and owns the {@link PostContent} state.
 * @see {@link RichTextBlockRenderer} for the read-only counterpart used on the
 *   public-facing blog.
 */
export function RichTextEditor({
  block,
  onContentChangeAction,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    // Initializing the editor content.
    content: block.content,
    immediatelyRender: false,
  });

  // Attach a handler to listen for content changes (Tiptap "update" event) in the editor.
  // But we need to ensure that when the handler's dependencies change,
  // and a new handler is created, the old handler will be discarded.
  // TODO: Does it have to have the block.id as a dependency? It is not??? expected to change, but it is used in the handler.
  useEffect(() => {
    if (!editor) return;
    const handler = () => onContentChangeAction(block.id, editor.getJSON());
    editor.on("update", handler);
    return () => {
      editor.off("update", handler);
    };
  }, [editor, block.id, onContentChangeAction]);

  if (!editor) return null;

  return (
    <div className="border p-2 border-gray-600 rounded">
      <BubbleMenu editor={editor}>
        <div className="flex gap-1 bg-gray-900 text-white text-xs rounded p-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`px-2 py-1 rounded font-bold ${editor.isActive("bold") ? "bg-white text-gray-900" : ""}`}
          >
            B
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`px-2 py-1 rounded italic ${editor.isActive("italic") ? "bg-white text-gray-900" : ""}`}
          >
            I
          </button>
        </div>
      </BubbleMenu>
      <EditorContent editor={editor} />
    </div>
  );
}
