import { RichTextBlock } from "@editor/RichTextBlock";

/**
 * A discriminated union of all supported content block types in the block editor.
 *
 * @remarks
 * Each variant of `Block` carries a `type` discriminant field (e.g. `"richText"`)
 * that allows TypeScript to narrow the union in `switch` / `if` statements, and
 * that is also used during JSON deserialisation to reconstruct the correct block
 * shape from persisted data.
 *
 * Currently supported variants:
 * - `"richText"` → {@link RichTextBlock}
 *
 * ### Extending the union
 * To introduce a new block type:
 * 1. Create a new type file (e.g. `ImageBlock.ts`) with a unique `type` literal.
 * 2. Add it to this union: `export type Block = RichTextBlock | ImageBlock;`
 * 3. Update {@link isPostContent} (and add a corresponding type-guard) so that
 *    the new variant is recognised during deserialisation.
 *
 * @example
 * ```ts
 * function renderBlock(block: Block) {
 *   switch (block.type) {
 *     case "richText":
 *       return <RichTextBlockRenderer block={block} />;
 *   }
 * }
 * ```
 */
export type Block = RichTextBlock;
