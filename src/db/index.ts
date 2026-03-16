import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

/**
 * The underlying `better-sqlite3` database connection.
 *
 * @remarks
 * Opens (or creates) the SQLite database file at `db.sqlite` relative to the
 * current working directory (i.e. the project root). The connection is created
 * once at module initialisation time and reused for the lifetime of the process.
 *
 * @internal
 * Prefer using the {@link db} Drizzle instance for all query operations rather
 * than interacting with `sqlite` directly.
 *
 * @see {@link https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md | better-sqlite3 API docs}
 */
const sqlite = new Database("db.sqlite");

/**
 * The application-wide Drizzle ORM database client.
 *
 * @remarks
 * Wraps the {@link sqlite} `better-sqlite3` connection with Drizzle's
 * type-safe query builder. Import and use this instance everywhere database
 * access is required — for example in server actions such as {@link createPost},
 * {@link updatePost}, {@link deletePost}, and {@link togglePublish}, as well as
 * in Next.js page components that fetch data at request time.
 *
 * Because `better-sqlite3` is a synchronous driver, all Drizzle calls made
 * through this instance are also synchronous under the hood, even though the
 * Drizzle API returns `Promise`-like objects for compatibility.
 *
 * @example
 * ```ts
 * import { db } from "@/db";
 * import { posts } from "@/db/schema";
 *
 * const allPosts = await db.select().from(posts);
 * ```
 *
 * @see {@link https://orm.drizzle.team/docs/get-started-sqlite | Drizzle + SQLite docs}
 */
export const db = drizzle(sqlite);
