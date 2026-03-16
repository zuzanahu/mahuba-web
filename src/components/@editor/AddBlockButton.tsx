"use client";

/**
 * Props for the {@link AddBlockButton} component.
 */
export interface AddBlockButtonProps {
  /**
   * Callback invoked when the user clicks the button.
   *
   * @remarks
   * The parent component ({@link BlockEditor}) is responsible for creating a
   * new empty {@link Block} and appending it to the {@link PostContent} array
   * when this callback fires.
   */
  onAdd: () => void;
}

/**
 * A button that appends a new empty rich-text paragraph block to the editor.
 *
 * @remarks
 * This is a purely presentational component — it owns no state and carries no
 * knowledge of the block model. All logic for constructing and inserting the
 * new {@link Block} lives in the `onAdd` callback supplied by {@link BlockEditor}.
 *
 * The button is rendered below the last existing block, giving the author a
 * clear affordance to extend the post with additional content.
 *
 * @param AddBlockButtonProps
 *
 * @example
 * ```tsx
 * <AddBlockButton onAdd={() => setBlocks((prev) => [...prev, newBlock])} />
 * ```
 *
 * @see {@link BlockEditor} for the component that manages block state and
 * passes the `onAdd` handler down to this button.
 */
export function AddBlockButton({ onAdd }: AddBlockButtonProps) {
  return <button onClick={onAdd}>+ Add paragraph</button>;
}
