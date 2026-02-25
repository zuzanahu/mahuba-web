"use server";

import { db } from "@/db";
import { posts } from "@/db/schema";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

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
  revalidatePath("/blog");

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
