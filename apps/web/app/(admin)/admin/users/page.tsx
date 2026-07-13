"use client";

import { useState } from "react";
import type { UserRole } from "@treetex/shared";
import { useAdminState } from "@/lib/store/AdminStateContext";
import { useAdminUsers, roleLabel } from "@/lib/data/useAdminUsers";

const roleFilters: (UserRole | "all")[] = ["all", "buyer", "seller", "blogger", "admin"];

export default function AdminUsersPage() {
  const { users, total, loading, filters, setFilters, setBlocked } = useAdminUsers();
  const { showToast } = useAdminState();
  const [query, setQuery] = useState("");

  function handleSearch(value: string) {
    setQuery(value);
    setFilters((f) => ({ ...f, search: value || undefined }));
  }

  function handleRoleFilter(role: UserRole | "all") {
    setFilters((f) => ({ ...f, role: role === "all" ? undefined : role }));
  }

  async function handleToggleBlock(id: number, blocked: boolean) {
    await setBlocked(id, blocked);
    showToast(blocked ? "Користувача заблоковано" : "Користувача розблоковано");
  }

  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex flex-wrap gap-2.5">
        <input
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Пошук за іменем або email…"
          className="min-w-[200px] flex-1 rounded-xl border border-border bg-surface px-4 py-2.5 text-[13px] font-semibold outline-none"
        />
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {roleFilters.map((f) => (
            <span
              key={f}
              onClick={() => handleRoleFilter(f)}
              className="flex-none cursor-pointer whitespace-nowrap rounded-full border px-3.5 py-2 text-[12.5px] font-extrabold"
              style={{
                borderColor: (filters.role ?? "all") === f ? "var(--accent)" : "var(--border)",
                background: (filters.role ?? "all") === f ? "var(--accent)" : "var(--surface)",
                color: (filters.role ?? "all") === f ? "#fff" : "var(--text)",
              }}
            >
              {f === "all" ? `Всі (${total})` : roleLabel(f)}
            </span>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-card border border-border bg-surface">
        {loading && <div className="py-10 text-center text-[13px] font-semibold text-muted">Завантаження…</div>}
        {!loading &&
          users.map((u) => (
            <div key={u.id} className="flex flex-wrap items-center gap-3.5 border-b border-border p-4.5 last:border-0">
              <div className="min-w-[160px] flex-[2]">
                <div className="text-[13.5px] font-extrabold">{u.name}</div>
                <div className="text-xs font-semibold text-muted">{u.email}</div>
              </div>
              <span className="rounded-lg bg-surface2 px-2.5 py-1 text-[11px] font-extrabold text-muted">
                {roleLabel(u.role)}
              </span>
              <div className="min-w-[100px] flex-1 text-[11.5px] font-semibold text-muted">
                {u.createdAt && `з ${new Date(u.createdAt).toLocaleDateString("uk-UA")}`}
              </div>
              <span
                className={`whitespace-nowrap rounded-lg px-2.5 py-1 text-[11px] font-extrabold ${
                  u.blocked ? "bg-danger text-white" : "bg-success text-white"
                }`}
              >
                {u.blocked ? "Заблокований" : "Активний"}
              </span>
              <button
                onClick={() => handleToggleBlock(u.id, !u.blocked)}
                className="rounded-[10px] border border-border bg-surface2 px-3.5 py-2 text-xs font-extrabold hover:border-accent"
              >
                {u.blocked ? "Розблокувати" : "Заблокувати"}
              </button>
            </div>
          ))}
        {!loading && users.length === 0 && (
          <div className="py-10 text-center text-[13px] font-semibold text-muted">Нічого не знайдено</div>
        )}
      </div>
    </div>
  );
}
