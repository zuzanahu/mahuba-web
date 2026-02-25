import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";

export default async function BlogPage() {
  const publishedPosts = await db
    .select()
    .from(posts)
    .where(eq(posts.published, true));

  return (
    <>
      <h1>Blog</h1>

      {publishedPosts.length === 0 && <p>No posts yet.</p>}

      <ul>
        {publishedPosts.map((post) => (
          <li key={post.id}>
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}
