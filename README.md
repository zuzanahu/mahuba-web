# Mahuba Web

A fullstack content platform and CMS built with **Next.js**, **React** and **TypeScript**.

> [!WARNING]
> Work in progress — currently building the MVP

## About the Project

This project is intended for personal blogs powered by a custom-built admin dashboard. The focus is on clean architecture, modern Next.js patterns (such as Server Actions and the App Router), and a smooth content editing experience.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** SQLite + Drizzle ORM
- **Editor:** Tiptap (block-based rich text)

## Features

### Admin Panel (MVP)
- Authentication with protected `/admin` routes and middleware session check
- Block-based article editor (paragraph + image blocks)
- Autosave with debounce — content saves automatically as you type
- Draft / publish / archive workflow
- Article management — create, edit, delete with confirmation
- Metadata per article: title, slug (auto-generated + editable), cover image, excerpt, meta description
- Dashboard with filtering by title, status and date

### Public Blog (MVP)
- List of published articles with cover images and dates
- Dynamic article pages at `/blog/[slug]`
- Dynamic SEO metadata (title + description) per article
- 404 handling for non-existent slugs

## Architecture Highlights

- **Server Actions** for mutations — RPC-style transport using POST method
- **Status-based post model** (`draft | published`) — designed for extensibility from the start
- **Block content** stored as a JSON array — flexible, renderer-agnostic document model powered by Tiptap (ProseMirror), easy to extend with new block types
- **Admin routes use post `id`** instead of slug — stays stable when the slug changes
- **`publishedAt` column** separate from `createdAt` — used for correct chronological ordering on the public blog

## Getting Started

```bash
npm install
npm run build
npm run start
```

## Roadmap

- [ ] Quote, video and embed blocks
- [ ] Drag-and-drop block reordering
- [ ] Multi-column block layout
- [ ] Post categories & filtering by category
