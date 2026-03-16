import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { isPostContent } from "@editor/isPostContent";
import { RichTextBlockRenderer } from "@/components/@blog/RichTextBlockRenderer";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [post] = await db.select().from(posts).where(eq(posts.slug, slug));

  if (!post) {
    notFound();
  }

  // If post content is not correct format then do not render it.
  if (!isPostContent(post?.content)) {
    // notFound()
    throw new Error(
      `Post content is not in the correct format:\n${JSON.stringify(post.content, null, 2)}`,
    );
  }

  if (!post || post.published !== true) {
    notFound();
  }

  return (
    <article className="prose prose-lg mx-auto prose-slate">
      <h1>{post.title}</h1>
      {
        // Render all post content blocks using the RichTextBlockRenderer.
        post.content.map((block) => (
          // Render other block types here as needed, e.g. ImageBlockRenderer for image blocks, etc.
          <div key={block.id}>
            <RichTextBlockRenderer block={block} />
          </div>
        ))
      }
    </article>
  );
}
