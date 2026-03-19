"use server";

import { db } from "@/db";
import { NewPost, posts } from "@/db/schema";
import { redirect } from "next/navigation";

/**
 * Server action that inserts a new blog post into the database and redirects
 * the user to the admin posts listing.
 *
 * @remarks
 * This is a Next.js Server Action (`"use server"`). It must only be called
 * from a client component event handler or a `<form action={...}>` binding —
 * never imported and executed in a Server Component render path.
 *
 * The `published` flag is **always forced to `false`** on creation, regardless
 * of the value supplied in `post`. A post must be explicitly published via
 * {@link togglePublish} after creation.
 *
 * After a successful insert the function:
 * Calls `redirect("/admin/posts")` to navigate the user back to the listing.
 *
 * @param post - The data for the new post, conforming to {@link NewPost}.
 *   The `published`, `id`, and `createdAt` fields are optional because they
 *   have database-level defaults; `title`, `slug`, and `content` are required.
 *
 * @throws {Error} If the database insert fails (e.g. a duplicate `slug`
 *   violates the unique constraint on the {@link posts} table).
 *
 * @example
 * ```ts
 * // Inside a client component:
 * await createPost({ title, slug, content, published: false });
 * // The user is redirected to /admin/posts automatically.
 * ```
 *
 * @see {@link updatePost} to modify an existing post.
 * @see {@link deletePost} to remove a post.
 * @see {@link togglePublish} to flip the published state of a post.
 */
export async function createPost(post: NewPost) {
  await db.insert(posts).values({
    title: post.title,
    slug: post.slug,
    content: post.content,
    published: false,
  });

  redirect("/admin/posts");
}
