import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import { JSONContent } from "@tiptap/react";

/**
 * Props for the {@link RichTextBlockRenderer} component.
 */
export interface RichTextBlockRendererProps {
  /**
   * The block to render.
   *
   * @remarks
   * Only the `id` and `content` fields are required here — `type` is not needed
   * because this renderer is exclusively concerned with rich text. The `id` is
   * used as the React `key` by the parent (`BlogPostPage`) when mapping over a
   * {@link PostContent} array, so it must be stable across renders.
   *
   * The `content` field must be a valid Tiptap (ProseMirror) {@link JSONContent}
   * document, as produced by
   * {@link https://tiptap.dev/docs/editor/api/editor#getjson | editor.getJSON()}
   * and persisted via {@link updatePost} / {@link createPost}.
   */
  block: {
    id: string;
    content: JSONContent;
  };
}

/**
 * A read-only server-side renderer for a single {@link RichTextBlock}.
 *
 * @remarks
 * Converts the block's Tiptap (ProseMirror) {@link JSONContent} document into
 * an HTML string using Tiptap's
 * {@link https://tiptap.dev/docs/editor/api/utilities/html#generate-html-from-json | generateHTML()}
 * utility, then injects it into the DOM via `dangerouslySetInnerHTML`.
 *
 * ### Why `dangerouslySetInnerHTML` is safe here
 * The HTML is produced deterministically by Tiptap's `generateHTML()` from
 * structured ProseMirror JSON — it is **not** raw user input. ProseMirror's
 * serialiser only emits the HTML it knows how to produce for the registered
 * extensions (here, {@link https://tiptap.dev/docs/editor/extensions/functionality/starterkit | StarterKit}),
 * so arbitrary script injection is not possible through this path.
 *
 * ### Extensions
 * The same `StarterKit` extension set that is used in {@link RichTextEditor}
 * must be passed to `generateHTML()` here so that the serialiser recognises
 * every node and mark type stored in the JSON. If you add custom Tiptap
 * extensions to the editor, add them to this renderer as well, otherwise those
 * nodes will be silently dropped from the output.
 *
 * ### Usage in the blog
 * `RichTextBlockRenderer` is used in `BlogPostPage` to render each
 * {@link RichTextBlock} in a post's {@link PostContent} array. It is a pure
 * Server Component — it performs no client-side work and requires no
 * `"use client"` directive.
 *
 * @param RichTextBlockRendererProps
 * @returns A `<div>` whose inner HTML is the rendered rich text.
 *
 * @example
 * ```tsx
 * // Rendering all blocks of a post on the public blog:
 * {post.content.map((block) => (
 *   <div key={block.id}>
 *     <RichTextBlockRenderer block={block} />
 *   </div>
 * ))}
 * ```
 *
 * @see {@link RichTextEditor} — the editable counterpart used in the admin editor.
 * @see {@link RichTextBlock} — the data type this component renders.
 * @see {@link PostContent} — the array of blocks that a post's content consists of.
 */
export function RichTextBlockRenderer({ block }: RichTextBlockRendererProps) {
  const html = generateHTML(block.content, [StarterKit]);

  // The HTML is controlled by ProseMirror and therefore is trusted.
  // "Div" has to be a self closing element in this case.
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
