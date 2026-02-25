import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { updatePost } from "../../actions";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const post = await db
    .select()
    .from(posts)
    .where(eq(posts.id, Number(id)))
    .then((res) => res[0]);

  if (!post) {
    notFound();
  }

  return (
    <form action={updatePost}>
      <h1>Edit post</h1>

      <input type="hidden" name="id" value={post.id} />

      <div>
        <label>
          Title
          <input name="title" defaultValue={post.title} required />
        </label>
      </div>

      <div>
        <label>
          Slug
          <input name="slug" defaultValue={post.slug} required />
        </label>
      </div>

      <div>
        <label>
          Content
          <textarea
            name="content"
            rows={12}
            defaultValue={post.content}
            required
          />
        </label>
      </div>

      <button type="submit">Save</button>
    </form>
  );
}
