"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import type { Post } from "@/db/schema";
import { deletePost } from "@editor/deletePost";
import { NavSlot } from "@admin/Nav";

const STATUS_LABELS: Record<string, string> = {
  published: "Publikováno",
  draft: "Koncept",
  archived: "Archivováno",
};

const STATUS_OPTIONS = [
  { value: "", label: "Status" },
  { value: "published", label: "Publikováno" },
  { value: "draft", label: "Koncept" },
  { value: "archived", label: "Archivováno" },
];

export function PostsDashboard({ posts }: { posts: Post[] }) {
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = (id: number) => {
    if (!confirm("Opravdu smazat tento příspěvek?")) return;
    setDeletingId(id);
    const fd = new FormData();
    fd.append("id", String(id));
    startTransition(async () => {
      await deletePost(fd);
      setDeletingId(null);
    });
  };

  const filtered = posts.filter((post) => {
    if (search && !post.title.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    const createdMs = post.createdAt ? new Date(post.createdAt).getTime() : 0;
    if (dateFrom && createdMs < new Date(dateFrom).getTime()) return false;
    if (dateTo && createdMs > new Date(dateTo).getTime() + 86_400_000) return false; // +86 400 000 ms = end of day, so dateTo is inclusive
    if (statusFilter && post.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <NavSlot
        title="Správa článků"
        actions={[{ label: "Nový článek", href: "/admin/posts/new", variant: "outline" }]}
      />

      {/* Content */}
      <div className="px-6 py-6">
        {/* Filter bar */}
        <div className="border border-gray-300 rounded-md bg-white p-4 mb-4 flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Hledat podle názvu"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
          <input
            type="date"
            title="Datum od"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
          <input
            type="date"
            title="Datum do"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="border border-gray-300 rounded-md bg-white overflow-hidden">
          {/* Header row */}
          <div className="grid grid-cols-[2fr_1fr_1fr_7rem] border-b border-gray-300">
            <div className="px-4 py-3 text-sm font-medium">Název</div>
            <div className="px-4 py-3 text-sm font-medium">Status</div>
            <div className="px-4 py-3 text-sm font-medium">Datum vytvoření</div>
            <div className="px-4 py-3 text-sm font-medium text-right">Editovat</div>
          </div>

          {filtered.map((post) => (
            <div
              key={post.id}
              className="grid grid-cols-[2fr_1fr_1fr_7rem] border-b border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="px-4 py-4 text-sm">{post.title}</div>
              <div className="px-4 py-4 text-sm">
                {STATUS_LABELS[post.status] ?? post.status}
              </div>
              <div className="px-4 py-4 text-sm">
                {post.createdAt
                  ? new Date(post.createdAt).toLocaleDateString("cs-CZ")
                  : "—"}
              </div>
              <div className="px-4 py-4 flex items-center justify-end gap-3">
                <Link href={`/admin/posts/${post.id}`}>
                  <PencilSquareIcon className="w-5 h-5 text-amber-500" />
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(post.id)}
                  disabled={isPending && deletingId === post.id}
                  className="text-red-400 hover:text-red-600 transition-colors disabled:opacity-40"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="px-4 py-8 text-sm text-gray-400 text-center">
              Žádné příspěvky nenalezeny
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
