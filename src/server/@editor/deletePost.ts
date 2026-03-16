"use server";

import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * Server action that deletes a blog post from the database by its `id`.
 *
 * @remarks
 * This is a Next.js Server Action (`"use server"`). It is intended to be bound
 * directly to a `<form action={deletePost}>` element in the admin UI — the form
 * must include a hidden `<input name="id" />` field carrying the numeric post id.
 *
 * After a successful deletion the function revalidates both:
 * - `/admin/posts` — so the admin listing no longer shows the deleted post.
 * - `/blog` — so the public blog index is updated immediately.
 *
 * Individual post pages (e.g. `/blog/[slug]`) will return a 404 automatically
 * once the row is gone from the database, so no per-slug revalidation is needed.
 *
 * @param formData - The `FormData` submitted by the form. Must contain:
 *   - `id` — The numeric primary key of the post to delete (as a string, since
 *     `FormData` values are always strings). Parsed with `Number()`.
 *
 * @throws {Error} With the message `"Missing post id"` if the `id` field is
 *   absent, empty, or parses to `0` / `NaN`.
 * @throws {Error} If the underlying database operation fails.
 *
 * @example
 * ```tsx
 * // Inside a Server / Client Component:
 * <form action={deletePost}>
 *   <input type="hidden" name="id" value={post.id} />
 *   <button type="submit">Delete</button>
 * </form>
 * ```
 *
 * @see {@link createPost} to create a new post.
 * @see {@link updatePost} to modify an existing post.
 * @see {@link togglePublish} to flip the published state of a post.
 */
export async function deletePost(formData: FormData) {
  const id = Number(formData.get("id"));

  if (!id) {
    throw new Error("Missing post id");
  }

  await db.delete(posts).where(eq(posts.id, id));

  revalidatePath("/admin/posts");
  revalidatePath("/blog");
}
