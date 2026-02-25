import fs from "fs";
import { Metadata } from "next";
import Link from "next/link";
import path from "path";

export const metadata: Metadata = {
  title: "Blog",
  description: "Články o výživě a zdraví",
};

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

export default function BlogPage() {
  const files = fs.readdirSync(BLOG_DIR);

  const posts = files.map((file) => {
    const slug = file.replace(".mdx", "");
    return { slug };
  });

  return (
    <>
      <h1>Blog</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`}>
              {post.slug.replace(/-/g, " ")}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
