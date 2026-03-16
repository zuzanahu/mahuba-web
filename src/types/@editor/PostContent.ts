import { Block } from "@editor/Block";

/**
 * The serialisable content of a blog post — an ordered array of {@link Block} instances.
 *
 * @remarks
 * `PostContent` is the top-level content model for the block editor. Each element in the
 * array is a {@link Block} (currently only {@link RichTextBlock}), rendered in order both
 * in the editor (see {@link BlockEditor}) and on the public-facing blog (see `BlogPostPage`).
 *
 * ### Persistence
 * `PostContent` is stored in the `posts.content` SQLite column as a JSON string.
 * When reading a post back from the database, the raw `unknown` value must be validated
 * with {@link isPostContent} before it is safe to treat as `PostContent`.
 *
 * ### Deserialisation flow
 * ```
 * DB JSON string
 *   → JSON.parse()          (handled by Drizzle's json mode)
 *   → isPostContent()       runtime type-guard
 *   → PostContent           typed value, safe to render / edit
 * ```
 *
 * ### Extending with new block types
 * Add the new variant to {@link Block} and update {@link isPostContent} (along with its
 * corresponding type-guard) so that the new block shape is recognised during deserialisation.
 *
 * @example
 * ```ts
 * const content: PostContent = [
 *   {
 *     type: "richText",
 *     id: crypto.randomUUID() as BlockId,
 *     content: { type: "doc", content: [] },
 *   },
 * ];
 * ```
 */
export type PostContent = Block[];
