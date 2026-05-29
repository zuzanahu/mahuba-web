// Opt out of static generation so the post list always reflects the latest DB state.
export const dynamic = "force-dynamic";

import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import Image from "next/image";
import Link from "next/link";

export default async function BlogPage() {
  const publishedPosts = await db
    .select()
    .from(posts)
    .where(eq(posts.status, "published"))
    .orderBy(desc(posts.publishedAt));

  return (
    <div className="max-w-2xl mx-auto">
      <h1>Blog</h1>

      {publishedPosts.length === 0 && (
        <p>Zatím žádný článek není publikovaný.</p>
      )}

      <ul className="flex flex-col gap-6">
        {publishedPosts.map((post) => (
          <li key={post.id}>
            <Link href={`/blog/${post.slug}`} className="group block not-prose">
              <div className="flex items-baseline justify-between mb-3">
                <h2 className="text-xl font-semibold group-hover:underline">
                  {post.title}
                </h2>
                {post.publishedAt && (
                  <p className="text-sm text-gray-400 shrink-0 ml-4">
                    {new Date(post.publishedAt).toLocaleDateString("cs-CZ", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                )}
              </div>
              <div className="flex gap-5">
                {post.coverImage && (
                  <div className="relative shrink-0 w-48 aspect-video rounded-lg overflow-hidden">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    />
                  </div>
                )}
                {post.excerpt && (
                  <p className="text-gray-600">{post.excerpt}</p>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
