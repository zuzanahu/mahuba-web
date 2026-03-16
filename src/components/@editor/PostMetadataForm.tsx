"use client";

/**
 * Props for the {@link PostMetadataForm} component.
 */
export interface PostMetadataFormProps {
  /** The current value of the post title input. */
  title: string;
  /**
   * The current value of the post slug input.
   *
   * @remarks
   * The slug is the URL-safe identifier used in the public route `/blog/[slug]`.
   * It is sanitised server-side in {@link updatePost} before being persisted —
   * any character that is not a lowercase ASCII letter, digit, or hyphen is
   * stripped. Showing the raw (pre-sanitised) value here gives the author
   * immediate feedback while typing.
   */
  slug: string;
  /**
   * Called whenever the title input value changes.
   *
   * @param title - The new title string entered by the user.
   */
  onTitleChange: (title: string) => void;
  /**
   * Called whenever the slug input value changes.
   *
   * @param slug - The new slug string entered by the user (unsanitised).
   */
  onSlugChange: (slug: string) => void;
}

/**
 * A controlled form for editing the metadata fields of a blog post.
 *
 * @remarks
 * Renders two text inputs — one for the post **title** and one for the URL
 * **slug** — and delegates all state management to the parent component via
 * the `onTitleChange` and `onSlugChange` callbacks. The component itself is
 * stateless.
 *
 * This form is shared between the create and edit flows:
 * - {@link NewPostEditor} mounts it with empty initial values.
 * - {@link EditPostEditor} mounts it pre-populated with the existing
 *   {@link Post} metadata.
 *
 * Note that the slug displayed here is the **raw, unsanitised** value the
 * author types. The final sanitisation (lower-casing and stripping invalid
 * characters) is applied server-side in {@link updatePost} before the value
 * is written to the database.
 *
 * @param PostMetadataFormProps
 */
export function PostMetadataForm({
  title,
  slug,
  onTitleChange,
  onSlugChange,
}: PostMetadataFormProps) {
  return (
    <div>
      <input
        type="text"
        placeholder="Post title"
        value={title}
        onChange={(e) => {
          const newTitle = e.target.value;
          onTitleChange(newTitle);
        }}
      />
      <input
        type="text"
        placeholder="Slug"
        value={slug}
        onChange={(e) => onSlugChange(e.target.value)}
      />
    </div>
  );
}
