import { PostContent } from "@editor/PostContent";
import { isRichTextBlock } from "@editor/isRichTextBlock";

/**
 * Type guard that checks whether an `unknown` value conforms to the
 * {@link PostContent} shape.
 *
 * @remarks
 * `PostContent` is an array of {@link Block} instances. This guard verifies:
 * - The value is an array.
 * - Every element in the array satisfies at least one of the known block
 *   type guards (currently only {@link isRichTextBlock}).
 *
 * This is the top-level deserialisation guard used wherever a post's `content`
 * column is read back from the database as an `unknown` value — for example in
 * `EditPostPage`, `BlogPostPage`, and {@link EditPostEditor}.
 *
 * ### Extending with new block types
 * When a new variant is added to {@link Block}, add its corresponding type guard
 * to the `every` predicate below so that persisted blocks of that type are
 * correctly recognised:
 * ```ts
 * value.every((item) => isRichTextBlock(item) || isImageBlock(item))
 * ```
 *
 * @param value - The value to test.
 * @returns `true` if `value` is a valid {@link PostContent} array,
 *          narrowing its type accordingly.
 *
 * @example
 * ```ts
 * const raw: unknown = JSON.parse(row.content);
 * if (isPostContent(raw)) {
 *   // raw is now typed as PostContent
 *   return <BlockEditor initialPostContent={raw} onSave={handleSave} />;
 * }
 * ```
 */
export function isPostContent(value: unknown): value is PostContent {
  if (!Array.isArray(value)) return false;
  return (
    // Check if every item in the array is a Block
    value.every(
      (item) => isRichTextBlock(item),
      // Future block type checks can be added
      // here as more block types are introduced.
    )
  );
}
