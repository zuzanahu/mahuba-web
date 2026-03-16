import { JSONContent } from "@tiptap/react";

/**
 * Type guard that checks whether an `unknown` value conforms to the
 * {@link https://tiptap.dev/docs/editor/api/editor#getjson | JSONContent} shape
 * expected by Tiptap / ProseMirror.
 *
 * @remarks
 * `JSONContent` is Tiptap's representation of a ProseMirror document node.
 * According to the Tiptap source, every node **should** have a `type` string
 * field (e.g. `"doc"`, `"paragraph"`, `"text"`). This guard verifies the
 * minimum required shape:
 * - The value is a non-null, non-array plain object.
 * - It contains a `type` property whose value is a `string`.
 *
 * This is used as a building block inside {@link isRichTextBlock}, which in
 * turn is called by {@link isPostContent} when deserialising a post's `content`
 * column from the database.
 *
 * @param value - The value to test.
 * @returns `true` if `value` satisfies the minimum `JSONContent` shape,
 *          narrowing its type to `JSONContent`.
 *
 * @example
 * ```ts
 * const raw: unknown = JSON.parse(row.content);
 * if (isJSONContent(raw)) {
 *   // raw is now typed as JSONContent
 *   editor.commands.setContent(raw);
 * }
 * ```
 */
export function isJSONContent(value: unknown): value is JSONContent {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    "type" in value && // JSONContent always has a "type" field (should have anyways, confusing docs)
    typeof value.type === "string"
  );
}
