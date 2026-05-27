export const dynamic = "force-dynamic";

import { db } from "@/db";
import { posts } from "@/db/schema";
import Link from "next/link";
import { deletePost } from "@editor/deletePost";
import { togglePublish } from "@editor/togglePublish";

export default async function AdminPostsPage() {
  const allPosts = await db.select().from(posts);

  return (
    <>
      <h1>Posts</h1>
      <Link href="/admin/posts/new">New post</Link>

      <ul>
        {allPosts.map((post) => (
          <li key={post.id}>
            <strong>{post.title}</strong> ({post.slug}){" "}
            {post.status === "published" ? "🟢 published" : post.status === "archived" ? "🗄️ archived" : "⚪ draft"}
            {/* Publish / Unpublish */}
            <form
              action={togglePublish}
              style={{ display: "inline", marginLeft: 8 }}
            >
              <input type="hidden" name="id" value={post.id} />
              <input
                type="hidden"
                name="status"
                value={post.status === "published" ? "draft" : "published"}
              />
              <button type="submit">
                {post.status === "published" ? "Unpublish" : "Publish"}
              </button>
            </form>
            {/* Edit */}
            <Link href={`/admin/posts/${post.id}`}>Edit</Link> {/* Delete */}
            <form
              action={deletePost}
              style={{ display: "inline", marginLeft: 8 }}
            >
              <input type="hidden" name="id" value={post.id} />
              <button type="submit">Delete</button>
            </form>
          </li>
        ))}
      </ul>
    </>
  );
}
