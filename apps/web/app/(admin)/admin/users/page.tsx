"use client";

import { useState } from "react";
import { useAdminState } from "@/lib/store/AdminStateContext";
import { avatarUrl, type UserRole } from "@/lib/data/admin";

const roleFilters: (UserRole | "Всі")[] = ["Всі", "Покупець", "Продавець", "Блогер", "Компанія"];

export default function AdminUsersPage() {
  const { users, toggleUserStatus } = useAdminState();
  const [filter, setFilter] = useState<UserRole | "Всі">("Всі");
  const [query, setQuery] = useState("");

  const rows = users.filter(
    (u) =>
      (filter === "Всі" || u.role === filter) &&
      (u.name.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex flex-wrap gap-2.5">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Пошук за іменем або email…"
          className="min-w-[200px] flex-1 rounded-xl border border-border bg-surface px-4 py-2.5 text-[13px] font-semibold outline-none"
        />
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {roleFilters.map((f) => (
            <span
              key={f}
              onClick={() => setFilter(f)}
              className="flex-none cursor-pointer whitespace-nowrap rounded-full border px-3.5 py-2 text-[12.5px] font-extrabold"
              style={{
                borderColor: filter === f ? "var(--accent)" : "var(--border)",
                background: filter === f ? "var(--accent)" : "var(--surface)",
                color: filter === f ? "#fff" : "var(--text)",
              }}
            >
              {f === "Всі" ? `Всі (${users.length})` : f}
            </span>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-card border border-border bg-surface">
        {rows.map((u) => (
          <div key={u.id} className="flex flex-wrap items-center gap-3.5 border-b border-border p-4.5 last:border-0">
            <img src={avatarUrl(u.av)} alt={u.name} className="h-11 w-11 rounded-2xl object-cover" />
            <div className="min-w-[160px] flex-[2]">
              <div className="text-[13.5px] font-extrabold">{u.name}</div>
              <div className="text-xs font-semibold text-muted">{u.email}</div>
            </div>
            <span className="rounded-lg bg-surface2 px-2.5 py-1 text-[11px] font-extrabold text-muted">{u.role}</span>
            <div className="min-w-[100px] flex-1 text-[11.5px] font-semibold text-muted">
              {u.orders} замовлень · з {u.joined}
            </div>
            <span
              className={`whitespace-nowrap rounded-lg px-2.5 py-1 text-[11px] font-extrabold ${
                u.status === "Активний" ? "bg-success text-white" : "bg-danger text-white"
              }`}
            >
              {u.status}
            </span>
            <button
              onClick={() => toggleUserStatus(u.id)}
              className="rounded-[10px] border border-border bg-surface2 px-3.5 py-2 text-xs font-extrabold hover:border-accent"
            >
              {u.status === "Активний" ? "Заблокувати" : "Розблокувати"}
            </button>
          </div>
        ))}
        {rows.length === 0 && (
          <div className="py-10 text-center text-[13px] font-semibold text-muted">Нічого не знайдено</div>
        )}
      </div>
    </div>
  );
}
