import { db } from "@/db";
import { posts } from "@/db/schema";
import Link from "next/link";
import { deletePost } from "./actions";

export default async function AdminPostsPage() {
  const allPosts = await db.select().from(posts);

  return (
    <>
      <h1>Posts</h1>
      <Link href="/admin/posts/new">New post</Link>

      <ul>
        {allPosts.map((post) => (
          <li key={post.id}>
            <strong>{post.title}</strong> ({post.slug})
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
