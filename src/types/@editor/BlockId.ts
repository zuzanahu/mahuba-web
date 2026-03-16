/**
 * A cryptographically secure unique identifier for a {@link Block}.
 *
 * @remarks
 * `BlockId` is a branded string type, meaning it is structurally identical to
 * `string` at runtime, but the TypeScript compiler treats it as a distinct type.
 * This prevents accidentally passing a plain `string` where a `BlockId` is expected.
 *
 * To create a `BlockId`, cast a cryptographically generated UUID:
 *
 * @example
 *     const id = crypto.randomUUID() as BlockId;
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID | crypto.randomUUID()}
 */
export type BlockId = string & { readonly __brand: "BlockId" };
