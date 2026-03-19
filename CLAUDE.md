# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run lint      # Run ESLint
npm run docs      # Generate TypeDoc documentation
```

### Database (Drizzle)

```bash
npx drizzle-kit generate   # Generate migrations from schema changes
npx drizzle-kit migrate    # Apply migrations to db.sqlite
npx drizzle-kit studio     # Open Drizzle Studio (DB browser)
```

## Architecture

**Mahuba** is a Czech-language personal blog (health/nutrition/alternative medicine) built with Next.js App Router, Drizzle ORM + SQLite, and Tiptap for rich text editing.

### Path Aliases

Two domain aliases are configured in `tsconfig.json`:

- `@editor/*` — resolves to components, types, server actions, and utils under `@editor/` directories
- `@blog/*` — resolves to components, types, server actions, and utils under `@blog/` directories
- `@/*` — resolves to `src/*`

### Data Model

`src/db/schema.ts` defines two tables:

- **posts** — `id`, `title`, `slug` (unique), `content` (JSON), `published` (boolean), `createdAt`
- **users** — `id`, `email`, `passwordHash`, `role`, `createdAt` (auth not yet implemented)

Post content is stored as `PostContent` (a `Block[]` array serialized to JSON). Currently only `RichTextBlock` exists, but the type system is designed for extension.

### Block Editor System

The editor uses a custom block-based architecture built on top of Tiptap:

- **`PostContent`** = `Block[]` — the serialized post content stored in the DB
- **`Block`** = discriminated union (currently only `RichTextBlock`)
- **`RichTextBlock`** = `{ type: "richText", id: BlockId, content: JSONContent }` where `JSONContent` is Tiptap/ProseMirror JSON
- **`BlockId`** = branded `string` type for type-safe block identity

Editor components live in `src/components/@editor/`:

- `NewPostEditor` / `EditPostEditor` — top-level wrappers that call server actions
- `BlockEditor` — manages block state (add/update/delete blocks)
- `RichTextEditor` — single Tiptap instance per block with bubble menu (Bold/Italic)
- `PostMetadataForm` — title + slug fields with auto-slug generation

Blog rendering in `src/components/@blog/`:

- `RichTextBlockRenderer` — converts `RichTextBlock.content` (JSONContent) → HTML using Tiptap's `generateHTML`

### Server Actions

All mutations are Next.js Server Actions in `src/server/@editor/`:

- `createPost` — inserts post, redirects to `/admin/posts`
- `updatePost` — updates title/slug/content, sanitizes slug
- `deletePost` — deletes by id
- `togglePublish` — flips `published` flag

### Runtime type guards

`src/utils/@editor/` has guards for deserializing DB JSON back into typed objects: `isPostContent` → `isRichTextBlock` → `isJSONContent`. Use these when reading `post.content` from the DB.

### Styling

Tailwind CSS v4 (imported via `@import "tailwindcss"` in `globals.css`). The `@tailwindcss/typography` plugin is loaded globally — use `prose` classes on blog post content.

### Adding a New Block Type

1. Add a type file in `src/types/@editor/` (e.g., `ImageBlock.ts`) with `type: "image"`
2. Add it to the `Block` union in `src/types/@editor/Block.ts`
3. Add a type guard in `src/utils/@editor/`
4. Update `isPostContent` to handle the new type
5. Create a renderer component in `src/components/@blog/`
6. Create an editor component in `src/components/@editor/`

### Commenting

Comments should adhere to tsdoc specification.
