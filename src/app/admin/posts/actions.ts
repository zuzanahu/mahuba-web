"use server";

import { db } from "@/db";
import { posts } from "@/db/schema";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
// At the end of every action revalidate static routes.
// Just redirecting is not enough, new changes won't be visible to the user.
import { revalidatePath } from "next/cache";

export async function createPost(formData: FormData) {
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const content = formData.get("content") as string;

  if (!title || !slug || !content) {
    throw new Error("Missing fields");
  }

  await db.insert(posts).values({
    title,
    slug,
    content,
    published: false,
  });

  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}

export async function deletePost(formData: FormData) {
  const id = Number(formData.get("id"));

  if (!id) {
    throw new Error("Missing post id");
  }

  await db.delete(posts).where(eq(posts.id, id));

  revalidatePath("/admin/posts");
  revalidatePath("/blog");
}

export async function togglePublish(formData: FormData) {
  const id = Number(formData.get("id"));
  const published = formData.get("published") === "true";

  if (!id) {
    throw new Error("Missing post id");
  }

  await db.update(posts).set({ published }).where(eq(posts.id, id));

  revalidatePath("/admin/posts");
  revalidatePath("/blog");
}

export async function updatePost(formData: FormData) {
  const id = Number(formData.get("id"));
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const content = formData.get("content") as string;

  if (!id || !title || !slug || !content) {
    throw new Error("Missing fields");
  }

  await db
    .update(posts)
    .set({
      title,
      slug,
      content,
    })
    .where(eq(posts.id, id));

  revalidatePath("/admin/posts");
  revalidatePath("/blog");

  // TBD let the user know the post was updated successfully
}
