"use server";

import { db } from "@/db";
import { posts } from "@/db/schema";
import { PostContent } from "@editor/PostContent";
import { eq } from "drizzle-orm";

/**
 * Server action that updates the metadata and content of an existing blog post.
 *
 * @remarks
 * This is a Next.js Server Action (`"use server"`). It must only be called
 * from a client component event handler — typically the `onSave` callback
 * passed to {@link BlockEditor} inside {@link EditPostEditor}.
 *
 * ### Slug sanitisation
 * Before writing to the database, the supplied `slug` is sanitised by:
 * 1. Converting it to lower-case.
 * 2. Stripping every character that is not a lowercase ASCII letter, digit,
 *    or hyphen (`[^a-z0-9-]`).
 *
 * If the sanitised slug is an empty string the action throws immediately,
 * preventing a row with an invalid slug from being written.
 *
 * @param data - An object describing the update to apply:
 *   - `id` — Numeric primary key of the post to update (see {@link Post}).
 *   - `title` — New human-readable title for the post.
 *   - `slug` — New URL slug. Will be sanitised before being persisted (see above).
 *   - `content` — New block editor content (see {@link PostContent}).
 *
 * @throws {Error} With the message `"Invalid slug"` if the sanitised slug
 *   resolves to an empty string.
 * @throws {Error} If the database update fails (e.g. a duplicate `slug`
 *   violates the unique constraint on the {@link posts} table).
 *
 * @example
 * ```ts
 * // Inside a client component:
 * await updatePost({ id: post.id, title, slug, content });
 * ```
 *
 * @see {@link createPost} to create a new post.
 * @see {@link deletePost} to remove a post.
 * @see {@link togglePublish} to flip the published state of a post.
 */
export async function updatePost(data: {
  id: number;
  title: string;
  slug: string;
  content: PostContent;
}) {
  // Sanitize slug.
  const safeSlug = data.slug.toLowerCase().replace(/[^a-z0-9-]/g, "");
  if (!safeSlug) throw new Error("Invalid slug");

  await db
    .update(posts)
    .set({
      title: data.title,
      slug: data.slug,
      content: data.content,
    })
    .where(eq(posts.id, data.id));
}
