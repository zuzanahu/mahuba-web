"use server";

import { db } from "@/db";
import { posts, type PostStatus } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * Server action that transitions a post's status between `"draft"` and
 * `"published"`. Also sets or clears `publishedAt` accordingly.
 *
 * @remarks
 * This is a Next.js Server Action (`"use server"`). Bind it to a
 * `<form action={togglePublish}>` with hidden fields for `id` and `status`.
 *
 * After a successful update revalidates `/admin/posts`.
 *
 * @param formData - The `FormData` submitted by the form. Must contain:
 *   - `id` — Numeric primary key of the post (as a string).
 *   - `status` — The desired next status: `"published"` or `"draft"`.
 *
 * @throws {Error} With the message `"Missing post id"` if `id` is absent or
 *   zero.
 *
 * @example
 * ```tsx
 * <form action={togglePublish}>
 *   <input type="hidden" name="id" value={post.id} />
 *   <input type="hidden" name="status" value={post.status === "published" ? "draft" : "published"} />
 *   <button type="submit">{post.status === "published" ? "Unpublish" : "Publish"}</button>
 * </form>
 * ```
 *
 * @see {@link createPost} to create a new post.
 * @see {@link updatePost} to modify an existing post.
 * @see {@link deletePost} to remove a post.
 */
export async function togglePublish(formData: FormData) {
  const id = Number(formData.get("id"));
  const nextStatus = formData.get("status") as PostStatus;

  if (!id) {
    throw new Error("Missing post id");
  }

  const isPublishing = nextStatus === "published";

  await db
    .update(posts)
    .set({
      status: nextStatus,
      publishedAt: isPublishing ? sql`(unixepoch('now'))` : null,
    })
    .where(eq(posts.id, id));

  revalidatePath("/admin/posts");
}
