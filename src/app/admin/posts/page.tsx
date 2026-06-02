export const dynamic = "force-dynamic";

import { db } from "@/db";
import { posts } from "@/db/schema";
import { PostsDashboard } from "@editor/PostsDashboard";

export default async function AdminPostsPage() {
  const allPosts = await db.select().from(posts);

  return <PostsDashboard posts={allPosts} />;
}
