import { RichTextBlock } from "@editor/RichTextBlock";
import { isJSONContent } from "@editor/isJSONContent";

/**
 * Type guard that checks whether an `unknown` value conforms to the
 * {@link RichTextBlock} shape.
 *
 * @remarks
 * Verifies the minimum required shape of a {@link RichTextBlock}:
 * - The value is a non-null, non-array plain object.
 * - It contains an `id` property whose value is a `string` (see {@link BlockId}).
 * - It contains a `type` property whose value is the literal `"richText"`.
 * - It contains a `content` property that satisfies {@link isJSONContent}.
 *
 * This guard is used inside {@link isPostContent} to validate each element of
 * the `PostContent` array when deserialising a post's `content` column from
 * the database.
 *
 * @param value - The value to test.
 * @returns `true` if `value` satisfies the {@link RichTextBlock} shape,
 *          narrowing its type accordingly.
 *
 * @example
 * ```ts
 * const raw: unknown = JSON.parse(row.content);
 * if (isRichTextBlock(raw)) {
 *   // raw is now typed as RichTextBlock
 *   console.log(raw.id, raw.type, raw.content);
 * }
 * ```
 */
export function isRichTextBlock(value: unknown): value is RichTextBlock {
  /** typeof value === "object" will be true for [], {} and for null! */
  if (typeof value !== "object" || value == null || Array.isArray(value))
    return false;
  return (
    "id" in value &&
    typeof value.id === "string" &&
    "type" in value &&
    value.type === "richText" &&
    "content" in value &&
    isJSONContent(value.content)
  );
}
