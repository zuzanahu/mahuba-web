import { db } from "@/db";
import { Post, posts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { isPostContent } from "@editor/isPostContent";
import { EditPostEditor } from "@editor/EditPostEditor";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const initialPost: Post = await db
    .select()
    .from(posts)
    .where(eq(posts.id, Number(id)))
    .then((res) => res[0]);

  if (!initialPost) {
    notFound();
  }

  if (!isPostContent(initialPost.content)) {
    notFound();
  }

  return <EditPostEditor initialPost={initialPost} />;
}
