"use server";

import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * Server action that toggles the `published` state of a blog post.
 *
 * @remarks
 * This is a Next.js Server Action (`"use server"`). It is intended to be bound
 * directly to a `<form action={togglePublish}>` element in the admin UI — the
 * form must include hidden `<input>` fields for `id` and `published`.
 *
 * The desired **next** published state is read from the form data, so the
 * caller is responsible for passing the inverted value of the post's current
 * `published` flag. For example, if the post is currently published
 * (`published === true`), the form should submit `published="false"` so that
 * this action sets it to `false`.
 *
 * After a successful update the function revalidates both:
 * - `/admin/posts` — so the admin listing reflects the new state immediately.
 * - `/blog` — so the public blog index is updated immediately (a post that was
 *   just unpublished will disappear, and a newly published post will appear).
 *
 * @param formData - The `FormData` submitted by the form. Must contain:
 *   - `id` — The numeric primary key of the post (as a string). Parsed with
 *     `Number()`.
 *   - `published` — The **desired next** published state as the string
 *     `"true"` or `"false"`. Compared strictly with `=== "true"`.
 *
 * @throws {Error} With the message `"Missing post id"` if the `id` field is
 *   absent, empty, or parses to `0` / `NaN`.
 * @throws {Error} If the underlying database operation fails.
 *
 * @example
 * ```tsx
 * // Inside a Server / Client Component:
 * <form action={togglePublish}>
 *   <input type="hidden" name="id" value={post.id} />
 *   <input type="hidden" name="published" value={post.published ? "false" : "true"} />
 *   <button type="submit">{post.published ? "Unpublish" : "Publish"}</button>
 * </form>
 * ```
 *
 * @see {@link createPost} to create a new post.
 * @see {@link updatePost} to modify an existing post.
 * @see {@link deletePost} to remove a post.
 */
export async function togglePublish(formData: FormData) {
  const id = Number(formData.get("id"));
  const published = formData.get("published") === "true";

  if (!id) {
    throw new Error("Missing post id");
  }

  await db.update(posts).set({ published }).where(eq(posts.id, id));

  revalidatePath("/admin/posts");
  revalidatePath("/blog");
}
