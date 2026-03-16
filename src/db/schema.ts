import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

/**
 * Drizzle ORM table definition for the `users` table.
 *
 * @remarks
 * Stores admin accounts that are authorised to manage blog posts.
 * Currently only a single `"admin"` role is used, but the `role` column
 * is kept explicit to make future role-based access control easier to add.
 *
 * Columns:
 * - `id` — Auto-incrementing primary key.
 * - `email` — Unique e-mail address used as the login identifier.
 * - `passwordHash` — Bcrypt (or equivalent) hash of the user's password.
 *   **Never store plaintext passwords.**
 * - `role` — Access-control role; defaults to `"admin"`.
 * - `createdAt` — UTC timestamp recorded when the row is first inserted.
 */
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("admin"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(new Date()),
});

/**
 * Drizzle ORM table definition for the `posts` table.
 *
 * @remarks
 * Stores blog posts authored through the block editor.
 * The `content` column holds a {@link PostContent} value serialised as JSON —
 * an ordered array of {@link Block} objects. After reading a row back from the
 * database the value must be validated with {@link isPostContent} before use,
 * because Drizzle deserialises it as `unknown`.
 *
 * Columns:
 * - `id` — Auto-incrementing primary key.
 * - `title` — Human-readable title displayed in listings and the `<h1>` of the
 *   post page.
 * - `slug` — URL-safe identifier used in the public route `/blog/[slug]`.
 *   Must be unique across all posts.
 * - `content` — Block editor content stored as a JSON array of {@link Block}
 *   objects (see {@link PostContent}).
 * - `published` — When `true` the post is visible on the public blog; when
 *   `false` it is only accessible in the admin panel. Toggled via
 *   {@link togglePublish}.
 * - `createdAt` — UTC timestamp recorded when the row is first inserted.
 */
export const posts = sqliteTable("posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content", { mode: "json" }).notNull(),
  published: integer("published", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(new Date()),
});

/**
 * TypeScript type for a row selected from the {@link posts} table.
 *
 * @remarks
 * Inferred automatically by Drizzle from the {@link posts} table definition.
 * Use this type whenever you read a complete post record from the database,
 * for example as the `initialPost` prop of {@link EditPostEditor}.
 *
 * Note that the `content` field is typed as `unknown` by Drizzle because the
 * column uses `{ mode: "json" }`. Always narrow it with {@link isPostContent}
 * before treating it as {@link PostContent}.
 *
 * @see {@link NewPost} for the insert counterpart.
 */
export type Post = typeof posts.$inferSelect;

/**
 * TypeScript type for a row to be inserted into the {@link posts} table.
 *
 * @remarks
 * Inferred automatically by Drizzle from the {@link posts} table definition.
 * All columns that have a default value (e.g. `published`, `createdAt`) are
 * optional in this type. Use it as the parameter type for {@link createPost}.
 *
 * @see {@link Post} for the select counterpart.
 */
export type NewPost = typeof posts.$inferInsert;
