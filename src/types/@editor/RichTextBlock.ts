import type { JSONContent } from "@tiptap/core";
import { BlockId } from "@editor/BlockId";

/**
 * A content block that holds rich text in Tiptap (ProseMirror) JSON format.
 *
 * @remarks
 * `RichTextBlock` is one of the concrete variants of the {@link Block} discriminated
 * union. The `type` field is set to the literal `"richText"`, which allows TypeScript
 * to narrow a {@link Block} to a `RichTextBlock` and also serves as the key used
 * when serialising / deserialising blocks to and from the database JSON column.
 *
 * The `content` field stores the document tree produced by Tiptap's
 * {@link https://tiptap.dev/docs/editor/api/editor#getjson | editor.getJSON()}.
 * It can be rendered back to HTML server-side via
 * {@link https://tiptap.dev/docs/editor/api/utilities/html#generate-html-from-json | generateHTML()}
 * (see {@link RichTextBlockRenderer}) or re-hydrated into a live Tiptap editor
 * on the client (see {@link RichTextEditor}).
 *
 * Use {@link isRichTextBlock} to safely narrow an `unknown` value to this type
 * when deserialising persisted data.
 *
 * @example
 * ```ts
 * const block: RichTextBlock = {
 *   type: "richText",
 *   id: crypto.randomUUID() as BlockId,
 *   content: { type: "doc", content: [] },
 * };
 * ```
 */
export type RichTextBlock = {
  /**
   * Discriminant used to identify this block variant within the {@link Block}
   * union and during JSON deserialisation.
   */
  type: "richText";

  /**
   * Unique identifier for this block.
   *
   * Generated via `crypto.randomUUID()` and cast to {@link BlockId}.
   * Used to track the block across updates and to identify the currently
   * active block in {@link BlockEditor} state.
   */
  id: BlockId;

  /**
   * The rich text content stored as a Tiptap (ProseMirror) JSON document.
   *
   * @see {@link https://tiptap.dev/docs/editor/api/editor#getjson | editor.getJSON()}
   */
  content: JSONContent;
};
